import StatusBadge from "../components/StatusBadge";
import ActionButtons from "../components/ActionButtons";
import { JOB, initials } from "../data";

export default function CandidateDetails({ applicant, onBack, onStatus }) {
  return (
    <main className="nv-container nv-main">
      <button className="nv-back" onClick={onBack}>← All applicants</button>

      <div className="nv-detail-head">
        <div className="nv-person">
          <div className="nv-avatar">{initials(applicant.name)}</div>
          <div>
            <h1 className="nv-h1 tight">{applicant.name}</h1>
            <div className="nv-sub">{applicant.college}</div>
          </div>
        </div>
        <div className="nv-head-actions">
          <StatusBadge status={applicant.status} />
          <ActionButtons
            onShortlist={() => onStatus(applicant.id, "Shortlisted")}
            onAccept={() => onStatus(applicant.id, "Accepted")}
            onReject={() => onStatus(applicant.id, "Rejected")}
          />
        </div>
      </div>

      <div className="nv-grid">
        <section className="nv-card nv-pad">
          <h3 className="nv-h3">Application message</h3>
          <p className="nv-quote">“{applicant.message}”</p>

          <h3 className="nv-h3">Skills</h3>
          <div className="nv-chips">
            {applicant.skills.map((s) => (
              <span key={s} className="nv-chip">{s}</span>
            ))}
            <span className="nv-chip">{applicant.languages}</span>
          </div>

          <h3 className="nv-h3 mt">Experience</h3>
          <p className="nv-text">{applicant.experience}</p>

          <h3 className="nv-h3">Availability</h3>
          <p className="nv-text">{applicant.availability}</p>
        </section>

        <aside className="nv-card nv-pad">
          <h3 className="nv-h3">Job requirements</h3>
          <p className="nv-muted">
            {JOB.title} · {JOB.time} · {JOB.location}
          </p>

          <h3 className="nv-h3">Why this candidate may match</h3>
          <ul className="nv-checks">
            {applicant.match.map((m) => (
              <li key={m}><span>✓</span> {m}</li>
            ))}
          </ul>
          <p className="nv-note">Indicative only. Check the profile before deciding.</p>
        </aside>
      </div>
    </main>
  );
}