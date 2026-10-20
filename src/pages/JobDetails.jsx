
function JobDetails({
  job,
  onBack,
  savedJobs,
  toggleSaved,
  appliedJobs,
  setAppliedJobs
}) {
  const isSaved = savedJobs.includes(job.id);
  const isApplied = appliedJobs.includes(job.id);

  function applyToJob() {
    if (!isApplied) {
      setAppliedJobs((previous) => [...previous, job.id]);
    }
  }

  return (
    <main className="details-page">
      <button className="back-link" onClick={onBack}>
        ← Back to jobs
      </button>

      <div className="details-grid">
        <section className="details-main">
          <h1>{job.title}</h1>

          <p className="job-subtitle">
            {job.company} · {job.location} · {job.category}
          </p>

          <div className="panel description-panel">
            <h3>About the job</h3>
            <p>{job.description}</p>

            <h3>Responsibilities</h3>
            <ul>
              {job.responsibilities.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3>Skills</h3>
            <p>{job.skills}</p>

            <h3>Eligibility</h3>
            <p>{job.eligibility}</p>
          </div>
        </section>

        <aside className="details-sidebar">
          <div className="panel pay-panel">
            <div className="detail-pay">
              ₹{job.pay}<span>/day</span>
            </div>

            <p>{job.dateLabel}</p>
            <p>{job.time}</p>
            <p>{job.workers} workers needed</p>

            {isApplied && (
              <span className="applied-badge">
                Applied
              </span>
            )}

            <div className="detail-actions">
              <button
                className="button button-outline"
                onClick={() => toggleSaved(job.id)}
              >
                {isSaved ? "★ Saved" : "☆ Save"}
              </button>

              <button
                className="button button-primary apply-button"
                onClick={applyToJob}
                disabled={isApplied}
              >
                {isApplied ? "Applied" : "Apply now"}
              </button>
            </div>
          </div>

          <div className="panel employer-panel">
            <h3>{job.company}</h3>
            <p>
              Local business in {job.location}. Sample employer,
              not verified.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default JobDetails;
