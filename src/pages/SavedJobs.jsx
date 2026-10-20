import { useState } from "react";

const INITIAL_JOBS = [
  { id: 1, title: "Event Assistant", company: "Malabar Events", city: "Kozhikode", schedule: "Sat, 24 Oct · 9:00 am – 5:00 pm · One day", pay: 800 },
  { id: 2, title: "Retail Promoter", company: "Urban Cart Stores", city: "Thrissur", schedule: "Fri, 23 – Sun, 25 Oct · 10:00 am – 6:00 pm · Short term", pay: 900 },
  { id: 3, title: "Delivery Partner", company: "QuickBasket", city: "Bengaluru", schedule: "Sat, 31 Oct · 10:00 am – 6:00 pm · One day", pay: 850 },
];

const NAV = ["Browse jobs", "Saved", "My applications", "Dashboard", "Profile"];

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
  --green: #4f6143;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  color: var(--ink);
  font-family: "DejaVu Sans", "Segoe UI", system-ui, -apple-system, Roboto, sans-serif;
  font-size: 15px;
  border-top: 3px solid var(--brand);
  box-sizing: border-box;
}
.nv-root *, .nv-root *::before, .nv-root *::after { box-sizing: inherit; }
.nv-root button { font-family: inherit; cursor: pointer; }

.nv-header { background: var(--surface); border-bottom: 1px solid var(--line); }
.nv-header-inner {
  max-width: 1160px; margin: 0 auto; padding: 12px 24px;
  display: flex; align-items: center; gap: 8px;
}
.nv-logo { font-size: 20px; font-weight: 700; margin-right: 18px; color: var(--brand); }
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

.nv-main { flex: 1; width: 100%; max-width: 1160px; margin: 0 auto; padding: 28px 24px 40px; }
.nv-title { font-size: 24px; font-weight: 700; margin: 0 0 14px; }

.nv-card {
  background: var(--surface); border: 1px solid var(--line);
  border-radius: 10px; padding: 0 22px;
}
.nv-row {
  display: flex; align-items: center; justify-content: space-between;
  gap: 16px; padding: 16px 0; border-bottom: 1px solid var(--line);
}
.nv-row:last-child { border-bottom: none; }
.nv-info { min-width: 0; }
.nv-job-title { font-weight: 700; font-size: 16px; margin: 0 0 3px; }
.nv-job-sub { color: var(--muted); font-size: 16px; margin: 0 0 3px; }
.nv-job-meta { color: var(--muted); font-size: 13.5px; margin: 0; }

.nv-side { display: flex; align-items: center; gap: 14px; flex-shrink: 0; }
.nv-pay { font-weight: 700; font-size: 16px; margin-right: 10px; }
.nv-pay small { font-weight: 400; color: var(--muted); font-size: 13.5px; }

.nv-remove {
  background: none; border: none; color: var(--green); font-size: 14.5px;
  padding: 8px 10px; margin-right: 4px;
}
.nv-remove:hover { text-decoration: underline; }

.nv-btn {
  background: var(--surface); border: 1px solid var(--line); color: var(--ink);
  padding: 8px 12px; border-radius: 6px; font-size: 14.5px;
}
.nv-btn:hover { background: #faf6f3; }
.nv-btn.primary { background: var(--brand); border-color: var(--brand); color: #fff; padding: 8px 14px; }
.nv-btn.primary:hover { background: #4a2d34; }
.nv-btn.primary[disabled] { opacity: 0.6; cursor: default; }
.nv-btn:focus-visible, .nv-remove:focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }

.nv-empty { padding: 36px 0; text-align: center; color: var(--muted); }

.nv-footer { border-top: 1px solid var(--line); margin-top: auto; }
.nv-footer p {
  max-width: 1160px; margin: 0 auto; padding: 28px 24px 60px;
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

export default function SavedJobs({ onNavigate }) {
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [applied, setApplied] = useState([]);

  const remove = (id) => setJobs((list) => list.filter((j) => j.id !== id));
  const apply = (id) => setApplied((list) => (list.includes(id) ? list : [...list, id]));

  return (
    <div className="nv-root">
      <style>{CSS}</style>

      <header className="nv-header">
        <div className="nv-header-inner">
          <span className="nv-logo">
            Nivra<span className="nv-logo-dot" />
          </span>
          <nav className="nv-nav" aria-label="Main">
            {NAV.map((item) => (
              <a
                key={item}
                href="#"
                className={item === "Saved" ? "active" : ""}
                aria-current={item === "Saved" ? "page" : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate?.(item);
                }}
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="nv-right">
            <span className="nv-role">Student</span>
            <a href="#" className="nv-logout" onClick={(e) => e.preventDefault()}>
              Log out
            </a>
          </div>
        </div>
      </header>

      <main className="nv-main">
        <h1 className="nv-title">Saved jobs</h1>

        <section className="nv-card">
          {jobs.length === 0 && (
            <div className="nv-empty">No saved jobs yet. Save a job from Browse jobs to see it here.</div>
          )}
          {jobs.map((j) => (
            <article className="nv-row" key={j.id}>
              <div className="nv-info">
                <h2 className="nv-job-title">{j.title}</h2>
                <p className="nv-job-sub">
                  {j.company} · {j.city}
                </p>
                <p className="nv-job-meta">{j.schedule}</p>
              </div>

              <div className="nv-side">
                <span className="nv-pay">
                  ₹{j.pay}
                  <small>/day</small>
                </span>
                <button type="button" className="nv-remove" onClick={() => remove(j.id)}>
                  Remove
                </button>
                <button type="button" className="nv-btn">
                  View job
                </button>
                <button
                  type="button"
                  className="nv-btn primary"
                  disabled={applied.includes(j.id)}
                  onClick={() => apply(j.id)}
                >
                  {applied.includes(j.id) ? "Applied" : "Apply"}
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>

      <footer className="nv-footer">
        <p>
          <strong>Nivra</strong> · Find work for a day. Build experience for tomorrow. Prototype
          with sample data; employers, jobs and students are fictional.
        </p>
      </footer>
    </div>
  );
}