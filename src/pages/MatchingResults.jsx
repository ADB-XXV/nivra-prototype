"use client";

"use client";

import { useEffect, useState } from "react";
import EmployerNavbar from "../components/EmployerNavbar";
// import Footer from "../components/Footer";

// Navbar is intentionally not rendered here. Place it above this page's output
// (or in your layout) with: <Navbar role="employer" active="/employer/matching" />
// All sample data below is fictional.

const JOB = { title: "Event Assistant", employer: "Malabar Events", city: "Kozhikode", date: "Sat, 24 Oct", hours: "9:00 am – 5:00 pm", needed: 5 };

// level: "full" = meets it, "part" = partly, "low" = weak
const CANDIDATES = [
  { id: 1, name: "Anjali Nair", college: "St. Joseph’s College, Devagiri", score: 92, status: "Under review", km: 3, months: 18,
    skills: { text: "4 of 5 required skills", level: "full" }, avail: { text: "Free 9 am – 5 pm", level: "full" },
    loc: { text: "Kozhikode · about 3 km", level: "full" }, exp: { text: "2 similar events", level: "full" } },
  { id: 2, name: "Rohit Das", college: "Farook College", score: 84, status: "Applied", km: 6, months: 9,
    skills: { text: "3 of 5 required skills", level: "full" }, avail: { text: "Free 9 am – 5 pm", level: "full" },
    loc: { text: "Kozhikode · about 6 km", level: "full" }, exp: { text: "1 wedding crew job", level: "part" } },
  { id: 3, name: "Fathima Shereen", college: "MES Arts College, Malappuram", score: 77, status: "Shortlisted", km: 52, months: 2,
    skills: { text: "3 of 5 required skills", level: "full" }, avail: { text: "9 am – 3 pm only", level: "part" },
    loc: { text: "Malappuram · travel needed", level: "part" }, exp: { text: "Retail intern, 2 months", level: "part" } },
  { id: 4, name: "Arjun Menon", college: "Rajagiri College, Kochi", score: 68, status: "Applied", km: 190, months: 30,
    skills: { text: "2 of 5 required skills", level: "part" }, avail: { text: "Free 9 am – 5 pm", level: "full" },
    loc: { text: "Kochi · travel and stay needed", level: "low" }, exp: { text: "3 similar events", level: "full" } },
];

// Fails a required availability condition, so it is never ranked.
const NOT_RANKED = [
  { id: 5, name: "Neha Pillai", college: "Providence Women’s College", reason: "Not free before 1 pm on 24 Oct. The job starts at 9 am." },
];

const MARK = { full: ["✓", "Strong"], part: ["~", "Partial"], low: ["!", "Weak"] };
const FACTORS = [["skills", "Skills"], ["avail", "Availability"], ["loc", "Location"], ["exp", "Experience"]];

const css = `
.nv .mr-head{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;flex-wrap:wrap;margin-bottom:16px}
.nv .mr-head h1{font-size:1.7rem;margin:0 0 4px}
.nv .mr-note{background:var(--sl);border-radius:6px;padding:10px 14px;font-size:.88rem;margin-bottom:16px}
.nv .mr-bar{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px}
.nv .mr-bar select{width:auto;min-width:150px}
.nv .mr-bar .grow{flex:1}
.nv .mr-list{background:var(--sf);border:1px solid var(--ln);border-radius:8px}
.nv .mr-row{display:grid;grid-template-columns:76px minmax(0,1fr) 150px;gap:18px;padding:18px 20px;border-bottom:1px solid var(--ln);align-items:start}
.nv .mr-row:last-child{border-bottom:0}
.nv .mr-score{text-align:center}
.nv .mr-score b{display:block;font-size:1.9rem;line-height:1;color:var(--sd)}
.nv .mr-score span{font-size:.72rem;color:var(--mu);text-transform:uppercase;letter-spacing:.05em}
.nv .mr-rank{font-size:.78rem;color:var(--mu);margin-bottom:6px}
.nv .mr-name{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:2px}
.nv .mr-name b{font-size:1.05rem}
.nv .mr-badge{font-size:.74rem;font-weight:700;padding:2px 9px;border-radius:4px;background:var(--ln)}
.nv .mr-badge.sl{background:var(--sl);color:var(--sd)}
.nv .mr-facts{display:grid;grid-template-columns:1fr 1fr;gap:8px 20px;margin-top:12px}
.nv .mr-fact{font-size:.88rem;display:flex;gap:8px;align-items:baseline}
.nv .mr-fact small{display:block;color:var(--mu);font-size:.75rem;text-transform:uppercase;letter-spacing:.04em}
.nv .mr-mk{flex:none;width:20px;height:20px;border-radius:50%;display:grid;place-items:center;font-size:.75rem;font-weight:700;background:var(--sl);color:var(--sd)}
.nv .mr-mk.part{background:var(--tl);color:var(--btn)}
.nv .mr-mk.low{background:none;border:1px solid var(--er);color:var(--er)}
.nv .mr-act{display:flex;flex-direction:column;gap:8px}
.nv .mr-act .btn{width:100%;text-align:center}
.nv .mr-chk{display:flex;gap:8px;align-items:center;font-weight:400;margin:0;font-size:.85rem}
.nv .mr-chk input{width:auto}
.nv .mr-ex{margin-top:16px}.nv .mr-ex .box{padding:14px 20px}
.nv .mr-ov{position:fixed;inset:0;background:rgba(30,20,22,.5);display:grid;place-items:center;z-index:20;padding:16px}
.nv .mr-md{background:var(--sf);border-radius:10px;padding:24px;max-width:760px;width:100%;max-height:88vh;overflow:auto}
.nv .mr-md table{width:100%;border-collapse:collapse;font-size:.9rem}
.nv .mr-md th,.nv .mr-md td{text-align:left;padding:10px 8px;border-bottom:1px solid var(--ln);vertical-align:top}
.nv .mr-md th{font-size:.78rem;color:var(--mu);text-transform:uppercase;letter-spacing:.04em}
.nv .mr-empty{text-align:center;padding:36px 12px}
@media(max-width:760px){
 .nv .mr-row{grid-template-columns:60px minmax(0,1fr);padding:16px}
 .nv .mr-act{grid-column:1 / -1;flex-direction:row;flex-wrap:wrap;align-items:center}
 .nv .mr-act .btn{width:auto;flex:1}
 .nv .mr-facts{grid-template-columns:1fr}
}
`;

// onNavigate(path): pass React Router's navigate. Falls back to a normal page load.
export default function MatchingResults({ onNavigate = (p) => window.location.assign(p) }) {
  const [sort, setSort] = useState("match");
  const [minScore, setMinScore] = useState(0);
  const [availOnly, setAvailOnly] = useState(false);
  const [compare, setCompare] = useState([]);
  const [shortlisted, setShortlisted] = useState([3]);
  const [showCompare, setShowCompare] = useState(false);

  useEffect(() => {
    if (!showCompare) return;
    const onKey = (e) => e.key === "Escape" && setShowCompare(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showCompare]);

  const list = CANDIDATES
    .filter((c) => c.score >= minScore && (!availOnly || c.avail.level === "full"))
    .sort((a, b) =>
      sort === "exp" ? b.months - a.months : sort === "near" ? a.km - b.km : b.score - a.score
    );

  const toggle = (setter) => (id) =>
    setter((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  const toggleShortlist = toggle(setShortlisted);
  const toggleCompare = (id) =>
    setCompare((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : cur.length < 3 ? [...cur, id] : cur));

  const reset = () => { setMinScore(0); setAvailOnly(false); setSort("match"); };
  const picked = CANDIDATES.filter((c) => compare.includes(c.id));

  return (
    <div className="nv">
      <style>{css}</style>
      <EmployerNavbar active="/employer/matching" />

      <main className="w" style={{ padding: "28px 20px 8px" }}>
        <div className="mr-head">
          <div>
            <h1>Matching results</h1>
            <p className="mu" style={{ margin: 0 }}>
              {JOB.title} · {JOB.employer} · {JOB.city} · {JOB.date}, {JOB.hours} · {JOB.needed} workers needed
            </p>
          </div>
          <span className="tag">Premium</span>
        </div>

        <p className="mr-note">
          Scores are indicative recommendations, not guarantees. Required availability always applies, on every plan.
          Review each profile before you decide.
        </p>

        <div className="mr-bar">
          <select aria-label="Sort candidates" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="match">Sort: Best match</option>
            <option value="exp">Sort: Most experience</option>
            <option value="near">Sort: Nearest</option>
          </select>
          <select aria-label="Minimum match score" value={minScore} onChange={(e) => setMinScore(+e.target.value)}>
            <option value={0}>Any score</option>
            <option value={70}>70 and above</option>
            <option value={80}>80 and above</option>
          </select>
          <select aria-label="Availability filter" value={availOnly ? "full" : "all"} onChange={(e) => setAvailOnly(e.target.value === "full")}>
            <option value="all">Any availability</option>
            <option value="full">Fully available only</option>
          </select>
          <span className="grow mu" style={{ fontSize: ".88rem" }}>
            {list.length} ranked · {shortlisted.length} shortlisted
          </span>
          <button className="btn s" disabled={compare.length < 2} style={{ opacity: compare.length < 2 ? 0.55 : 1 }} onClick={() => setShowCompare(true)}>
            Compare ({compare.length}/3)
          </button>
        </div>

        <section className="mr-list" aria-label="Ranked candidates">
          {list.length === 0 ? (
            <div className="mr-empty">
              <h3>No candidates match these filters</h3>
              <p className="mu">Lower the minimum score or allow partial availability.</p>
              <button className="btn s" onClick={reset}>Clear filters</button>
            </div>
          ) : (
            list.map((c, i) => {
              const isShort = shortlisted.includes(c.id);
              return (
                <article className="mr-row" key={c.id}>
                  <div className="mr-score">
                    <div className="mr-rank">#{i + 1}</div>
                    <b>{c.score}</b>
                    <span>match</span>
                  </div>

                  <div>
                    <div className="mr-name">
                      <b>{c.name}</b>
                      <span className={`mr-badge ${isShort ? "sl" : ""}`}>{isShort ? "Shortlisted" : c.status}</span>
                    </div>
                    <div className="mu" style={{ fontSize: ".88rem" }}>{c.college}</div>

                    <div className="mr-facts">
                      {FACTORS.map(([key, label]) => {
                        const f = c[key];
                        return (
                          <div className="mr-fact" key={key}>
                            <span className={`mr-mk ${f.level}`} role="img" aria-label={MARK[f.level][1]}>{MARK[f.level][0]}</span>
                            <div><small>{label}</small>{f.text}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mr-act">
                    <button className={`btn ${isShort ? "" : "s"}`} onClick={() => toggleShortlist(c.id)} aria-pressed={isShort}>
                      {isShort ? "✓ Shortlisted" : "Shortlist"}
                    </button>
                    <button className="btn s" onClick={() => onNavigate(`/employer/applicants/${c.id}`)}>View profile</button>
                    <label className="mr-chk">
                      <input type="checkbox" checked={compare.includes(c.id)} onChange={() => toggleCompare(c.id)}
                        disabled={!compare.includes(c.id) && compare.length >= 3} />
                      Compare
                    </label>
                  </div>
                </article>
              );
            })
          )}
        </section>

        {NOT_RANKED.length > 0 && (
          <section className="mr-ex" aria-label="Candidates not ranked">
            <h3>Not ranked: required availability not met</h3>
            {NOT_RANKED.map((c) => (
              <div className="box" key={c.id} style={{ marginTop: 8 }}>
                <div className="mr-name"><b>{c.name}</b><span className="mr-badge">Not ranked</span></div>
                <div className="mu" style={{ fontSize: ".88rem" }}>{c.college} · {c.reason}</div>
              </div>
            ))}
          </section>
        )}
      </main>

      {/* <Footer /> */}

      {showCompare && (
        <div className="mr-ov" onClick={(e) => e.target === e.currentTarget && setShowCompare(false)}>
          <div className="mr-md" role="dialog" aria-modal="true" aria-label="Compare candidates">
            <h2>Compare candidates</h2>
            <table>
              <thead>
                <tr><th></th>{picked.map((c) => <th key={c.id}>{c.name}</th>)}</tr>
              </thead>
              <tbody>
                <tr><td className="mu">Match score</td>{picked.map((c) => <td key={c.id}><b>{c.score}</b></td>)}</tr>
                {FACTORS.map(([key, label]) => (
                  <tr key={key}>
                    <td className="mu">{label}</td>
                    {picked.map((c) => <td key={c.id}>{MARK[c[key].level][0]} {c[key].text}</td>)}
                  </tr>
                ))}
                <tr><td className="mu">Status</td>{picked.map((c) => <td key={c.id}>{shortlisted.includes(c.id) ? "Shortlisted" : c.status}</td>)}</tr>
              </tbody>
            </table>
            <div className="row" style={{ marginTop: 16 }}>
              {picked.map((c) => (
                <button key={c.id} className="btn s sm" onClick={() => toggleShortlist(c.id)}>
                  {shortlisted.includes(c.id) ? `Remove ${c.name.split(" ")[0]}` : `Shortlist ${c.name.split(" ")[0]}`}
                </button>
              ))}
              <button className="btn sm" onClick={() => setShowCompare(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}