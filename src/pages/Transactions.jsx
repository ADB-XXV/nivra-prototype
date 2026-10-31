
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import EmployerNavbar from "../components/EmployerNavbar";
import { supabase } from "../lib/supabase";

const FEE_RATE = 3.3;
const TAGS = ["Punctual", "Professional", "Hardworking", "Good communication", "Skilled"];
const REASONS = [
  "The student did not attend",
  "The student left before finishing the job",
  "Something else went wrong",
];

const rupees = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

const initials = (name) =>
  (name || "Student").split(" ").map((p) => p[0]).slice(0, 2).join("");

const stars = (n) => "★".repeat(n || 0) + "☆".repeat(5 - (n || 0));

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Candidate({ name, id }) {
  return (
    <div className="tr-candidate">
      <div className="tr-avatar">{initials(name)}</div>
      <strong>
        <Link className="tr-name" href={`/candidate-profile?id=${id}`}>
          {name}
        </Link>
      </strong>
    </div>
  );
}

function StarPicker({ value, onChange }) {
  return (
    <div className="tr-stars" role="radiogroup" aria-label="Rating out of 5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} ${n === 1 ? "star" : "stars"}`}
          className={n <= value ? "on" : ""}
          onClick={() => onChange(n)}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function PaymentSummary({ amount, fee, studentAmount }) {
  return (
    <table className="tr-sum">
      <tbody>
        <tr>
          <td>Total employer payment</td>
          <td>{rupees(amount)}</td>
        </tr>
        <tr>
          <td>Nivra commission (3.3%)</td>
          <td>{rupees(fee)}</td>
        </tr>
        <tr className="total">
          <td>Student receives</td>
          <td>{rupees(studentAmount)}</td>
        </tr>
      </tbody>
    </table>
  );
}
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
}
export default function Transactions() {
  const [awaiting, setAwaiting] = useState([]);
  const [due, setDue] = useState([]);
  const [history, setHistory] = useState([]);
  const [disputes] = useState([]);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [saving, setSaving] = useState(false);

  const [modal, setModal] = useState(null);
  const [answer, setAnswer] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [tags, setTags] = useState([]);
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");
  const [evidence, setEvidence] = useState("");
  const [error, setError] = useState("");

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    setPageError("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;
      if (!user) throw new Error("Please log in again to view transactions.");

      const { data: jobs, error: jobsError } = await supabase
        .from("jobs")
        .select("id, employer_id, title, date, hours, amount")
        .eq("employer_id", user.id);

      if (jobsError) throw jobsError;

      const jobList = jobs || [];
      const jobMap = Object.fromEntries(jobList.map((job) => [job.id, job]));
      const jobIds = jobList.map((job) => job.id);

      if (jobIds.length === 0) {
        setAwaiting([]);
        setDue([]);
        setHistory([]);
        setLoading(false);
        return;
      }

      const [
        { data: applications, error: applicationsError },
        { data: payments, error: paymentsError },
      ] = await Promise.all([
        supabase
          .from("applications")
          .select(
            "id, job_id, student_id, status, applied_at, completed_at, verified_at, paid_at, rating, review, review_tags"
          )
          .in("job_id", jobIds),

        supabase
          .from("payments")
          .select(
            "id, application_id, job_id, employer_id, student_id, amount, platform_fee, student_amount, status, payment_reference, paid_at, created_at, commission_rate"
          )
          .eq("employer_id", user.id),
      ]);

      if (applicationsError) throw applicationsError;
      if (paymentsError) throw paymentsError;

      const applicationList = applications || [];
      const paymentList = payments || [];

      const studentIds = [
        ...new Set([
          ...applicationList.map((a) => a.student_id),
          ...paymentList.map((p) => p.student_id),
        ]),
      ];

      let profileMap = {};

      if (studentIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", studentIds);

        if (profilesError) throw profilesError;

        profileMap = Object.fromEntries(
          (profiles || []).map((profile) => [
            profile.id,
            profile.full_name || "Student",
          ])
        );
      }

      const applicationMap = Object.fromEntries(
        applicationList.map((application) => [application.id, application])
      );

      const makeRow = (application, payment = null) => {
        const job = jobMap[application?.job_id || payment?.job_id] || {};
        const amount = Number(payment?.amount ?? job.amount ?? 0);
        const fee = Number(
          payment?.platform_fee ??
            Math.round(amount * FEE_RATE) / 100
        );
        const studentAmount = Number(
          payment?.student_amount ?? amount - fee
        );

        return {
          id: application?.id || payment?.application_id,
          paymentId: payment?.id || null,
          studentId: payment?.student_id || application?.student_id,
          name:
            profileMap[payment?.student_id || application?.student_id] ||
            "Student",
          job: job.title || "Job",
          worked: formatDate(job.date),
          hours: job.hours || "—",
          amount,
          fee,
          studentAmount,
          rating: application?.rating || 0,
          review: application?.review || "",
          tags: application?.review_tags || [],
          paidOn: formatDate(payment?.paid_at),
          ref: payment?.payment_reference || "—",
        };
      };

      const pendingPayments = paymentList.filter(
        (payment) => payment.status === "Pending"
      );

      const paidPayments = paymentList.filter(
        (payment) => payment.status === "Paid"
      );

      const pendingApplicationIds = new Set(
        pendingPayments.map((payment) => payment.application_id)
      );

      const verifiedApplicationIds = new Set(
        paymentList.map((payment) => payment.application_id)
      );

      setAwaiting(
        applicationList
          .filter(
            (application) =>
              application.completed_at &&
              !application.verified_at &&
              !verifiedApplicationIds.has(application.id)
          )
          .map((application) => makeRow(application))
      );

      setDue(
        pendingPayments.map((payment) =>
          makeRow(
            applicationMap[payment.application_id],
            payment
          )
        )
      );

      setHistory(
        paidPayments.map((payment) =>
          makeRow(
            applicationMap[payment.application_id],
            payment
          )
        )
      );
    } catch (err) {
      console.error("Transactions loading error:", err);
      setPageError(err.message || "Could not load transactions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  function openModal(mode, row) {
    setModal({ mode, row });
    setAnswer("");
    setRating(row.rating || 0);
    setReview(row.review || "");
    setTags(row.tags || []);
    setReason("");
    setComments("");
    setEvidence("");
    setError("");
  }

  const closeModal = () => {
    if (!saving) setModal(null);
  };

  useEffect(() => {
    if (!modal) return;
    const onKey = (e) => e.key === "Escape" && closeModal();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modal, saving]);

  const shownAwaiting = useMemo(
    () => awaiting.filter((r) => r.name.toLowerCase().includes(search.toLowerCase())),
    [awaiting, search]
  );

  const shownDue = useMemo(
    () => due.filter((r) => r.name.toLowerCase().includes(search.toLowerCase())),
    [due, search]
  );

  const shownDisputes = useMemo(
    () => disputes.filter((r) => r.name.toLowerCase().includes(search.toLowerCase())),
    [disputes, search]
  );

  const shownHistory = useMemo(
    () => history.filter((r) => r.name.toLowerCase().includes(search.toLowerCase())),
    [history, search]
  );

  const dueTotal = due.reduce((sum, row) => sum + row.amount, 0);
  const paidTotal = history.reduce((sum, row) => sum + row.amount, 0);

  async function verifyGig() {
    if (!rating) {
      setError("Select a star rating to continue.");
      return null;
    }

    setSaving(true);
    setError("");

    try {
      const { data, error: rpcError } = await supabase.rpc(
        "verify_gig_and_create_payment",
        {
          p_application_id: modal.row.id,
          p_rating: rating,
          p_review: review,
          p_review_tags: tags,
        }
      );

      if (rpcError) throw rpcError;

      await loadTransactions();

      return {
        ...modal.row,
        paymentId: data,
        rating,
        review,
        tags,
      };
    } catch (err) {
      console.error("Gig verification error:", err);
      setError(err.message || "Could not verify this gig.");
      return null;
    } finally {
      setSaving(false);
    }
  }

  async function verifyPayLater() {
    const verifiedRow = await verifyGig();
    if (!verifiedRow) return;

    setModal(null);
    setNotice(
      `${verifiedRow.name}'s gig is verified. A Pending payment record has been created.`
    );
  }

  async function confirmVerifyAndPay() {
    const verifiedRow = await verifyGig();
    if (!verifiedRow) return;

    setModal({
      mode: "pay",
      row: verifiedRow,
    });
    setNotice("Gig verified. Make the transfer before marking the payment as paid.");
  }

  async function confirmPayDue() {
  const row = modal.row;

  if (!row.paymentId) {
    setError("Payment record not found. Refresh and try again.");
    return;
  }

  setSaving(true);
  setError("");

  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) throw sessionError;

    if (!session?.access_token) {
      throw new Error("Your session has expired. Please log in again.");
    }

    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      throw new Error("Could not load Razorpay Checkout. Check your internet connection.");
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    };

    const orderResponse = await fetch("/api/payments/create-order", {
      method: "POST",
      headers,
      body: JSON.stringify({
        paymentId: row.paymentId,
      }),
    });

    const orderData = await orderResponse.json();

    if (!orderResponse.ok) {
      throw new Error(orderData.error || "Could not start payment.");
    }

    const options = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Nivra",
      description: `Payment for ${row.job}`,
      order_id: orderData.orderId,

      handler: async function (response) {
        setSaving(true);
        setError("");

        try {
          const verifyResponse = await fetch("/api/payments/verify", {
            method: "POST",
            headers,
            body: JSON.stringify({
              paymentId: row.paymentId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyResponse.json();

          if (!verifyResponse.ok) {
            throw new Error(
              verifyData.error || "Payment verification failed."
            );
          }

          setModal(null);
          setNotice(
            `Payment for ${row.name} was successfully verified and recorded.`
          );

          await loadTransactions();
        } catch (err) {
          console.error("Payment verification error:", err);
          setError(
            `${err.message} If money was deducted, contact Nivra support before retrying.`
          );
        } finally {
          setSaving(false);
        }
      },

      modal: {
        ondismiss: () => {
          setSaving(false);
        },
      },

      theme: {
        color: "#67464a",
      },
    };

    const checkout = new window.Razorpay(options);

    checkout.on("payment.failed", function (response) {
      setSaving(false);
      setError(
        response.error?.description || "Payment failed. You can try again."
      );
    });

    checkout.open();
  } catch (err) {
    console.error("Razorpay checkout error:", err);
    setError(err.message || "Could not start Razorpay checkout.");
    setSaving(false);
  }
}

  function submitDispute() {
    if (!reason) {
      setError("Tell us what happened.");
      return;
    }

    setError(
      "Dispute reporting is not connected yet. No dispute has been submitted. Please contact Nivra support."
    );
  }

  const toggleTag = (tag) =>
    setTags((current) =>
      current.includes(tag)
        ? current.filter((item) => item !== tag)
        : [...current, tag]
    );

  const row = modal?.row;

  return (
    <div className="nv">
      <EmployerNavbar active="/employer/transactions" />
      <style>{`
        .tr-page{--tr-ink:#302626;--tr-muted:#817471;--tr-border:#e8dcd5;--tr-accent:#67464a;--tr-bg:#faf5f1;
          width:100%;min-height:calc(100vh - 56px);padding:42px clamp(20px,4vw,64px) 60px;background:var(--tr-bg);color:var(--tr-ink);
          font-family:"Manrope","DM Sans",system-ui,sans-serif}
        .tr-page *,.tr-page *::before,.tr-page *::after,.tr-modal *{box-sizing:border-box}
        .tr-container{width:100%;max-width:1800px;margin:0 auto}
        .tr-heading{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;margin-bottom:26px;flex-wrap:wrap}
        .tr-heading h1{margin:0;font-size:clamp(32px,2.8vw,48px);line-height:1.2;letter-spacing:-.7px}
        .tr-subtitle{margin:12px 0 0;color:var(--tr-muted);font-size:16px;line-height:1.6}
        .tr-stats{display:flex;gap:14px;flex-wrap:wrap}
        .tr-stat{padding:13px 18px;border:1px solid var(--tr-border);border-radius:12px;background:#fff;min-width:170px}
        .tr-stat strong{display:block;color:var(--tr-accent);font-size:26px;line-height:1.2}
        .tr-stat span{color:var(--tr-muted);font-size:13px}
        .tr-notice{margin:0 0 20px;padding:12px 16px;border-radius:10px;background:#e7eddf;color:#3f5538;font-size:14px}
        .tr-error{margin:0 0 20px;padding:12px 16px;border-radius:10px;background:#f8e4e2;color:#a33c3c;font-size:14px}
        .tr-toolbar{margin-bottom:24px}
        .tr-search{display:flex;align-items:center;gap:12px;max-width:620px;min-height:44px;padding:0 16px;border:1px solid var(--tr-border);border-radius:10px;background:#fff}
        .tr-search:focus-within{border-color:var(--tr-accent);box-shadow:0 0 0 3px #67464a15}
        .tr-search>span{color:var(--tr-muted);font-size:25px}
        .tr-page .tr-search input,.tr-page .tr-search input:focus,.tr-page .tr-search input:focus-visible{width:100%;min-width:0;padding:9px 0;border:0;outline:none;box-shadow:none;background:transparent;color:var(--tr-ink);font:inherit;font-size:15px}
        .tr-card{width:100%;overflow:hidden;border:1px solid var(--tr-border);border-radius:14px;background:#fff;box-shadow:0 5px 22px #4a2d2608;margin-bottom:28px}
        .tr-card-head{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:22px 26px;border-bottom:1px solid var(--tr-border);flex-wrap:wrap}
        .tr-card-head h2{margin:0;font-size:22px}
        .tr-card-head span{color:var(--tr-muted);font-size:14px}
        .tr-scroll{width:100%;overflow-x:auto}
        .tr-table{width:100%;min-width:900px;border-collapse:collapse;text-align:left}
        .tr-table th{padding:18px 16px;background:#fcf9f7;color:#776965;font-size:12px;font-weight:800;letter-spacing:.6px;text-transform:uppercase;white-space:nowrap}
        .tr-table th:first-child,.tr-table td:first-child{padding-left:26px}
        .tr-table th:last-child,.tr-table td:last-child{padding-right:26px}
        .tr-table td{padding:19px 16px;border-top:1px solid #eee5df;color:#544946;font-size:15px;line-height:1.6;vertical-align:middle}
        .tr-table tbody tr:hover{background:#fdfaf8}
        .tr-amount{font-weight:800;color:#332827;white-space:nowrap}
        .tr-amount small{display:block;font-weight:400;color:var(--tr-muted);font-size:12px}
        .tr-r{text-align:right!important}
        .tr-rating{color:#a8741f;letter-spacing:1px;white-space:nowrap}
        .tr-candidate{display:flex;align-items:center;gap:12px;min-width:170px}
        .tr-avatar{display:grid;flex:0 0 42px;width:42px;height:42px;place-items:center;border-radius:12px;background:#f0e2dc;color:var(--tr-accent);font-size:13px;font-weight:800}
        .tr-candidate strong{color:#332827;font-size:15px}
        .tr-name{color:inherit;text-decoration:none}
        .tr-name:hover{color:var(--tr-accent);text-decoration:underline;text-underline-offset:3px}
        .tr-name:focus-visible{outline:2px solid var(--tr-accent);outline-offset:3px;border-radius:2px}
        .tr-badge{display:inline-flex;padding:7px 11px;border-radius:7px;font-size:12px;font-weight:750;white-space:nowrap}
        .tr-badge.verify{background:#eee5dc;color:#775e4e}
        .tr-badge.due{background:#f2e2de;color:#684449}
        .tr-badge.paid{background:#dceee3;color:#276442}
        .tr-badge.review{background:#f8e4e2;color:#a33c3c}
        .tr-ref{color:var(--tr-muted);font-size:13px}
        .tr-btn{min-height:38px;padding:8px 16px;border:1px solid var(--tr-border);border-radius:8px;background:#fff;color:var(--tr-ink);font:inherit;font-size:13px;font-weight:650;cursor:pointer}
        .tr-btn:hover{background:#f5ece8}
        .tr-btn.pay{border-color:var(--tr-accent);background:var(--tr-accent);color:#fff}
        .tr-btn.pay:hover{background:#513539}
        .tr-btn.danger{border-color:#d7a4a1;color:#a34545}
        .tr-btn:focus-visible{outline:2px solid var(--tr-accent);outline-offset:2px}
        .tr-btn:disabled{opacity:.6;cursor:not-allowed}
        .tr-empty{padding:48px 20px!important;text-align:center}
        .tr-empty strong{display:block;font-size:17px}
        .tr-empty p{margin:8px 0 0;color:var(--tr-muted)}
        .tr-foot{display:flex;justify-content:space-between;gap:16px;padding:16px 26px;border-top:1px solid var(--tr-border);background:#fcf9f7;color:var(--tr-muted);font-size:13px;flex-wrap:wrap}
        .tr-ov{position:fixed;inset:0;background:rgba(30,20,22,.5);display:grid;place-items:center;z-index:30;padding:16px}
        .tr-modal{background:#fff;color:var(--tr-ink,#302626);border-radius:12px;padding:26px;max-width:540px;width:100%;max-height:90vh;overflow:auto;font-family:"Manrope","DM Sans",system-ui,sans-serif;--tr-muted:#817471;--tr-border:#e8dcd5;--tr-accent:#67464a}
        .tr-modal h2{margin:0 0 6px;font-size:20px}
        .tr-modal h3{margin:22px 0 8px;font-size:15px}
        .tr-modal p{margin:0 0 12px;color:var(--tr-muted);font-size:13px}
        .tr-modal dl{margin:12px 0;display:grid;grid-template-columns:auto 1fr;gap:6px 16px;font-size:14px}
        .tr-modal dt{color:var(--tr-muted)}.tr-modal dd{margin:0;font-weight:650}
        .tr-opt{display:flex;gap:10px;align-items:center;padding:11px 13px;border:1px solid var(--tr-border);border-radius:8px;margin-bottom:8px;cursor:pointer;font-size:14px}
        .tr-opt.on{border-color:var(--tr-accent);background:#f7ecea}
        .tr-opt input{accent-color:#67464a}
        .tr-stars{display:flex;gap:4px}
        .tr-stars button{background:none;border:0;font-size:32px;line-height:1;color:#d9cfc9;cursor:pointer;padding:2px}
        .tr-stars button.on{color:#d19a2a}
        .tr-stars button:focus-visible{outline:2px solid var(--tr-accent);border-radius:4px}
        .tr-chips{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0}
        .tr-chip{padding:5px 12px;border:1px solid var(--tr-border);border-radius:6px;background:#fff;color:#302626;font:inherit;font-size:13px;cursor:pointer}
        .tr-chip[aria-pressed="true"]{background:#f2e2de;border-color:#d6a5a5}
        .tr-modal textarea,.tr-modal input[type=file]{width:100%;padding:10px 12px;border:1px solid var(--tr-border);border-radius:8px;font:inherit;font-size:14px;background:#fff;color:#302626}
        .tr-modal textarea{min-height:84px;resize:vertical}
        .tr-sum{width:100%;border-collapse:collapse;font-size:14px}
        .tr-sum td{padding:9px 0;border-bottom:1px solid #eee5df}
        .tr-sum td:last-child{text-align:right;font-weight:650}
        .tr-sum tr.total td{border-bottom:0;font-weight:800;font-size:15px}
        .tr-err{color:#a33c3c!important;font-size:13px;margin:12px 0 0!important}
        .tr-modal-actions{display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap;margin-top:20px}
        @media(max-width:760px){
          .tr-page{padding:28px 16px 40px}
          .tr-heading{align-items:flex-start;flex-direction:column;gap:18px}
          .tr-stat{min-width:0;flex:1}
          .tr-card-head,.tr-foot{align-items:flex-start;flex-direction:column;padding:18px}
          .tr-scroll{overflow:visible}
          .tr-table,.tr-table tbody{display:block;width:100%;min-width:0}
          .tr-table thead{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
          .tr-table tbody tr{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));padding:12px 16px;border-top:1px solid #eee5df}
          .tr-table td{display:flex;flex-direction:column;align-items:flex-start;gap:5px;padding:10px 2px!important;border:0;min-width:0;overflow-wrap:anywhere;font-size:14px;text-align:left!important}
          .tr-table td::before{content:attr(data-label);color:var(--tr-muted);font-size:11px;font-weight:800;letter-spacing:.5px;text-transform:uppercase}
          .tr-table td:first-child,.tr-table td:last-child{grid-column:1/-1}
          .tr-table td:first-child::before,.tr-table td.tr-empty::before{content:none}
          .tr-table td.tr-empty{grid-column:1/-1}
          .tr-modal-actions .tr-btn{flex:1 1 100%}
        }
      `}</style>

      <main className="tr-page">
        <div className="tr-container">
          <header className="tr-heading">
            <div>
              <h1>Transactions</h1>
              <p className="tr-subtitle">
                Malabar Events · Verify completed gigs, then pay your students
              </p>
            </div>
            <div className="tr-stats">
              <div className="tr-stat">
                <strong>{awaiting.length}</strong>
                <span>awaiting verification</span>
              </div>
              <div className="tr-stat">
                <strong>{rupees(dueTotal)}</strong>
                <span>payment due for {due.length} {due.length === 1 ? "student" : "students"}</span>
              </div>
              <div className="tr-stat">
                <strong>{rupees(paidTotal)}</strong>
                <span>paid across {history.length} payments</span>
              </div>
            </div>
          </header>

          {notice && <p className="tr-notice" role="status">{notice}</p>}
          {pageError && <p className="tr-error" role="alert">{pageError}</p>}

          <section className="tr-toolbar">
            <label className="tr-search">
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                placeholder="Search by student name..."
                aria-label="Search transactions by student name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
          </section>

          <section className="tr-card" aria-labelledby="tr-verify">
            <div className="tr-card-head">
              <h2 id="tr-verify">Awaiting verification</h2>
              <span>Students who marked the job as completed</span>
            </div>
            <div className="tr-scroll">
              <table className="tr-table">
                <thead>
                  <tr>
                    <th>Student</th><th>Job</th><th>Worked on</th><th>Hours</th><th>Amount</th><th>Status</th>
                    <th className="tr-r">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {shownAwaiting.map((r) => (
                    <tr key={r.id}>
                      <td data-label="Student"><Candidate name={r.name} id={r.studentId} /></td>
                      <td data-label="Job">{r.job}</td>
                      <td data-label="Worked on">{r.worked}</td>
                      <td data-label="Hours">{r.hours}</td>
                      <td data-label="Amount" className="tr-amount">{rupees(r.amount)}</td>
                      <td data-label="Status"><span className="tr-badge verify">Verification pending</span></td>
                      <td data-label="Action" className="tr-r">
                        <button className="tr-btn pay" onClick={() => openModal("verify", r)}>Verify</button>
                      </td>
                    </tr>
                  ))}
                  {!loading && shownAwaiting.length === 0 && (
                    <tr><td className="tr-empty" colSpan={7}>
                      <strong>{awaiting.length === 0 ? "Nothing to verify" : "No students found"}</strong>
                      <p>{awaiting.length === 0 ? "When a student marks a job as completed, it shows up here." : "Try a different name."}</p>
                    </td></tr>
                  )}
                  {loading && <tr><td className="tr-empty" colSpan={7}>Loading transactions...</td></tr>}
                </tbody>
              </table>
            </div>
            <footer className="tr-foot">
              <span>{shownAwaiting.length} of {awaiting.length} awaiting verification</span>
            </footer>
          </section>

          <section className="tr-card" aria-labelledby="tr-due">
            <div className="tr-card-head">
              <h2 id="tr-due">Awaiting payment</h2>
              <span>Jobs you have verified and not yet paid</span>
            </div>
            <div className="tr-scroll">
              <table className="tr-table">
                <thead>
                  <tr>
                    <th>Student</th><th>Job</th><th>Worked on</th><th>Your rating</th><th>Student receives</th><th>Status</th>
                    <th className="tr-r">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {shownDue.map((r) => (
                    <tr key={r.paymentId}>
                      <td data-label="Student"><Candidate name={r.name} id={r.studentId} /></td>
                      <td data-label="Job">{r.job}</td>
                      <td data-label="Worked on">{r.worked}</td>
                      <td data-label="Your rating"><span className="tr-rating" aria-label={`${r.rating} out of 5`}>{stars(r.rating)}</span></td>
                      <td data-label="Student receives" className="tr-amount">
                        {rupees(r.studentAmount)}
                        <small>{rupees(r.amount)} employer payment</small>
                      </td>
                      <td data-label="Status"><span className="tr-badge due">Payment due</span></td>
                      <td data-label="Action" className="tr-r">
                        <button className="tr-btn pay" onClick={() => openModal("pay", r)}>Mark as paid</button>
                      </td>
                    </tr>
                  ))}
                  {!loading && shownDue.length === 0 && (
                    <tr><td className="tr-empty" colSpan={7}>
                      <strong>{due.length === 0 ? "No payments due" : "No students found"}</strong>
                      <p>{due.length === 0 ? "Every verified job has been paid." : "Try a different name."}</p>
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <footer className="tr-foot">
              <span>{shownDue.length} of {due.length} awaiting payment</span>
            </footer>
          </section>

          {disputes.length > 0 && (
            <section className="tr-card" aria-labelledby="tr-disputes">
              <div className="tr-card-head">
                <h2 id="tr-disputes">Under review</h2>
                <span>Payment is on hold while Nivra reviews the report.</span>
              </div>
              <div className="tr-scroll">
                <table className="tr-table">
                  <thead>
                    <tr><th>Student</th><th>Job</th><th>Reported</th><th>Raised on</th><th>Amount</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {shownDisputes.map((r) => (
                      <tr key={r.id}>
                        <td data-label="Student"><Candidate name={r.name} id={r.studentId} /></td>
                        <td data-label="Job">{r.job}</td>
                        <td data-label="Reported">{r.reason}</td>
                        <td data-label="Raised on">{r.raised}</td>
                        <td data-label="Amount" className="tr-amount">{rupees(r.amount)}</td>
                        <td data-label="Status"><span className="tr-badge review">Under review</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          <section className="tr-card" aria-labelledby="tr-history">
            <div className="tr-card-head">
              <h2 id="tr-history">Transaction history</h2>
              <span>Students you have already paid</span>
            </div>
            <div className="tr-scroll">
              <table className="tr-table">
                <thead>
                  <tr>
                    <th>Student</th><th>Job</th><th>Paid on</th><th>Your rating</th><th>Reference</th><th>Status</th>
                    <th className="tr-r">Total paid</th>
                  </tr>
                </thead>
                <tbody>
                  {shownHistory.map((r) => (
                    <tr key={r.paymentId}>
                      <td data-label="Student"><Candidate name={r.name} id={r.studentId} /></td>
                      <td data-label="Job">{r.job}</td>
                      <td data-label="Paid on">{r.paidOn}</td>
                      <td data-label="Your rating"><span className="tr-rating" aria-label={`${r.rating} out of 5`}>{stars(r.rating)}</span></td>
                      <td data-label="Reference" className="tr-ref">{r.ref}</td>
                      <td data-label="Status"><span className="tr-badge paid">Paid</span></td>
                      <td data-label="Total paid" className="tr-amount tr-r">
                        {rupees(r.amount)}
                        <small>{rupees(r.studentAmount)} to student + {rupees(r.fee)} fee</small>
                      </td>
                    </tr>
                  ))}
                  {!loading && shownHistory.length === 0 && (
                    <tr><td className="tr-empty" colSpan={7}>
                      <strong>No transactions found</strong>
                      <p>Paid transactions will appear here.</p>
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <footer className="tr-foot">
              <span>{shownHistory.length} of {history.length} payments</span>
              <span>Total paid: {rupees(paidTotal)}</span>
            </footer>
          </section>
        </div>
      </main>

      {modal && (
        <div className="tr-ov" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="tr-modal" role="dialog" aria-modal="true" aria-labelledby="tr-modal-title">

            {modal.mode === "pay" && (
              <>
                <h2 id="tr-modal-title">Confirm payment</h2>
                <dl>
                  <dt>Student</dt><dd>{row.name}</dd>
                  <dt>Job</dt><dd>{row.job}</dd>
                  <dt>Worked on</dt><dd>{row.worked}</dd>
                  <dt>Your rating</dt><dd className="tr-rating">{stars(row.rating)}</dd>
                </dl>
                <PaymentSummary
                  amount={row.amount}
                  fee={row.fee}
                  studentAmount={row.studentAmount}
                />
               <p style={{ marginTop: 12 }}>
  Pay securely through Razorpay. Your Nivra transaction will only be
  marked as Paid after the payment is verified by our server.
  This demo uses Razorpay Test Mode.
</p>
                {error && <p className="tr-err" role="alert">{error}</p>}
                <div className="tr-modal-actions">
                  <button className="tr-btn" disabled={saving} onClick={closeModal}>Cancel</button>
                 <button className="tr-btn pay" disabled={saving} onClick={confirmPayDue}>
  {saving ? "Opening checkout..." : `Pay ${rupees(row.amount)} with Razorpay`}
</button>
                </div>
              </>
            )}

            {modal.mode === "verify" && (
              <>
                <h2 id="tr-modal-title">Verify job completion</h2>
                <dl>
                  <dt>Student</dt><dd>{row.name}</dd>
                  <dt>Job</dt><dd>{row.job}</dd>
                  <dt>Date</dt><dd>{row.worked}</dd>
                  <dt>Working hours</dt><dd>{row.hours}</dd>
                  <dt>Agreed payment</dt><dd>{rupees(row.amount)}</dd>
                  <dt>Student status</dt><dd>Marked as completed</dd>
                </dl>

                <h3>Did the student successfully complete the job?</h3>
                <label className={`tr-opt ${answer === "yes" ? "on" : ""}`}>
                  <input type="radio" name="done" checked={answer === "yes"} onChange={() => { setAnswer("yes"); setError(""); }} />
                  ✓ Yes, job completed.
                </label>
                <label className={`tr-opt ${answer === "no" ? "on" : ""}`}>
                  <input type="radio" name="done" checked={answer === "no"} onChange={() => { setAnswer("no"); setError(""); }} />
                  ✕ No, report a problem.
                </label>

                {answer === "yes" && (
                  <>
                    <h3>How was your experience working with {row.name.split(" ")[0]}?</h3>
                    <StarPicker value={rating} onChange={(n) => { setRating(n); setError(""); }} />
                    <p style={{ marginTop: 6 }}>
                      Your rating does not change what the student receives.
                    </p>
                    <div className="tr-chips" role="group" aria-label="Review tags">
                      {TAGS.map((t) => (
                        <button key={t} type="button" className="tr-chip" aria-pressed={tags.includes(t)} onClick={() => toggleTag(t)}>{t}</button>
                      ))}
                    </div>
                    <textarea
                      aria-label="Review"
                      placeholder="Share your experience working with this student..."
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                    />

                    <h3>Payment breakdown</h3>
                    <PaymentSummary
                      amount={row.amount}
                      fee={Math.round(row.amount * FEE_RATE) / 100}
                      studentAmount={row.amount - Math.round(row.amount * FEE_RATE) / 100}
                    />
                    <p style={{ marginTop: 12 }}>
                      Verification creates a Pending payment record. You can record payment now after transferring the amount, or do it later.
                    </p>

                    {error && <p className="tr-err" role="alert">{error}</p>}
                    <div className="tr-modal-actions">
                      <button className="tr-btn" disabled={saving} onClick={closeModal}>Cancel</button>
                      <button className="tr-btn" disabled={saving} onClick={verifyPayLater}>
                        {saving ? "Saving..." : "Verify, pay later"}
                      </button>
                      <button className="tr-btn pay" disabled={saving} onClick={confirmVerifyAndPay}>
                        {saving ? "Saving..." : "Verify & continue"}
                      </button>
                    </div>
                  </>
                )}

                {answer === "no" && (
                  <>
                    <h3>What happened?</h3>
                    {REASONS.map((r) => (
                      <label key={r} className={`tr-opt ${reason === r ? "on" : ""}`}>
                        <input type="radio" name="reason" checked={reason === r} onChange={() => { setReason(r); setError(""); }} />
                        {r}
                      </label>
                    ))}
                    <label htmlFor="tr-comments" style={{ display: "block", fontSize: 14, fontWeight: 600, margin: "12px 0 6px" }}>Additional comments</label>
                    <textarea id="tr-comments" value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Add anything that helps Nivra review this." />
                    <label htmlFor="tr-evidence" style={{ display: "block", fontSize: 14, fontWeight: 600, margin: "12px 0 6px" }}>Supporting evidence (optional)</label>
                    <input id="tr-evidence" type="file" onChange={(e) => setEvidence(e.target.files?.[0]?.name || "")} />
                    <p style={{ marginTop: 12 }}>
                      Dispute submission is not connected yet. This form will not submit or store a report.
                    </p>
                    {error && <p className="tr-err" role="alert">{error}</p>}
                    <div className="tr-modal-actions">
                      <button className="tr-btn" onClick={closeModal}>Cancel</button>
                      <button className="tr-btn danger" onClick={submitDispute}>Submit Dispute</button>
                    </div>
                  </>
                )}

                {!answer && (
                  <div className="tr-modal-actions">
                    <button className="tr-btn" onClick={closeModal}>Cancel</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
