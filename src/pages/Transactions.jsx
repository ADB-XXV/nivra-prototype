"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import EmployerNavbar from "../components/EmployerNavbar";

// Sample data only. When ready, move these into ../data/transactions.js
// (same pattern as INITIAL_APPLICANTS). All names and amounts are fictional.

// Student pressed "Completed" in their dashboard; employer has not verified yet.
const INITIAL_AWAITING = [
  { id: 1, name: "Anjali Nair", job: "Event Assistant", worked: "Sat, 17 Oct", hours: "9:00 AM – 5:00 PM", amount: 800 },
  { id: 3, name: "Fathima Shereen", job: "Event Assistant", worked: "Sat, 17 Oct", hours: "9:00 AM – 3:00 PM", amount: 600 },
];

// Employer verified the job and rated the student, but has not paid yet.
const INITIAL_DUE = [
  { id: 2, name: "Rohit Das", job: "Stage Crew", worked: "Sun, 18 Oct", hours: "10:00 AM – 6:00 PM", amount: 700, rating: 5, review: "", tags: ["Punctual"] },
];

const INITIAL_HISTORY = [
  { id: 101, name: "Arjun Menon", job: "Event Assistant", paidOn: "12 Oct", ref: "NV-TXN-0098", amount: 800, fee: 80, rating: 4 },
  { id: 102, name: "Neha Pillai", job: "Stage Crew", paidOn: "6 Oct", ref: "NV-TXN-0091", amount: 700, fee: 70, rating: 5 },
  { id: 103, name: "Anjali Nair", job: "Campus Event Crew", paidOn: "29 Sep", ref: "NV-TXN-0084", amount: 600, fee: 60, rating: 5 },
];

const TODAY = "30 Oct"; // prototype "today"
const FEE_RATE = 0.1; // illustrative 10% service fee, not a validated commercial figure
const TAGS = ["Punctual", "Professional", "Hardworking", "Good communication", "Skilled"];
const REASONS = ["The student did not attend", "The student left before finishing the job", "Something else went wrong"];

const rupees = (n) => `₹${n.toLocaleString("en-IN")}`;
const feeOf = (amount) => Math.round(amount * FEE_RATE);
const initials = (name) => name.split(" ").map((p) => p[0]).slice(0, 2).join("");
const stars = (n) => "★".repeat(n) + "☆".repeat(5 - n);

function Candidate({ name, id }) {
  return (
    <div className="tr-candidate">
      <div className="tr-avatar">{initials(name)}</div>
      <strong>
        <Link className="tr-name" href={`/candidate-profile?id=${id}`}>{name}</Link>
      </strong>
    </div>
  );
}

function StarPicker({ value, onChange }) {
  return (
    <div className="tr-stars" role="radiogroup" aria-label="Rating out of 5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" role="radio" aria-checked={value === n} aria-label={`${n} ${n === 1 ? "star" : "stars"}`}
          className={n <= value ? "on" : ""} onClick={() => onChange(n)}>
          ★
        </button>
      ))}
    </div>
  );
}

function PaymentSummary({ amount }) {
  const fee = feeOf(amount);
  return (
    <table className="tr-sum">
      <tbody>
        <tr><td>Student payment</td><td>{rupees(amount)}</td></tr>
        <tr><td>Nivra commission (10%, sample)</td><td>{rupees(fee)}</td></tr>
        <tr className="total"><td>Total employer payment</td><td>{rupees(amount + fee)}</td></tr>
      </tbody>
    </table>
  );
}

export default function Transactions() {
  const [awaiting, setAwaiting] = useState(() => [...INITIAL_AWAITING]);
  const [due, setDue] = useState(() => [...INITIAL_DUE]);
  const [history, setHistory] = useState(() => [...INITIAL_HISTORY]);
  const [disputes, setDisputes] = useState([]);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");

  // Modal: { mode: "verify" | "pay", row }
  const [modal, setModal] = useState(null);
  const [answer, setAnswer] = useState(""); // "yes" | "no"
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [tags, setTags] = useState([]);
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");
  const [evidence, setEvidence] = useState("");
  const [error, setError] = useState("");

  function openModal(mode, row) {
    setModal({ mode, row });
    setAnswer(""); setRating(0); setReview(""); setTags([]);
    setReason(""); setComments(""); setEvidence(""); setError("");
  }
  const closeModal = () => setModal(null);

  useEffect(() => {
    if (!modal) return;
    const onKey = (e) => e.key === "Escape" && setModal(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modal]);

  const match = (r) => r.name.toLowerCase().includes(search.toLowerCase());
  const shownAwaiting = useMemo(() => awaiting.filter(match), [awaiting, search]);
  const shownDue = useMemo(() => due.filter(match), [due, search]);
  const shownDisputes = useMemo(() => disputes.filter(match), [disputes, search]);
  const shownHistory = useMemo(() => history.filter(match), [history, search]);

  const dueTotal = due.reduce((s, r) => s + r.amount + feeOf(r.amount), 0);
  const paidTotal = history.reduce((s, r) => s + r.amount + r.fee, 0);

  // ---- Prototype only: no real payment or backend. Replace with API calls later. ----

  // Record the payment and move the row into history.
  function completePayment(row, rate, text, chosenTags) {
    const fee = feeOf(row.amount);
    setHistory((cur) => [
      { id: Date.now(), name: row.name, job: row.job, paidOn: TODAY, ref: `NV-TXN-${String(100 + cur.length).padStart(4, "0")}`,
        amount: row.amount, fee, rating: rate, review: text, tags: chosenTags },
      ...cur,
    ]);
    setNotice(`Payment completed. ${row.name} has been notified of the ${rupees(row.amount)} payment and your review is added to their profile (prototype, no real payment made).`);
  }

  function confirmVerifyAndPay() {
    if (!rating) return setError("Select a star rating to continue.");
    const row = modal.row;
    setAwaiting((cur) => cur.filter((r) => r.id !== row.id));
    completePayment(row, rating, review, tags);
    closeModal();
  }

  function verifyPayLater() {
    if (!rating) return setError("Select a star rating to continue.");
    const row = modal.row;
    setAwaiting((cur) => cur.filter((r) => r.id !== row.id));
    setDue((cur) => [{ ...row, rating, review, tags }, ...cur]);
    setNotice(`${row.name}'s job is verified. Payment is now due.`);
    closeModal();
  }

  function confirmPayDue() {
    const row = modal.row;
    setDue((cur) => cur.filter((r) => r.id !== row.id));
    completePayment(row, row.rating, row.review, row.tags);
    closeModal();
  }

  function submitDispute() {
    if (!reason) return setError("Tell us what happened to submit the dispute.");
    const row = modal.row;
    setAwaiting((cur) => cur.filter((r) => r.id !== row.id));
    setDisputes((cur) => [{ ...row, reason, comments, evidence, raised: TODAY }, ...cur]);
    setNotice(`Dispute submitted for ${row.name}. Payment is on hold while Nivra reviews it.`);
    closeModal();
  }

  const toggleTag = (t) => setTags((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
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
        .tr-err{color:#a33c3c;font-size:13px;margin:12px 0 0}
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
              <p className="tr-subtitle">Malabar Events · Verify completed gigs, then pay your students</p>
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

          <section className="tr-toolbar">
            <label className="tr-search">
              <span aria-hidden="true">⌕</span>
              <input type="search" placeholder="Search by student name..." aria-label="Search transactions by student name"
                value={search} onChange={(e) => setSearch(e.target.value)} />
            </label>
          </section>

          {/* 1. Student marked the job completed; employer verifies */}
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
                      <td data-label="Student"><Candidate name={r.name} id={r.id} /></td>
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
                  {shownAwaiting.length === 0 && (
                    <tr>
                      <td className="tr-empty" colSpan={7}>
                        <strong>{awaiting.length === 0 ? "Nothing to verify" : "No students found"}</strong>
                        <p>{awaiting.length === 0 ? "When a student marks a job as completed, it shows up here." : "Try a different name."}</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <footer className="tr-foot"><span>{shownAwaiting.length} of {awaiting.length} awaiting verification</span></footer>
          </section>

          {/* 2. Verified; payment still to be made */}
          <section className="tr-card" aria-labelledby="tr-due">
            <div className="tr-card-head">
              <h2 id="tr-due">Awaiting payment</h2>
              <span>Jobs you have verified and not yet paid</span>
            </div>
            <div className="tr-scroll">
              <table className="tr-table">
                <thead>
                  <tr>
                    <th>Student</th><th>Job</th><th>Worked on</th><th>Your rating</th><th>Amount</th><th>Status</th>
                    <th className="tr-r">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {shownDue.map((r) => (
                    <tr key={r.id}>
                      <td data-label="Student"><Candidate name={r.name} id={r.id} /></td>
                      <td data-label="Job">{r.job}</td>
                      <td data-label="Worked on">{r.worked}</td>
                      <td data-label="Your rating"><span className="tr-rating" aria-label={`${r.rating} out of 5`}>{stars(r.rating)}</span></td>
                      <td data-label="Amount" className="tr-amount">{rupees(r.amount)}<small>{rupees(r.amount + feeOf(r.amount))} with fee</small></td>
                      <td data-label="Status"><span className="tr-badge due">Payment due</span></td>
                      <td data-label="Action" className="tr-r">
                        <button className="tr-btn pay" onClick={() => openModal("pay", r)}>Pay {rupees(r.amount)}</button>
                      </td>
                    </tr>
                  ))}
                  {shownDue.length === 0 && (
                    <tr>
                      <td className="tr-empty" colSpan={7}>
                        <strong>{due.length === 0 ? "No payments due" : "No students found"}</strong>
                        <p>{due.length === 0 ? "Every verified job has been paid." : "Try a different name."}</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <footer className="tr-foot"><span>{shownDue.length} of {due.length} awaiting payment</span></footer>
          </section>

          {/* Disputes appear only when there is one */}
          {disputes.length > 0 && (
            <section className="tr-card" aria-labelledby="tr-disputes">
              <div className="tr-card-head">
                <h2 id="tr-disputes">Under review</h2>
                <span>Payment is on hold. The student can respond and Nivra will review.</span>
              </div>
              <div className="tr-scroll">
                <table className="tr-table">
                  <thead>
                    <tr><th>Student</th><th>Job</th><th>Reported</th><th>Raised on</th><th>Amount</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {shownDisputes.map((r) => (
                      <tr key={r.id}>
                        <td data-label="Student"><Candidate name={r.name} id={r.id} /></td>
                        <td data-label="Job">{r.job}</td>
                        <td data-label="Reported">{r.reason}</td>
                        <td data-label="Raised on">{r.raised}</td>
                        <td data-label="Amount" className="tr-amount">{rupees(r.amount)}</td>
                        <td data-label="Status"><span className="tr-badge review">Under review</span></td>
                      </tr>
                    ))}
                    {shownDisputes.length === 0 && (
                      <tr><td className="tr-empty" colSpan={6}><strong>No students found</strong><p>Try a different name.</p></td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* 3. Paid */}
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
                    <tr key={r.id}>
                      <td data-label="Student"><Candidate name={r.name} id={r.id} /></td>
                      <td data-label="Job">{r.job}</td>
                      <td data-label="Paid on">{r.paidOn}</td>
                      <td data-label="Your rating"><span className="tr-rating" aria-label={`${r.rating} out of 5`}>{stars(r.rating)}</span></td>
                      <td data-label="Reference" className="tr-ref">{r.ref} (sample)</td>
                      <td data-label="Status"><span className="tr-badge paid">Paid</span></td>
                      <td data-label="Total paid" className="tr-amount tr-r">
                        {rupees(r.amount + r.fee)}
                        <small>{rupees(r.amount)} to student + {rupees(r.fee)} fee</small>
                      </td>
                    </tr>
                  ))}
                  {shownHistory.length === 0 && (
                    <tr>
                      <td className="tr-empty" colSpan={7}>
                        <strong>No transactions found</strong>
                        <p>Try a different name.</p>
                      </td>
                    </tr>
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

            {/* Pay a job that was verified earlier */}
            {modal.mode === "pay" && (
              <>
                <h2 id="tr-modal-title">Confirm payment</h2>
                <dl>
                  <dt>Student</dt><dd>{row.name}</dd>
                  <dt>Job</dt><dd>{row.job}</dd>
                  <dt>Worked on</dt><dd>{row.worked}</dd>
                  <dt>Your rating</dt><dd className="tr-rating">{stars(row.rating)}</dd>
                </dl>
                <PaymentSummary amount={row.amount} />
                <p style={{ marginTop: 12 }}>Prototype only: no money moves. This records the payment in your history.</p>
                <div className="tr-modal-actions">
                  <button className="tr-btn" onClick={closeModal}>Cancel</button>
                  <button className="tr-btn pay" autoFocus onClick={confirmPayDue}>Confirm &amp; Proceed to Payment</button>
                </div>
              </>
            )}

            {/* Verify a job the student marked as completed */}
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
                    <p style={{ marginTop: 6 }}>Your rating does not change what the student is paid. If they did not turn up, report a problem instead.</p>
                    <div className="tr-chips" role="group" aria-label="Review tags">
                      {TAGS.map((t) => (
                        <button key={t} type="button" className="tr-chip" aria-pressed={tags.includes(t)} onClick={() => toggleTag(t)}>{t}</button>
                      ))}
                    </div>
                    <textarea aria-label="Review" placeholder="Share your experience working with this student..."
                      value={review} onChange={(e) => setReview(e.target.value)} />

                    <h3>Proceed to payment</h3>
                    <PaymentSummary amount={row.amount} />
                    <p style={{ marginTop: 12 }}>Prototype only: no money moves. The 10% fee is a sample figure.</p>

                    {error && <p className="tr-err" role="alert">{error}</p>}
                    <div className="tr-modal-actions">
                      <button className="tr-btn" onClick={closeModal}>Cancel</button>
                      <button className="tr-btn" onClick={verifyPayLater}>Verify, pay later</button>
                      <button className="tr-btn pay" onClick={confirmVerifyAndPay}>Confirm &amp; Proceed to Payment</button>
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
                    <p style={{ marginTop: 12 }}>The student will be able to respond. Nivra reviews the dispute before deciding whether payment is due.</p>

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