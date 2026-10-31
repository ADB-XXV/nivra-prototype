import { createClient } from "@supabase/supabase-js";
import Razorpay from "razorpay";

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
        { error: "Invalid login session. Please log in again." },
        { status: 401 }
      );
    }

    const { paymentId } = await request.json();

    if (!paymentId) {
      return Response.json(
        { error: "Payment ID is required." },
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

    if (payment.status !== "Pending") {
      return Response.json(
        { error: "This payment is no longer pending." },
        { status: 400 }
      );
    }

    const amountInPaise = Math.round(Number(payment.amount) * 100);

    if (!Number.isSafeInteger(amountInPaise) || amountInPaise <= 0) {
      return Response.json(
        { error: "Invalid payment amount." },
        { status: 400 }
      );
    }

    if (
      !process.env.RAZORPAY_KEY_ID ||
      !process.env.RAZORPAY_KEY_SECRET
    ) {
      throw new Error("Razorpay keys are not configured on the server.");
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: payment.id,
      notes: {
        nivra_payment_id: payment.id,
        employer_id: user.id,
      },
    });

    return Response.json({
      keyId: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);

    return Response.json(
      { error: error.message || "Could not create payment order." },
      { status: 500 }
    );
  }
}