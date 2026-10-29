"use client";

import { useState } from "react";
import StudentNavbar from "../components/StudentNavbar";

const INITIAL_APPLICATIONS = [
  { id: 1, jobId: 1, title: "Event Assistant", company: "Malabar Events", city: "Kozhikode", schedule: "Sat, 24 Oct · 9:00 am – 5:00 pm · One day", pay: 800, applied: "16 Oct", status: "Under Review" },
  { id: 2, jobId: 2, title: "Catering Helper", company: "Spice Route Caterers", city: "Kochi", schedule: "Sun, 25 Oct · 11:00 am – 4:00 pm · One day", pay: 700, applied: "12 Oct", status: "Accepted" },
  { id: 3, jobId: 4, title: "Campus Event Crew", company: "Aarambh Fest Team", city: "Kozhikode", schedule: "Mon, 26 Oct · 8:00 am – 6:00 pm · One day", pay: 600, applied: "14 Oct", status: "Shortlisted" },
  { id: 4, jobId: 3, title: "Retail Promoter", company: "Urban Cart Stores", city: "Thrissur", schedule: "Fri, 23 – Sun, 25 Oct · 10:00 am – 6:00 pm · Short term", pay: 900, applied: "18 Oct", status: "Applied" },
  { id: 5, jobId: 5, title: "Maths Tutor, Class 10", company: "BrightPath Tuitions", city: "Malappuram", schedule: "Wed, 28 Oct · 5:00 pm – 7:00 pm · One day", pay: 500, applied: "3 Oct", status: "Completed" },
  { id: 6, jobId: 7, title: "Banquet Server", company: "Hotel Lakeview", city: "Kochi", schedule: "Sat, 31 Oct · 6:00 pm – 11:00 pm · Short term", pay: 650, applied: "9 Oct", status: "Rejected" },
];

const FILTERS = ["All", "Applied", "Under Review", "Shortlisted", "Accepted", "Rejected", "Completed"];
const WITHDRAWABLE = ["Applied", "Under Review"];
const NAV = [
  ["Browse jobs", "/browsejobs"],
  ["Saved", "/saved"],
  ["My applications", "/applications"],
  ["Dashboard", "/student/dashboard"],
  ["Profile", "/student/profile"],
];

const CSS = `
.nv-root {
  --bg: #f9f4f0;
  --surface: #ffffff;
  --ink: #231a1a;
  --muted: #7a6b6b;
  --line: #e6dcd6;
  --brand: #5b3a42;
  --rose: #c99a9a;
  --rose-soft: #f6e1de;
  --danger: #a33a3a;
  min-height: 100vh;
  background: var(--bg);
  color: var(--ink);
  font-family: "DejaVu Sans", "Segoe UI", system-ui, -apple-system, Roboto, sans-serif;
  font-size: 15px;
  box-sizing: border-box;
}
.nv-root *, .nv-root *::before, .nv-root *::after { box-sizing: inherit; }
.nv-root button { font-family: inherit; cursor: pointer; }

.nv-header { background: var(--surface); border-bottom: 1px solid var(--line); }
.nv-header-inner {
  max-width: 1160px; margin: 0 auto; padding: 10px 24px;
  display: flex; align-items: center; gap: 8px;
}
.nv-logo { font-size: 20px; font-weight: 700; margin-right: 18px; letter-spacing: 0.2px; }
.nv-logo-dot {
  display: inline-block; width: 8px; height: 8px; border-radius: 50%;
  background: var(--rose); margin-left: 2px;
}
.nv-nav { display: flex; gap: 4px; flex: 1; flex-wrap: wrap; }
.nv-nav a {
  padding: 8px 10px; border-radius: 6px; color: var(--muted);
  text-decoration: none; font-size: 16px;
}
.nv-nav a:hover { color: var(--ink); }
.nv-nav a.active { background: var(--rose-soft); color: var(--ink); }
.nv-right { display: flex; align-items: center; gap: 30px; }
.nv-role {
  background: #e7efe0; color: #3f5a35; font-weight: 700; font-size: 12.5px;
  padding: 5px 11px; border-radius: 6px;
}
.nv-logout { color: var(--muted); text-decoration: none; font-size: 15px; }

.nv-main { max-width: 1160px; margin: 0 auto; padding: 28px 24px 40px; }
.nv-title { font-size: 24px; font-weight: 700; margin: 0 0 10px; }

.nv-filters { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
.nv-chip {
  background: var(--surface); border: 1px solid var(--line); color: var(--ink);
  padding: 5px 11px; border-radius: 6px; font-size: 14px;
}
.nv-chip:hover { border-color: var(--rose); }
.nv-chip.active { background: var(--rose-soft); border-color: var(--rose); }
.nv-chip:focus-visible, .nv-btn:focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }

.nv-card {
  background: var(--surface); border: 1px solid var(--line);
  border-radius: 10px; padding: 0 20px;
}
.nv-row {
  display: flex; align-items: center; justify-content: space-between;
  gap: 16px; padding: 14px 0; border-bottom: 1px solid var(--line);
}
.nv-row:last-child { border-bottom: none; }
.nv-info { min-width: 0; }
.nv-job-title { font-weight: 700; font-size: 16px; margin: 0 0 3px; }
.nv-job-sub { color: var(--muted); font-size: 16px; margin: 0 0 3px; }
.nv-job-meta { color: var(--muted); font-size: 13.5px; margin: 0; }

.nv-side { display: flex; align-items: center; gap: 14px; flex-shrink: 0; }
.nv-pay { font-weight: 700; font-size: 16px; }
.nv-pay small { font-weight: 400; color: var(--muted); font-size: 13.5px; }
.nv-applied { color: var(--muted); font-size: 14.5px; }

.nv-badge {
  font-size: 12.5px; font-weight: 700; padding: 4px 11px; border-radius: 4px;
  border: 1px solid transparent; white-space: nowrap;
}
.nv-badge.under-review { background: var(--rose-soft); color: var(--ink); }
.nv-badge.accepted { background: #4f6143; color: #fff; }
.nv-badge.shortlisted { background: #e7efe0; color: #3f5a35; }
.nv-badge.applied { background: #e8ddd3; color: #5a4a3e; }
.nv-badge.completed { background: transparent; color: #5a4a3e; border: 1px dashed #5a4a3e; }
.nv-badge.rejected { background: transparent; color: var(--danger); border-color: var(--danger); }

.nv-btn {
  background: var(--surface); border: 1px solid var(--line); color: var(--ink);
  padding: 8px 12px; border-radius: 6px; font-size: 14.5px;
}
.nv-btn:hover { background: #faf6f3; }
.nv-btn.danger { color: var(--danger); border-color: var(--danger); }
.nv-btn.danger:hover { background: #fbeeee; }
.nv-slot { display: inline-block; min-width: 84px; }

.nv-empty { padding: 36px 0; text-align: center; color: var(--muted); }

.nv-footer p {
  max-width: 1160px; margin: 0 auto; padding: 22px 24px;
  color: var(--muted); font-size: 14px;
}
.nv-footer strong { color: var(--ink); }

@media (max-width: 820px) {
  .nv-row { flex-direction: column; align-items: flex-start; }
  .nv-side { flex-wrap: wrap; }
  .nv-right { gap: 14px; }
  .nv-header-inner { flex-wrap: wrap; }
}
`;

const slug = (s) => s.toLowerCase().replace(/\s+/g, "-");

export default function MyApplications({ onNavigate = (path) => window.location.assign(path) }) {
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  const [filter, setFilter] = useState("All");

  const countFor = (f) =>
    f === "All" ? applications.length : applications.filter((a) => a.status === f).length;

  const visible =
    filter === "All" ? applications : applications.filter((a) => a.status === filter);

  const withdraw = (id) => setApplications((list) => list.filter((a) => a.id !== id));

  return (
    <div className="nv-root">
      <style>{CSS}</style>

      <StudentNavbar active="/applications" />

      <main className="nv-main">
        <h1 className="nv-title">My applications</h1>

        <div className="nv-filters" role="group" aria-label="Filter by status">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className={`nv-chip${filter === f ? " active" : ""}`}
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f} {countFor(f)}
            </button>
          ))}
        </div>

        <section className="nv-card">
          {visible.length === 0 && (
            <div className="nv-empty">No applications with this status yet.</div>
          )}
          {visible.map((a) => (
            <article className="nv-row" key={a.id}>
              <div className="nv-info">
                <h2 className="nv-job-title">{a.title}</h2>
                <p className="nv-job-sub">
                  {a.company} · {a.city}
                </p>
                <p className="nv-job-meta">{a.schedule}</p>
              </div>

              <div className="nv-side">
                <span className="nv-pay">
                  ₹{a.pay}
                  <small>/day</small>
                </span>
                <span className="nv-applied">Applied {a.applied}</span>
                <span className={`nv-badge ${slug(a.status)}`}>{a.status}</span>
                <button type="button" className="nv-btn" onClick={() => onNavigate(`/jobdetails/${a.jobId}?returnTo=applications`)}>
                  View job
                </button>
                {WITHDRAWABLE.includes(a.status) ? (
                  <button type="button" className="nv-btn danger" onClick={() => withdraw(a.id)}>
                    Withdraw
                  </button>
                ) : null}
              </div>
            </article>
          ))}
        </section>
      </main>

      <footer className="nv-footer">
        <p>
          <strong>Nivra</strong> · Find work for a day. Build experience for tomorrow. 
        </p>
      </footer>
    </div>
  );
}
