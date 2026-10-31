import { createClient } from "@supabase/supabase-js";
import Razorpay from "razorpay";
import crypto from "crypto";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const token = request.headers
      .get("authorization")
      ?.replace(/^Bearer\s+/i, "");

    if (!token) {
      return Response.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return Response.json(
        { error: "Invalid login session." },
        { status: 401 }
      );
    }

    const {
      paymentId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await request.json();

    if (
      !paymentId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return Response.json(
        { error: "Missing payment verification details." },
        { status: 400 }
      );
    }

    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("id, employer_id, amount, status")
      .eq("id", paymentId)
      .eq("employer_id", user.id)
      .maybeSingle();

    if (paymentError) throw paymentError;

    if (!payment) {
      return Response.json(
        { error: "Payment not found or you are not authorized." },
        { status: 404 }
      );
    }

    if (payment.status === "Paid") {
      return Response.json({
        success: true,
        message: "This payment has already been recorded.",
      });
    }

    if (payment.status !== "Pending") {
      return Response.json(
        { error: "This payment is not pending." },
        { status: 400 }
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const received = Buffer.from(razorpay_signature, "hex");
    const expected = Buffer.from(expectedSignature, "hex");

    if (
      received.length !== expected.length ||
      !crypto.timingSafeEqual(received, expected)
    ) {
      return Response.json(
        { error: "Payment signature verification failed." },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const [order, razorpayPayment] = await Promise.all([
      razorpay.orders.fetch(razorpay_order_id),
      razorpay.payments.fetch(razorpay_payment_id),
    ]);

    const expectedAmount = Math.round(Number(payment.amount) * 100);

    if (
      order.receipt !== payment.id ||
      order.amount !== expectedAmount ||
      order.currency !== "INR"
    ) {
      return Response.json(
        { error: "The Razorpay order does not match this Nivra payment." },
        { status: 400 }
      );
    }

    if (
      razorpayPayment.order_id !== razorpay_order_id ||
      razorpayPayment.amount !== expectedAmount ||
      razorpayPayment.currency !== "INR" ||
      razorpayPayment.status !== "captured"
    ) {
      return Response.json(
        { error: "Razorpay has not confirmed a successful captured payment." },
        { status: 400 }
      );
    }

    const { error: rpcError } = await supabase.rpc("mark_payment_paid", {
      p_payment_id: payment.id,
      p_payment_reference: razorpay_payment_id,
    });

    if (rpcError) throw rpcError;

    return Response.json({
      success: true,
      message: "Payment verified and recorded successfully.",
    });
  } catch (error) {
    console.error("Razorpay verification error:", error);

    return Response.json(
      { error: error.message || "Could not verify payment." },
      { status: 500 }
    );
  }
}