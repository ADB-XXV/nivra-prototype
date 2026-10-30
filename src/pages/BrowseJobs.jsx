import { useMemo, useState } from "react";
import JOBS from "../data/jobs";
import StudentNavbar from "../components/StudentNavbar";

/* =====================================================================
   Nivra · Page 3 of 16 · Browse jobs
   Self-contained: data, layout (top bar, header, footer), styles, logic.
   ===================================================================== */

const rupee = (n) => "₹" + n.toLocaleString("en-IN");
const jobDays = (job) => (job.dateLabel.match(/\d+/g) || []).map(Number);

/* ---------- Page ---------- */
export default function BrowseJobs({
  jobs: availableJobs = JOBS,
  onView = (job) => window.location.assign(`/jobdetails/${job.id}`),
  savedJobs = [],
  toggleSaved = () => {},
    activeTab = "Browse jobs",
  saveError = "",
})  {
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("");
  const [sort, setSort] = useState("soonest");
  const [category, setCategory] = useState("All");
  const [date, setDate] = useState("any");
  const [minPay, setMinPay] = useState(0);
  const [type, setType] = useState("All");

  const categories = useMemo(() => ["All", ...new Set(availableJobs.map((j) => j.category))], [availableJobs]);

  const jobs = useMemo(() => {
    const kw = q.trim().toLowerCase();
    const lc = loc.trim().toLowerCase();
    return availableJobs
      .filter((j) => {
        if (kw && !`${j.title} ${j.company} ${j.category}`.toLowerCase().includes(kw)) return false;
        if (lc && !j.location.toLowerCase().includes(lc)) return false;
        if (category !== "All" && j.category !== category) return false;
        if (type !== "All" && j.type !== type) return false;
        if (j.pay < minPay) return false;
        const days = jobDays(j);
        if (date === "weekend" && !(Math.min(...days) <= 25 && Math.max(...days) >= 24)) return false;
        if (date === "week" && Math.min(...days) > 30) return false;
        return true;
      })
      .sort((a, b) =>
  sort === "pay"
    ? b.pay - a.pay
    : Math.min(...jobDays(a)) - Math.min(...jobDays(b)) ||
      String(a.id).localeCompare(String(b.id))
);
}, [availableJobs, q, loc, sort, category, date, minPay, type]);

  return (
    <div className="nivra">
      <style>{css}</style>

      <StudentNavbar active="/browsejobs" />

      {/* Content */}
      <main>
        <h1>Browse jobs</h1>

        <div className="searchbar">
          <input className="field" placeholder="Job title or keyword" value={q} onChange={(e) => setQ(e.target.value)} />
          <input className="field" placeholder="Location" value={loc} onChange={(e) => setLoc(e.target.value)} />
          <select className="field" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="soonest">Sort: Soonest</option>
            <option value="pay">Sort: Highest pay</option>
          </select>
        </div>

        <div className="layout">
          <aside className="filters">
            <h2>Filters</h2>

            <label htmlFor="f-cat">Category</label>
            <select id="f-cat" value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>

            <label htmlFor="f-date">Date</label>
            <select id="f-date" value={date} onChange={(e) => setDate(e.target.value)}>
              <option value="any">Any date</option>
              <option value="weekend">This weekend</option>
              <option value="week">Next 7 days</option>
            </select>

            <label htmlFor="f-pay">Minimum pay</label>
            <select id="f-pay" value={minPay} onChange={(e) => setMinPay(Number(e.target.value))}>
              {[0, 500, 700, 800].map((n) => (
                <option key={n} value={n}>{n ? rupee(n) + "+" : "Any"}</option>
              ))}
            </select>

            <label htmlFor="f-type">Job type</label>
            <select id="f-type" value={type} onChange={(e) => setType(e.target.value)}>
              {["All", "One day", "Short term"].map((t) => <option key={t}>{t}</option>)}
            </select>
          </aside>

          <section>
            <div className="count">{jobs.length} {jobs.length === 1 ? "job" : "jobs"}</div>
            {saveError && <p role="alert">{saveError}</p>}
            <div className="list">
              {jobs.length === 0 && <div className="empty">No jobs match your filters.</div>}
              {jobs.map((j) => {
                const isSaved = savedJobs.includes(j.id);
                return (
                  <div className="row" key={j.id}>
                    <div className="row-info">
                      <div className="row-title">{j.title}</div>
                      <div className="row-sub">{j.company} · {j.location}</div>
                      <div className="row-meta">{j.dateLabel} · {j.time} · {j.type}</div>
                    </div>
                    <div className="price">{rupee(j.pay)}<small>/day</small></div>
                    <button className={"btn-save" + (isSaved ? " is-saved" : "")} onClick={() => toggleSaved(j.id)}>
                      {isSaved ? "★ Saved" : "☆ Save"}
                    </button>
                    <button className="btn-view" onClick={() => onView(j)}>View</button>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p><b>Nivra</b> · Find work for a day. Build experience for tomorrow.</p>
      </footer>
    </div>
  );
}

/* ---------- Styles ---------- */
const css = `
.nivra {
  --bg:#faf5f1; --border:#e8ded8; --ink:#2a1f21; --muted:#6f6165; --brand:#5a3a40;
  --brand-soft:#f6dcdc; --dot:#e0959b; --green-bg:#e3efdf; --green-ink:#2f5d2f;
  background:var(--bg); color:var(--ink);
  font-family:"DejaVu Sans","Segoe UI",system-ui,-apple-system,Roboto,Arial,sans-serif;
  font-size:16px; line-height:1.4; min-height:100vh; display:flex; flex-direction:column;
}
.nivra *{box-sizing:border-box}
.nivra a{color:inherit;text-decoration:none}
.nivra button,.nivra input,.nivra select{font:inherit;color:inherit}

/* prototype bar */
.nivra .protobar{background:var(--brand);color:#fff;font-size:13px;font-weight:700;padding:6px 11px;height:30px}

/* header */
.nivra .header{background:#fff;border-bottom:1px solid var(--border)}
.nivra .header-inner{max-width:1086px;margin:0 auto;height:59px;display:flex;align-items:center;gap:12px}
.nivra .logo{font-size:20px;font-weight:800;color:var(--brand);margin-right:4px;letter-spacing:.2px}
.nivra .logo i{display:inline-block;width:8px;height:8px;background:var(--dot);border-radius:50%;margin-left:2px}
.nivra .nav{display:flex;gap:4px;align-items:center}
.nivra .nav a{padding:8px 10px;border-radius:8px;color:var(--muted);font-size:16px}
.nivra .nav a.active{background:var(--brand-soft);color:var(--brand)}
.nivra .spacer{flex:1}
.nivra .badge-student{background:var(--green-bg);color:var(--green-ink);font-size:13px;font-weight:700;padding:3px 9px;border-radius:6px}
.nivra .logout{color:var(--muted);padding:0 10px 0 22px}

/* page */
.nivra main{flex:1;width:100%;max-width:1086px;margin:0 auto;padding:0 0 40px}
.nivra h1{font-size:24px;margin:28px 0 14px;font-weight:800}

.nivra .searchbar{display:grid;grid-template-columns:517px 271px 1fr;gap:12px}
.nivra .field{height:43px;background:#fff;border:1px solid var(--border);border-radius:8px;padding:0 12px;width:100%}
.nivra .field::placeholder{color:#8d7f83}

.nivra .layout{display:grid;grid-template-columns:240px 1fr;gap:25px;margin-top:17px;align-items:start}
.nivra .filters{background:#fff;border:1px solid var(--border);border-radius:10px;padding:21px 21px 20px}
.nivra .filters h2{font-size:17px;margin:0 0 8px;font-weight:800}
.nivra .filters label{display:block;font-size:14px;color:#3d3033;margin:8px 0 5px}
.nivra .filters select{width:100%;height:42px;border:1px solid var(--border);border-radius:8px;padding:0 12px;background:#fff}

.nivra .count{text-align:right;font-weight:800;margin:0 0 12px}
.nivra .list{background:#fff;border:1px solid var(--border);border-radius:10px;padding:0 21px}
.nivra .row{display:flex;align-items:center;gap:12px;padding:19px 0 17px;border-bottom:1px solid var(--border)}
.nivra .row:last-child{border-bottom:0}
.nivra .row-info{flex:1;min-width:0}
.nivra .row-title{font-weight:800}
.nivra .row-sub{color:var(--muted);margin-top:1px}
.nivra .row-meta{color:var(--muted);font-size:14px;margin-top:3px}
.nivra .price{font-weight:800;white-space:nowrap;margin-right:4px}
.nivra .price small{font-weight:400;color:var(--muted);font-size:14px}
.nivra .empty{padding:40px 0;text-align:center;color:var(--muted)}

.nivra .btn-save{height:35px;min-width:75px;padding:0 12px;border:1px solid var(--border);background:#fff;border-radius:6px;cursor:pointer;font-size:14px;white-space:nowrap}
.nivra .btn-save.is-saved{min-width:84px}
.nivra .btn-view{height:35px;min-width:57px;padding:0 14px;background:var(--brand);color:#fff;border:0;border-radius:6px;font-size:14px;display:inline-flex;align-items:center;justify-content:center;cursor:pointer}

/* footer */
.nivra .footer{border-top:1px solid var(--border)}
.nivra .footer p{max-width:1086px;margin:0 auto;padding:24px 0 28px;font-size:14px;color:var(--muted)}
.nivra .footer b{color:var(--brand)}

@media (max-width:900px){
  .nivra main,.nivra .header-inner,.nivra .footer p{padding-left:16px;padding-right:16px}
  .nivra .searchbar{grid-template-columns:1fr}
  .nivra .layout{grid-template-columns:1fr}
  .nivra .row{flex-wrap:wrap}
  .nivra .nav a{padding:8px 6px;font-size:14px}
}
`;