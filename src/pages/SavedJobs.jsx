
"use client";

import { useEffect, useState } from "react";
import StudentNavbar from "../components/StudentNavbar";
import { supabase } from "../lib/supabase";

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
  box-sizing: border-box;
}
.nv-root *, .nv-root *::before, .nv-root *::after { box-sizing: inherit; }
.nv-root button { font-family: inherit; cursor: pointer; }

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
.nv-btn[disabled] { opacity: 0.6; cursor: default; }

.nv-empty { padding: 36px 0; text-align: center; color: var(--muted); }
.nv-message { margin: 0 0 14px; color: var(--muted); }

.nv-footer p {
  max-width: 1160px; margin: 0 auto; padding: 28px 24px 60px;
  color: var(--muted); font-size: 14px;
}
.nv-footer strong { color: var(--ink); }

@media (max-width: 820px) {
  .nv-row { flex-direction: column; align-items: flex-start; }
  .nv-side { flex-wrap: wrap; }
}
`;

export default function SavedJobs({
  onNavigate = (path) => window.location.assign(path),
}) {
  const [jobs, setJobs] = useState([]);
  const [applied, setApplied] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState(null);
  const [message, setMessage] = useState("");
  const [removing, setRemoving] = useState(null);
  const [applying, setApplying] = useState(null);

  useEffect(() => {
    loadSavedJobs();
  }, []);

  async function loadSavedJobs() {
    setLoading(true);
    setMessage("");

    const { data: { user }, error: authError } =
      await supabase.auth.getUser();

    if (authError || !user) {
      setMessage("Please log in to view your saved jobs.");
      setLoading(false);
      return;
    }

    setStudentId(user.id);

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || profile.role !== "student") {
      setMessage("This page is only available to student accounts.");
      setLoading(false);
      return;
    }

    const { data: saved, error: savedError } = await supabase
      .from("saved_jobs")
      .select("job_id")
      .eq("student_id", user.id);

    if (savedError) {
      setMessage("Could not load saved jobs: " + savedError.message);
      setLoading(false);
      return;
    }

    const jobIds = saved.map((item) => item.job_id);

    if (jobIds.length === 0) {
      setJobs([]);
      setApplied([]);
      setLoading(false);
      return;
    }

    const { data: jobData, error: jobsError } = await supabase
      .from("jobs")
      .select("*")
      .in("id", jobIds);

    if (jobsError) {
      setMessage("Could not load job details: " + jobsError.message);
      setLoading(false);
      return;
    }

    const employerIds = [
      ...new Set(jobData.map((job) => job.employer_id))
    ];

    const { data: employers, error: employersError } = await supabase
      .from("profiles")
      .select("id, business")
      .in("id", employerIds);

    if (employersError) {
      setMessage("Could not load employer details: " + employersError.message);
      setLoading(false);
      return;
    }

    const employerMap = {};
    employers.forEach((employer) => {
      employerMap[employer.id] = employer.business;
    });

    const formattedJobs = jobData.map((job) => ({
      ...job,
      company: employerMap[job.employer_id] || "Employer",
    }));

    setJobs(formattedJobs);

    const { data: applications, error: applicationsError } =
      await supabase
        .from("applications")
        .select("job_id")
        .eq("student_id", user.id);

    if (applicationsError) {
      setMessage("Could not load application status: " + applicationsError.message);
      setLoading(false);
      return;
    }

    setApplied(applications.map((item) => item.job_id));
    setLoading(false);
  }

  async function remove(jobId) {
    if (!studentId) return;

    setRemoving(jobId);
    setMessage("");

    const { error } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("student_id", studentId)
      .eq("job_id", jobId);

    if (error) {
      setMessage("Could not remove saved job: " + error.message);
      setRemoving(null);
      return;
    }

    setJobs((current) => current.filter((job) => job.id !== jobId));
    setRemoving(null);
  }

  async function apply(jobId) {
    if (!studentId) return;

    setApplying(jobId);
    setMessage("");

    if (applied.includes(jobId)) {
      setMessage("You have already applied for this job.");
      setApplying(null);
      return;
    }

    const { error } = await supabase
      .from("applications")
      .insert({
        job_id: jobId,
        student_id: studentId,
        status: "Pending",
      });

    if (error) {
      if (error.code === "23505") {
        setApplied((current) => [...current, jobId]);
        setMessage("You have already applied for this job.");
      } else {
        setMessage("Could not apply: " + error.message);
      }

      setApplying(null);
      return;
    }

    setApplied((current) => [...current, jobId]);
    setMessage("Application submitted successfully!");
    setApplying(null);
  }

  function formatDate(date) {
    if (!date) return "";

    return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  }

  function getSchedule(job) {
    const date = formatDate(job.date);
    const hours = job.hours || "";
    return [date, hours, job.basis].filter(Boolean).join(" · ");
  }

  if (loading) {
    return (
      <div className="nv-root">
        <StudentNavbar active="/saved" />
        <main className="nv-main">Loading saved jobs...</main>
      </div>
    );
  }

  return (
    <div className="nv-root">
      <style>{CSS}</style>

      <StudentNavbar active="/saved" />

      <main className="nv-main">
        <h1 className="nv-title">Saved jobs</h1>

        {message && (
          <p className="nv-message" role="status">
            {message}
          </p>
        )}

        <section className="nv-card">
          {jobs.length === 0 && (
            <div className="nv-empty">
              No saved jobs yet. Save a job from Browse jobs to see it here.
            </div>
          )}

          {jobs.map((job) => (
            <article className="nv-row" key={job.id}>
              <div className="nv-info">
                <h2 className="nv-job-title">{job.title}</h2>
                <p className="nv-job-sub">
                  {job.company} · {job.location}
                </p>
                <p className="nv-job-meta">{getSchedule(job)}</p>
              </div>

              <div className="nv-side">
                <span className="nv-pay">
                  ₹{job.amount}
                  <small>/{job.basis || "job"}</small>
                </span>

                <button
                  type="button"
                  className="nv-remove"
                  disabled={removing === job.id}
                  onClick={() => remove(job.id)}
                >
                  {removing === job.id ? "Removing..." : "Remove"}
                </button>

                <button
                  type="button"
                  className="nv-btn"
                  onClick={() =>
                    onNavigate(`/jobdetails/${job.id}?returnTo=saved`)
                  }
                >
                  View job
                </button>

                <button
                  type="button"
                  className="nv-btn primary"
                  disabled={applied.includes(job.id) || applying === job.id}
                  onClick={() => apply(job.id)}
                >
                  {applying === job.id
                    ? "Applying..."
                    : applied.includes(job.id)
                    ? "Applied"
                    : "Apply"}
                </button>
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
