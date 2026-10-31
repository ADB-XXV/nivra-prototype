"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import EmployerNavbar from "../components/EmployerNavbar";

// Sample data only. When ready, move these into ../data/transactions.js
// (same pattern as INITIAL_APPLICANTS). All names and amounts are fictional.
const INITIAL_COMPLETED = [
  { id: 1, name: "Anjali Nair", job: "Event Assistant", worked: "Sat, 17 Oct", hours: "9:00 am – 5:00 pm", amount: 800 },
  { id: 2, name: "Rohit Das", job: "Stage Crew", worked: "Sun, 18 Oct", hours: "10:00 am – 6:00 pm", amount: 700 },
  { id: 3, name: "Fathima Shereen", job: "Event Assistant", worked: "Sat, 17 Oct", hours: "9:00 am – 3:00 pm", amount: 800 },
];

const INITIAL_HISTORY = [
  { id: 101, name: "Arjun Menon", job: "Event Assistant", paidOn: "12 Oct", ref: "NV-TXN-0098", amount: 800 },
  { id: 102, name: "Neha Pillai", job: "Stage Crew", paidOn: "6 Oct", ref: "NV-TXN-0091", amount: 700 },
  { id: 103, name: "Anjali Nair", job: "Campus Event Crew", paidOn: "29 Sep", ref: "NV-TXN-0084", amount: 600 },
];

const TODAY = "30 Oct"; // prototype "today"
const rupees = (n) => `₹${n.toLocaleString("en-IN")}`;
const initials = (name) => name.split(" ").map((p) => p[0]).slice(0, 2).join("");

export default function Transactions() {
  const [completed, setCompleted] = useState(() => [...INITIAL_COMPLETED]);
  const [history, setHistory] = useState(() => [...INITIAL_HISTORY]);
  const [search, setSearch] = useState("");
  const [paying, setPaying] = useState(null); // the student being paid
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!paying) return;
    const onKey = (e) => e.key === "Escape" && setPaying(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paying]);

  const match = (r) => r.name.toLowerCase().includes(search.toLowerCase());
  const shownCompleted = useMemo(() => completed.filter(match), [completed, search]);
  const shownHistory = useMemo(() => history.filter(match), [history, search]);

  const pendingTotal = completed.reduce((s, r) => s + r.amount, 0);
  const paidTotal = history.reduce((s, r) => s + r.amount, 0);

  // Prototype only: no real payment happens. Replace with an API call later.
  function confirmPay() {
    const p = paying;
    setCompleted((cur) => cur.filter((r) => r.id !== p.id));
    setHistory((cur) => [
      { id: Date.now(), name: p.name, job: p.job, paidOn: TODAY, ref: `NV-TXN-${String(100 + cur.length).padStart(4, "0")}`, amount: p.amount },
      ...cur,
    ]);
    setNotice(`Marked ${p.name} as paid ${rupees(p.amount)} (prototype, no real payment made).`);
    setPaying(null);
  }

  const Candidate = ({ name, id }) => (
    <div className="tr-candidate">
      <div className="tr-avatar">{initials(name)}</div>
      <strong>
        <Link className="tr-name" href={`/candidate-profile?id=${id}`}>{name}</Link>
      </strong>
    </div>
  );

  return (
    <div className="nv">
      <EmployerNavbar active="/employer/transactions" />
      <style>{`
        .tr-page{--tr-ink:#302626;--tr-muted:#817471;--tr-border:#e8dcd5;--tr-accent:#67464a;--tr-bg:#faf5f1;
          width:100%;min-height:calc(100vh - 56px);padding:42px clamp(20px,4vw,64px) 60px;background:var(--tr-bg);color:var(--tr-ink);
          font-family:"Manrope","DM Sans",system-ui,sans-serif}
        .tr-page *,.tr-page *::before,.tr-page *::after{box-sizing:border-box}
        .tr-container{width:100%;max-width:1800px;margin:0 auto}
        .tr-heading{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;margin-bottom:26px;flex-wrap:wrap}
        .tr-heading h1{margin:0;font-size:clamp(32px,2.8vw,48px);line-height:1.2;letter-spacing:-.7px}
        .tr-subtitle{margin:12px 0 0;color:var(--tr-muted);font-size:16px;line-height:1.6}
        .tr-stats{display:flex;gap:14px;flex-wrap:wrap}
        .tr-stat{padding:13px 18px;border:1px solid var(--tr-border);border-radius:12px;background:#fff;min-width:190px}
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
        .tr-r{text-align:right!important}
        .tr-candidate{display:flex;align-items:center;gap:12px;min-width:170px}
        .tr-avatar{display:grid;flex:0 0 42px;width:42px;height:42px;place-items:center;border-radius:12px;background:#f0e2dc;color:var(--tr-accent);font-size:13px;font-weight:800}
        .tr-candidate strong{color:#332827;font-size:15px}
        .tr-name{color:inherit;text-decoration:none}
        .tr-name:hover{color:var(--tr-accent);text-decoration:underline;text-underline-offset:3px}
        .tr-name:focus-visible{outline:2px solid var(--tr-accent);outline-offset:3px;border-radius:2px}
        .tr-badge{display:inline-flex;padding:7px 11px;border-radius:7px;font-size:12px;font-weight:750;white-space:nowrap}
        .tr-badge.due{background:#f2e2de;color:#684449}
        .tr-badge.paid{background:#dceee3;color:#276442}
        .tr-ref{color:var(--tr-muted);font-size:13px}
        .tr-btn{min-height:38px;padding:8px 16px;border:1px solid var(--tr-border);border-radius:8px;background:#fff;font:inherit;font-size:13px;font-weight:650;cursor:pointer}
        .tr-btn:hover{background:#f5ece8}
        .tr-btn.pay{border-color:var(--tr-accent);background:var(--tr-accent);color:#fff}
        .tr-btn.pay:hover{background:#513539}
        .tr-btn:focus-visible{outline:2px solid var(--tr-accent);outline-offset:2px}
        .tr-empty{padding:48px 20px!important;text-align:center}
        .tr-empty strong{display:block;font-size:17px}
        .tr-empty p{margin:8px 0 0;color:var(--tr-muted)}
        .tr-foot{display:flex;justify-content:space-between;gap:16px;padding:16px 26px;border-top:1px solid var(--tr-border);background:#fcf9f7;color:var(--tr-muted);font-size:13px;flex-wrap:wrap}
        .tr-ov{position:fixed;inset:0;background:rgba(30,20,22,.5);display:grid;place-items:center;z-index:30;padding:16px}
        .tr-modal{background:#fff;border-radius:12px;padding:26px;max-width:460px;width:100%}
        .tr-modal h2{margin:0 0 10px;font-size:20px}
        .tr-modal dl{margin:14px 0;display:grid;grid-template-columns:auto 1fr;gap:6px 16px;font-size:14px}
        .tr-modal dt{color:var(--tr-muted)}.tr-modal dd{margin:0;font-weight:650}
        .tr-modal p{margin:0 0 16px;color:var(--tr-muted);font-size:13px}
        .tr-modal-actions{display:flex;gap:10px;justify-content:flex-end}
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
        }
      `}</style>

      <main className="tr-page">
        <div className="tr-container">
          <header className="tr-heading">
            <div>
              <h1>Transactions</h1>
              <p className="tr-subtitle">Malabar Events · Pay students for completed gigs</p>
            </div>
            <div className="tr-stats">
              <div className="tr-stat">
                <strong>{rupees(pendingTotal)}</strong>
                <span>due to {completed.length} {completed.length === 1 ? "student" : "students"}</span>
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

          {/* Completed gigs awaiting payment */}
          <section className="tr-card" aria-labelledby="tr-completed">
            <div className="tr-card-head">
              <h2 id="tr-completed">Completed</h2>
              <span>Students who finished the gig and are waiting for payment</span>
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
                  {shownCompleted.map((r) => (
                    <tr key={r.id}>
                      <td data-label="Student"><Candidate name={r.name} id={r.id} /></td>
                      <td data-label="Job">{r.job}</td>
                      <td data-label="Worked on">{r.worked}</td>
                      <td data-label="Hours">{r.hours}</td>
                      <td data-label="Amount" className="tr-amount">{rupees(r.amount)}</td>
                      <td data-label="Status"><span className="tr-badge due">Payment due</span></td>
                      <td data-label="Action" className="tr-r">
                        <button className="tr-btn pay" onClick={() => setPaying(r)}>Pay {rupees(r.amount)}</button>
                      </td>
                    </tr>
                  ))}
                  {shownCompleted.length === 0 && (
                    <tr>
                      <td className="tr-empty" colSpan={7}>
                        <strong>{completed.length === 0 ? "No payments due" : "No students found"}</strong>
                        <p>{completed.length === 0 ? "Every completed gig has been paid." : "Try a different name."}</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <footer className="tr-foot">
              <span>{shownCompleted.length} of {completed.length} awaiting payment</span>
            </footer>
          </section>

          {/* Past payments */}
          <section className="tr-card" aria-labelledby="tr-history">
            <div className="tr-card-head">
              <h2 id="tr-history">Transaction history</h2>
              <span>Students you have already paid</span>
            </div>
            <div className="tr-scroll">
              <table className="tr-table">
                <thead>
                  <tr>
                    <th>Student</th><th>Job</th><th>Paid on</th><th>Reference</th><th>Status</th>
                    <th className="tr-r">Amount paid</th>
                  </tr>
                </thead>
                <tbody>
                  {shownHistory.map((r) => (
                    <tr key={r.id}>
                      <td data-label="Student"><Candidate name={r.name} id={r.id} /></td>
                      <td data-label="Job">{r.job}</td>
                      <td data-label="Paid on">{r.paidOn}</td>
                      <td data-label="Reference" className="tr-ref">{r.ref} (sample)</td>
                      <td data-label="Status"><span className="tr-badge paid">Paid</span></td>
                      <td data-label="Amount paid" className="tr-amount tr-r">{rupees(r.amount)}</td>
                    </tr>
                  ))}
                  {shownHistory.length === 0 && (
                    <tr>
                      <td className="tr-empty" colSpan={6}>
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

      {paying && (
        <div className="tr-ov" onClick={(e) => e.target === e.currentTarget && setPaying(null)}>
          <div className="tr-modal" role="dialog" aria-modal="true" aria-labelledby="tr-confirm">
            <h2 id="tr-confirm">Confirm payment</h2>
            <dl>
              <dt>Student</dt><dd>{paying.name}</dd>
              <dt>Job</dt><dd>{paying.job}</dd>
              <dt>Worked on</dt><dd>{paying.worked}</dd>
              <dt>Amount</dt><dd>{rupees(paying.amount)}</dd>
            </dl>
            <p>Prototype only: no money moves. This just records the payment in your history.</p>
            <div className="tr-modal-actions">
              <button className="tr-btn" onClick={() => setPaying(null)}>Cancel</button>
              <button className="tr-btn pay" autoFocus onClick={confirmPay}>Confirm payment</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}