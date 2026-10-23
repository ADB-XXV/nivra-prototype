import { useState, useMemo } from "react";
import StatusBadge from "../components/StatusBadge";
import ActionButtons from "../components/ActionButtons";
import { JOB, FILTERS } from "../data";

export default function ApplicationsManagement({ applicants, onOpen, onStatus }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");

  const rows = useMemo(
    () =>
      applicants.filter(
        (a) =>
          a.name.toLowerCase().includes(query.toLowerCase()) &&
          (filter === "All" || a.status === filter)
      ),
    [applicants, query, filter]
  );

  return (
    <main className="nv-container nv-main">
      <h1 className="nv-h1">Applicants</h1>
      <p className="nv-sub">
        {JOB.title} · {JOB.location} · {JOB.date} · {JOB.filled} of {JOB.total} filled
      </p>

      <div className="nv-toolbar">
        <input
          className="nv-input"
          placeholder="Search by name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className="nv-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
          {FILTERS.map((f) => (
            <option key={f}>{f}</option>
          ))}
        </select>
      </div>

      <div className="nv-card nv-table-card">
        <table className="nv-table">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Skills</th>
              <th>Availability</th>
              <th>Experience</th>
              <th>Applied</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id}>
                <td>
                  <button className="nv-name" onClick={() => onOpen(a.id)}>{a.name}</button>
                </td>
                <td>{a.skills.join(", ")}</td>
                <td>{a.availability}</td>
                <td>{a.experience}</td>
                <td>{a.applied}</td>
                <td><StatusBadge status={a.status} /></td>
                <td>
                  <ActionButtons
                    onShortlist={() => onStatus(a.id, "Shortlisted")}
                    onAccept={() => onStatus(a.id, "Accepted")}
                    onReject={() => onStatus(a.id, "Rejected")}
                  />
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="nv-empty">No applicants found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}