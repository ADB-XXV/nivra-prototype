
"use client";

import { useEffect, useState } from "react";
import StudentNavbar from "../components/StudentNavbar";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";

const rupee = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

const SAVED_KEY = "nivra.saved";

const loadSaved = () => {
  try {
    const value = JSON.parse(localStorage.getItem(SAVED_KEY));
    return new Set(Array.isArray(value) ? value : []);
  } catch {
    return new Set();
  }
};

const persistSaved = (saved) => {
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify([...saved]));
  } catch (error) {
    console.error("Unable to save jobs:", error);
  }
};

export default function JobDetail({
  job: selectedJob,
  onBack,
  backHref = "/browsejobs",
  savedJobs,
  toggleSaved,
  setAppliedJobs,
  publicView = false,
}) {
  const [saved, setSaved] = useState(() => loadSaved());
  const [isApplied, setIsApplied] = useState(false);
  const [checkingApplication, setCheckingApplication] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applyMessage, setApplyMessage] = useState("");

  const job = selectedJob;

  useEffect(() => {
    persistSaved(saved);
  }, [saved]);

  useEffect(() => {
    let active = true;

    async function checkApplication() {
      setCheckingApplication(true);
      setIsApplied(false);

      if (!job?.id) {
        setCheckingApplication(false);
        return;
      }

      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;

        if (!user) {
          if (active) setCheckingApplication(false);
          return;
        }

        const { data, error } = await supabase
          .from("applications")
          .select("id")
          .eq("job_id", job.id)
          .eq("student_id", user.id)
          .maybeSingle();

        if (error) throw error;

        if (active) {
          setIsApplied(!!data);
        }
      } catch (error) {
        console.error("Could not check application:", error);
      } finally {
        if (active) setCheckingApplication(false);
      }
    }

    checkApplication();

    return () => {
      active = false;
    };
  }, [job?.id]);

  const isSaved = job
    ? Array.isArray(savedJobs)
      ? savedJobs.includes(job.id)
      : saved.has(job.id)
    : false;

  function toggleSave() {
    if (!job) return;

    if (publicView) {
      window.location.assign("/login?mode=login");
      return;
    }

    if (toggleSaved) {
      toggleSaved(job.id);
      return;
    }

    setSaved((previous) => {
      const next = new Set(previous);

      if (next.has(job.id)) {
        next.delete(job.id);
      } else {
        next.add(job.id);
      }

      return next;
    });
  }

  async function apply() {
    if (!job?.id || applying || isApplied) return;

    if (publicView) {
      window.location.assign("/login?mode=login");
      return;
    }

    setApplying(true);
    setApplyMessage("");

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;

      if (!user) {
        setApplyMessage("Please log in to apply.");
        return;
      }

      const { error } = await supabase
        .from("applications")
        .insert({
          job_id: job.id,
          student_id: user.id,
        });

      if (error) {
        if (error.code === "23505") {
          setIsApplied(true);
          setApplyMessage("You have already applied for this job.");
          return;
        }

        throw error;
      }

      setIsApplied(true);

      if (setAppliedJobs) {
        setAppliedJobs((previous) =>
          previous.includes(job.id)
            ? previous
            : [...previous, job.id]
        );
      }

      setApplyMessage("Application submitted successfully!");
    } catch (error) {
      console.error("Application failed:", error);
      setApplyMessage(
        error.message || "Could not submit your application."
      );
    } finally {
      setApplying(false);
    }
  }

  return (
    <div className="nivra">
      <style>{css}</style>

      {publicView ? (
        <Navbar role="public" />
      ) : (
        <StudentNavbar active="/browsejobs" />
      )}

      <main>
        <a
          className="back"
          href={backHref}
          onClick={
            onBack
              ? (event) => {
                  event.preventDefault();
                  onBack();
                }
              : undefined
          }
        >
          ← Back to jobs
        </a>

        {!job ? (
          <div className="panel" style={{ marginTop: 16 }}>
            Job not found.
          </div>
        ) : (
          <>
            <h2 className="detail-title">{job.title}</h2>

            <div className="detail-sub">
              {job.company} · {job.city || job.location} · {job.category}
            </div>

            <div className="detail-grid">
              <article className="panel">
                <h3>About the job</h3>
                <p>{job.about || job.description}</p>

                <h3>Responsibilities</h3>
                <ul>
                  {(job.resp || job.responsibilities || []).map(
                    (responsibility, index) => (
                      <li key={index}>{responsibility}</li>
                    )
                  )}
                </ul>

                <h3>Skills</h3>
                <p>{job.skills || "Not specified"}</p>

                <h3>Eligibility</h3>
                <p>
                  {job.eligibility ||
                    job.elig ||
                    "Check job requirements with the employer."}
                </p>
              </article>

              <div className="side">
                <div className="panel">
                  <div className="big">
                    {rupee(job.pay)}
                    <small>/{job.basis || "day"}</small>
                  </div>

                  <div className="line">
                    {job.when || job.dateLabel || "Date not specified"}
                  </div>

                  <div className="line">
                    {job.time || job.hours || "Hours not specified"}
                  </div>

                  <div className="line">
                    {job.workers || 1} workers needed
                  </div>

                  {checkingApplication ? (
                    <div className="line">Checking application...</div>
                  ) : isApplied ? (
                    <span className="tag-applied">Applied</span>
                  ) : (
                    <div className="actions">
                      <button
                        className="btn-primary"
                        onClick={apply}
                        disabled={applying}
                      >
                        {applying ? "Applying..." : "Apply now"}
                      </button>
                    </div>
                  )}

                  {applyMessage && (
                    <p className="apply-message" role="status">
                      {applyMessage}
                    </p>
                  )}

                  <div>
                    <button className="btn-save" onClick={toggleSave}>
                      {isSaved ? "★ Saved" : "☆ Save"}
                    </button>
                  </div>
                </div>

                <div className="panel employer">
                  <h3>{job.company}</h3>
                  <p>
                    Local business in {job.city || job.location}.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

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
.nivra .protobar{background:var(--brand);color:#fff;font-size:13px;font-weight:700;padding:6px 11px;height:30px}
.nivra .header{background:#fff;border-bottom:1px solid var(--border)}
.nivra .header-inner{max-width:1086px;margin:0 auto;height:59px;display:flex;align-items:center;gap:12px}
.nivra .logo{font-size:20px;font-weight:800;color:var(--brand);margin-right:4px;letter-spacing:.2px}
.nivra .logo i{display:inline-block;width:8px;height:8px;background:var(--dot);border-radius:50%;margin-left:2px}
.nivra .nav{display:flex;gap:4px;align-items:center}
.nivra .nav a{padding:8px 10px;border-radius:8px;color:var(--muted);font-size:16px}
.nivra .spacer{flex:1}
.nivra .badge-student{background:var(--green-bg);color:var(--green-ink);font-size:13px;font-weight:700;padding:3px 9px;border-radius:6px}
.nivra .logout{color:var(--muted);padding:0 10px 0 22px}
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
.nivra .apply-message{margin:10px 0;color:var(--muted)}
.nivra .employer h3{margin:0 0 6px}
.nivra .employer p{color:var(--muted)}
.nivra .btn-save{height:35px;min-width:75px;padding:0 12px;border:1px solid var(--border);background:#fff;border-radius:6px;cursor:pointer;font-size:14px;white-space:nowrap}
.nivra .btn-primary{width:100%;height:40px;padding:0 14px;background:var(--brand);color:#fff;border:0;border-radius:6px;cursor:pointer;font-size:14px;font-weight:700;margin-bottom:10px}
.nivra .btn-primary:disabled{opacity:.65;cursor:wait}
.nivra .footer{border-top:1px solid var(--border)}
.nivra .footer p{max-width:1086px;margin:0 auto;padding:24px 0 28px;font-size:14px;color:var(--muted)}
.nivra .footer b{color:var(--brand)}
@media(max-width:900px){
  .nivra main,.nivra .header-inner,.nivra .footer p{padding-left:16px;padding-right:16px}
  .nivra .detail-grid{grid-template-columns:1fr}
  .nivra .nav a{padding:8px 6px;font-size:14px}
}
`;
