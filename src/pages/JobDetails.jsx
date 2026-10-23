import React, { useEffect, useState } from "react";

/* =====================================================================
   Nivra · Page 4 of 16 · Job details and apply
   Self-contained: data, layout (top bar, header, footer), styles, logic.
   Reads the job id from the URL hash, e.g. #/job/3
   ===================================================================== */

/* ---------- Sample data ---------- */
const JOBS = [
  {
    id: 1, title: "Event Assistant", company: "Malabar Events", city: "Kozhikode", category: "Events", pay: 800,
    when: "Sat, 24 Oct", time: "9:00 am – 5:00 pm", workers: 8,
    about: "Help the team run the day smoothly. You will be briefed on arrival and work alongside an on-site supervisor.",
    resp: ["Welcome and guide people on site", "Help with setup and pack-down", "Follow the supervisor’s instructions"],
    skills: "Clear communication, punctuality, comfort standing for long hours. Malayalam and English preferred.",
    elig: "18 or older. College ID required. No experience needed."
  },
  {
    id: 2, title: "Catering Helper", company: "Spice Route Caterers", city: "Kochi", category: "Catering", pay: 700,
    when: "Sun, 25 Oct", time: "11:00 am – 4:00 pm", workers: 6,
    about: "Assist the catering crew with serving and clean-up at a family function.",
    resp: ["Set up serving counters", "Serve guests politely", "Help with clean-up"],
    skills: "Teamwork, neat appearance, willingness to be on your feet.",
    elig: "18 or older. College ID required. No experience needed."
  },
  {
    id: 3, title: "Retail Promoter", company: "Urban Cart Stores", city: "Thrissur", category: "Retail", pay: 900,
    when: "Fri, 23 – Sun, 25 Oct", time: "10:00 am – 6:00 pm", workers: 5,
    about: "Help the team run the day smoothly. You will be briefed on arrival and work alongside an on-site supervisor.",
    resp: ["Welcome and guide people on site", "Help with setup and pack-down", "Follow the supervisor’s instructions"],
    skills: "Clear communication, punctuality, comfort standing for long hours. Malayalam and English preferred.",
    elig: "18 or older. College ID required. No experience needed."
  },
  {
    id: 4, title: "Campus Event Crew", company: "Aarambh Fest Team", city: "Kozhikode", category: "Events", pay: 600,
    when: "Mon, 26 Oct", time: "8:00 am – 6:00 pm", workers: 12,
    about: "Join the student crew handling logistics for the annual campus fest.",
    resp: ["Manage registration desks", "Move and arrange equipment", "Support stage volunteers"],
    skills: "Energy, teamwork, basic communication.",
    elig: "18 or older. College ID required. No experience needed."
  },
  {
    id: 5, title: "Maths Tutor, Class 10", company: "BrightPath Tuitions", city: "Malappuram", category: "Tutoring", pay: 500,
    when: "Wed, 28 Oct", time: "5:00 pm – 7:00 pm", workers: 2,
    about: "Take a revision session for Class 10 students ahead of the model exams.",
    resp: ["Revise key chapters", "Solve practice problems with students", "Clear doubts"],
    skills: "Strong maths fundamentals, patience, clear explanations.",
    elig: "18 or older. College ID required. Strong Class 10 maths."
  },
  {
    id: 6, title: "Delivery Partner", company: "QuickBasket", city: "Bengaluru", category: "Delivery", pay: 850,
    when: "Sat, 31 Oct", time: "10:00 am – 6:00 pm", workers: 10,
    about: "Deliver grocery orders in your assigned zone during a busy weekend slot.",
    resp: ["Pick up orders from the store", "Deliver to customers on time", "Confirm delivery in the app"],
    skills: "Knowledge of local roads, punctuality, own two-wheeler preferred.",
    elig: "18 or older. College ID and valid licence required."
  },
  {
    id: 7, title: "Banquet Server", company: "Hotel Lakeview", city: "Kochi", category: "Hospitality", pay: 650,
    when: "Sat, 31 Oct", time: "6:00 pm – 11:00 pm", workers: 8,
    about: "Serve guests at an evening banquet under the guidance of the banquet captain.",
    resp: ["Set tables", "Serve food and beverages", "Assist with end-of-night clean-up"],
    skills: "Courtesy, neat appearance, ability to work in a fast-paced setting.",
    elig: "18 or older. College ID required. No experience needed."
  },
];

const rupee = (n) => "₹" + n.toLocaleString("en-IN");

/* ---------- Saved / applied jobs, shared with Browse jobs via localStorage ---------- */
const SAVED_KEY = "nivra.saved";
const APPLIED_KEY = "nivra.applied";
const load = (key, fallback) => {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return new Set(Array.isArray(v) ? v : fallback);
  } catch {
    return new Set(fallback);
  }
};
const persist = (key, set) => {
  try { localStorage.setItem(key, JSON.stringify([...set])); } catch { }
};

/* ---------- Read the job id from the hash ---------- */
const idFromHash = () => {
  const m = (window.location.hash || "").match(/^#\/job\/(\d+)/);
  return m ? Number(m[1]) : 3; // default to Retail Promoter, as in the design
};

/* ---------- Page ---------- */
export default function JobDetail({
  job: selectedJob,
  onBack,
  savedJobs,
  toggleSaved,
  appliedJobs,
  setAppliedJobs,
}) {
  const [jobId, setJobId] = useState(() =>
    typeof window === "undefined" ? 3 : idFromHash()
  );
  const [saved, setSaved] = useState(() => load(SAVED_KEY, [1, 3, 6]));
  const [applied, setApplied] = useState(() => load(APPLIED_KEY, [3]));

  useEffect(() => {
    const onChange = () => { setJobId(idFromHash()); window.scrollTo(0, 0); };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  useEffect(() => persist(SAVED_KEY, saved), [saved]);
  useEffect(() => persist(APPLIED_KEY, applied), [applied]);

  const routeJob = JOBS.find((j) => j.id === jobId);
  const job = selectedJob
    ? {
      ...selectedJob,
      city: selectedJob.location,
      when: selectedJob.dateLabel,
      about: selectedJob.description,
      resp: selectedJob.responsibilities,
      elig: selectedJob.eligibility,
    }
    : routeJob;
  const isSaved = job && savedJobs
    ? savedJobs.includes(job.id)
    : saved.has(jobId);
  const isApplied = job && appliedJobs
    ? appliedJobs.includes(job.id)
    : applied.has(jobId);

  const toggleSave = () =>
    toggleSaved
      ? toggleSaved(job.id)
      : setSaved((prev) => {
        const next = new Set(prev);
        next.has(jobId) ? next.delete(jobId) : next.add(jobId);
        return next;
      });
  const apply = () =>
    setAppliedJobs
      ? setAppliedJobs((previous) =>
        previous.includes(job.id) ? previous : [...previous, job.id]
      )
      : setApplied((previous) => new Set(previous).add(jobId));

  return (
    <div className="nivra">
      <style>{css}</style>

      {/* Prototype bar */}
      <div className="protobar">Nivra · 04 / 16 · Job details and apply</div>

      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <a className="logo" href="/">Nivra<i /></a>
          <nav className="nav">
            <a href="/browsejobs">Browse jobs</a>
            <a href="#/saved">Saved</a>
            <a href="#/applications">My applications</a>
            <a href="#/dashboard">Dashboard</a>
            <a href="#/profile">Profile</a>
          </nav>
          <span className="spacer" />
          <span className="badge-student">Student</span>
          <a className="logout" href="/">Log out</a>
        </div>
      </header>

      {/* Content */}
      <main>
        <a
          className="back"
          href="/browsejobs"
          onClick={onBack ? (event) => {
            event.preventDefault();
            onBack();
          } : undefined}
        >
          ← Back to jobs
        </a>

        {!job ? (
          <div className="panel" style={{ marginTop: 16 }}>Job not found.</div>
        ) : (
          <>
            <h2 className="detail-title">{job.title}</h2>
            <div className="detail-sub">{job.company} · {job.city} · {job.category}</div>

            <div className="detail-grid">
              <article className="panel">
                <h3>About the job</h3>
                <p>{job.about}</p>
                <h3>Responsibilities</h3>
                <ul>{job.resp.map((r) => <li key={r}>{r}</li>)}</ul>
                <h3>Skills</h3>
                <p>{job.skills}</p>
                <h3>Eligibility</h3>
                <p>{job.elig}</p>
              </article>

              <div className="side">
                <div className="panel">
                  <div className="big">{rupee(job.pay)}<small>/day</small></div>
                  <div className="line">{job.when}</div>
                  <div className="line">{job.time}</div>
                  <div className="line">{job.workers} workers needed</div>

                  {isApplied ? (
                    <span className="tag-applied">Applied</span>
                  ) : (
                    <div className="actions">
                      <button className="btn-primary" onClick={apply}>Apply now</button>
                    </div>
                  )}
                  <div>
                    <button className="btn-save" onClick={toggleSave}>
                      {isSaved ? "★ Saved" : "☆ Save"}
                    </button>
                  </div>
                </div>

                <div className="panel employer">
                  <h3>{job.company}</h3>
                  <p>Local business in {job.city}. Sample employer, not verified.</p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p><b>Nivra</b> · Find work for a day. Build experience for tomorrow. Prototype with sample data; employers, jobs and students are fictional.</p>
      </footer>
    </div>
  );
}

/* ---------- Styles ---------- */
const css = `
.nivra {
  --bg:#faf5f1; --border:#e8ded8; --ink:#2a1f21; --muted:#6f6165; --brand:#5a3a40;
  --brand-soft:#f6dcdc; --dot:#e0959b; --green-bg:#e3efdf; --green-ink:#2f5d2f; --tag-bg:#e8ddd5;
  background:var(--bg); color:var(--ink);
  font-family:"DejaVu Sans","Segoe UI",system-ui,-apple-system,Roboto,Arial,sans-serif;
  font-size:16px; line-height:1.4; min-height:100vh; display:flex; flex-direction:column;
}
.nivra *{box-sizing:border-box}
.nivra a{color:inherit;text-decoration:none}
.nivra button{font:inherit;color:inherit}

/* prototype bar */
.nivra .protobar{background:var(--brand);color:#fff;font-size:13px;font-weight:700;padding:6px 11px;height:30px}

/* header */
.nivra .header{background:#fff;border-bottom:1px solid var(--border)}
.nivra .header-inner{max-width:1086px;margin:0 auto;height:59px;display:flex;align-items:center;gap:12px}
.nivra .logo{font-size:20px;font-weight:800;color:var(--brand);margin-right:4px;letter-spacing:.2px}
.nivra .logo i{display:inline-block;width:8px;height:8px;background:var(--dot);border-radius:50%;margin-left:2px}
.nivra .nav{display:flex;gap:4px;align-items:center}
.nivra .nav a{padding:8px 10px;border-radius:8px;color:var(--muted);font-size:16px}
.nivra .spacer{flex:1}
.nivra .badge-student{background:var(--green-bg);color:var(--green-ink);font-size:13px;font-weight:700;padding:3px 9px;border-radius:6px}
.nivra .logout{color:var(--muted);padding:0 10px 0 22px}

/* page */
.nivra main{flex:1;width:100%;max-width:1086px;margin:0 auto;padding:0 0 40px}
.nivra .back{display:inline-block;color:var(--muted);margin:32px 0 6px}
.nivra .detail-title{font-size:34px;font-weight:800;margin:0;line-height:1.2}
.nivra .detail-sub{color:var(--muted);margin:8px 0 14px}
.nivra .detail-grid{display:grid;grid-template-columns:1fr 408px;gap:25px;align-items:start}

.nivra .panel{background:#fff;border:1px solid var(--border);border-radius:10px;padding:21px 21px 24px}
.nivra .panel h3{margin:0 0 6px;font-size:16px;font-weight:800}
.nivra .panel h3:not(:first-child){margin-top:18px}
.nivra .panel p{margin:0}
.nivra .panel ul{margin:0;padding-left:40px}
.nivra .panel li{margin:1px 0}

.nivra .side{display:flex;flex-direction:column;gap:16px}
.nivra .side .big{font-size:28px;font-weight:800}
.nivra .side .big small{font-size:20px;font-weight:400;color:var(--muted)}
.nivra .side .line{color:var(--muted);margin-top:2px}
.nivra .side .actions{margin-top:14px}
.nivra .tag-applied{display:inline-block;background:var(--tag-bg);font-size:13px;font-weight:700;padding:2px 9px;border-radius:5px;margin:16px 0 12px}
.nivra .employer h3{margin:0 0 6px}
.nivra .employer p{color:var(--muted)}

.nivra .btn-save{height:35px;min-width:75px;padding:0 12px;border:1px solid var(--border);background:#fff;border-radius:6px;cursor:pointer;font-size:14px;white-space:nowrap}
.nivra .btn-primary{width:100%;height:40px;padding:0 14px;background:var(--brand);color:#fff;border:0;border-radius:6px;cursor:pointer;font-size:14px;font-weight:700;margin-bottom:10px}

/* footer */
.nivra .footer{border-top:1px solid var(--border)}
.nivra .footer p{max-width:1086px;margin:0 auto;padding:24px 0 28px;font-size:14px;color:var(--muted)}
.nivra .footer b{color:var(--brand)}

@media (max-width:900px){
  .nivra main,.nivra .header-inner,.nivra .footer p{padding-left:16px;padding-right:16px}
  .nivra .detail-grid{grid-template-columns:1fr}
  .nivra .nav a{padding:8px 6px;font-size:14px}
}
`;