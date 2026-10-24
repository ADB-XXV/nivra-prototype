"use client";

import React, { useState } from "react";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; }
.nivra-matching {
  --ink: #342a2c;
  --muted: #817779;
  --line: #e9dfdb;
  --maroon: #593b40;
  --cream: #faf6f2;
  min-height: 100vh;
  background: var(--cream);
  color: var(--ink);
  font-family: Inter, Arial, sans-serif;
  font-size: 10px;
  padding-bottom: 22px;
}
.nivra-matching .top-strip {
  height: 16px;
  background: var(--maroon);
  color: #f7eeee;
  padding: 3px 9px;
  font-size: 7px;
  font-weight: 500;
}
.nivra-matching .content {
  width: min(455px, calc(100% - 36px));
  margin: 0 auto;
}
.nivra-matching main { padding-top: 13px; }
.nivra-matching .heading-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 12px;
  margin-bottom: 7px;
}
.nivra-matching h1 {
  font-size: 13px;
  line-height: 1.25;
  margin: 0 0 3px;
  font-weight: 700;
  letter-spacing: -.2px;
}
.nivra-matching .subtitle {
  margin: 0;
  color: var(--muted);
  font-size: 7.5px;
  line-height: 1.4;
}
.nivra-matching .filters {
  display: flex;
  gap: 6px;
  align-items: center;
  flex-shrink: 0;
}
.nivra-matching select,
.nivra-matching .compare-selected {
  height: 21px;
  border: 1px solid #e5dcd7;
  background: #fff;
  color: #514748;
  border-radius: 4px;
  padding: 0 7px;
  font: 500 7.5px Inter, Arial, sans-serif;
}
.nivra-matching .compare-selected { cursor: pointer; }
.nivra-matching .candidate-list {
  background: #fff;
  border: 1px solid #eee5e0;
  border-radius: 5px;
  overflow: hidden;
}
.nivra-matching .candidate {
  display: grid;
  grid-template-columns: 23px minmax(0, 1fr) 49px;
  gap: 7px;
  min-height: 49px;
  padding: 7px 8px 6px;
  border-bottom: 1px solid #f0e8e4;
  align-items: start;
}
.nivra-matching .candidate:last-child { border-bottom: 0; }
.nivra-matching .score {
  color: #637a58;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
  padding-top: 1px;
}
.nivra-matching .candidate-title {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}
.nivra-matching .candidate-name { font-size: 9px; font-weight: 700; }
.nivra-matching .candidate-meta,
.nivra-matching .candidate-skills { color: var(--muted); font-size: 7px; margin-top: 3px; }
.nivra-matching .candidate-action { text-align: right; }
.nivra-matching .candidate-action button {
  border: 1px solid #e5dcd7;
  border-radius: 4px;
  background: #fff;
  padding: 4px 6px;
  color: #514748;
  font: 500 7px Inter, Arial, sans-serif;
  cursor: pointer;
}
.nivra-matching .candidate-action input { margin: 0 0 5px; }
@media (max-width: 520px) {
  .nivra-matching .heading-row { align-items: flex-start; flex-direction: column; }
  .nivra-matching .filters { flex-wrap: wrap; }
}
`;

const candidates = [
  { id: 1, name: "Ananya Menon", role: "Event Assistant", score: 96, experience: "2 years experience", skills: "Event support · Communication · Malayalam", status: "Available" },
  { id: 2, name: "Rahul Das", role: "Event Assistant", score: 91, experience: "1 year experience", skills: "Customer service · Setup · English", status: "Available" },
  { id: 3, name: "Meera Nair", role: "Event Assistant", score: 87, experience: "3 years experience", skills: "Coordination · Hospitality · Malayalam", status: "Reviewing" },
];

export default function MatchingResults() {
  const [sort, setSort] = useState("match");
  const [selected, setSelected] = useState([]);
  const visibleCandidates = [...candidates].sort((a, b) =>
    sort === "name" ? a.name.localeCompare(b.name) : b.score - a.score
  );

  const toggleCandidate = (id) => {
    setSelected((current) => current.includes(id)
      ? current.filter((candidateId) => candidateId !== id)
      : [...current, id]);
  };

  return (
    <div className="nivra-matching">
      <style>{styles}</style>
      <div className="top-strip">Nivra · Hiring workspace</div>
      <main className="content">
        <div className="heading-row">
          <div>
            <h1>Matching candidates</h1>
            <p className="subtitle">Event Assistant · Kozhikode · 3 candidates found</p>
          </div>
          <div className="filters">
            <select aria-label="Sort candidates" value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="match">Sort: Best match</option>
              <option value="name">Sort: Name</option>
            </select>
            <button className="compare-selected" type="button" disabled={selected.length < 2}>
              Compare ({selected.length})
            </button>
          </div>
        </div>
        <section className="candidate-list" aria-label="Candidate results">
          {visibleCandidates.map((candidate) => (
            <article className="candidate" key={candidate.id}>
              <div className="score">{candidate.score}%</div>
              <div>
                <div className="candidate-title">
                  <span className="candidate-name">{candidate.name}</span>
                  <span className="status">{candidate.status}</span>
                </div>
                <div className="candidate-meta">{candidate.role} · {candidate.experience}</div>
                <div className="candidate-skills">{candidate.skills}</div>
              </div>
              <div className="candidate-action">
                <input
                  type="checkbox"
                  aria-label={`Select ${candidate.name} to compare`}
                  checked={selected.includes(candidate.id)}
                  onChange={() => toggleCandidate(candidate.id)}
                />
                <button type="button">View profile</button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}