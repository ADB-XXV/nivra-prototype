
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";

export default function CandidateProfile({ candidateId, applicationId }) {
  const [candidate, setCandidate] = useState(null);
  const [job, setJob] = useState(null);
  const [application, setApplication] = useState(null);
  const [status, setStatus] = useState("Applied");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [notice, setNotice] = useState("");

  const terminalStatuses = ["Accepted", "Rejected"];

  useEffect(() => {
    let active = true;

    async function loadCandidate() {
      setLoading(true);
      setNotice("");

      if (!candidateId || !applicationId) {
        if (active) {
          setNotice("Applicant or application ID is missing.");
          setLoading(false);
        }
        return;
      }

      const { data: app, error: appError } = await supabase
        .from("applications")
        .select("*")
        .eq("id", applicationId)
        .eq("student_id", candidateId)
        .single();

      if (!active) return;

      if (appError) {
        setNotice(`Could not load application: ${appError.message}`);
        setLoading(false);
        return;
      }

      const [profileResult, jobResult] = await Promise.all([
        supabase
          .from("profiles")
          .select("*")
          .eq("id", candidateId)
          .single(),

        supabase
          .from("jobs")
          .select("*")
          .eq("id", app.job_id)
          .single(),
      ]);

      if (!active) return;

      if (profileResult.error) {
        setNotice(
          `Could not load candidate profile: ${profileResult.error.message}`
        );
        setLoading(false);
        return;
      }

      if (jobResult.error) {
        setNotice(`Could not load job details: ${jobResult.error.message}`);
        setLoading(false);
        return;
      }

      setApplication(app);
      setCandidate(profileResult.data);
      setJob(jobResult.data);
      setStatus(app.status || "Applied");
      setLoading(false);
    }

    loadCandidate();

    return () => {
      active = false;
    };
  }, [candidateId, applicationId]);

  const skills = Array.isArray(candidate?.skills)
    ? candidate.skills
    : typeof candidate?.skills === "string"
      ? candidate.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean)
      : [];

  const initials = (candidate?.full_name || "Student")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const statusClass = status.toLowerCase().replace(/\s+/g, "-");

  const appliedDate = application?.applied_at
    ? new Date(application.applied_at).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Unknown";

  const jobDate = job?.date
    ? new Date(`${job.date}T12:00:00`).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Not specified";

  const jobSkills = Array.isArray(job?.skills)
    ? job.skills
    : typeof job?.skills === "string"
      ? job.skills.split(",").map((skill) => skill.trim())
      : [];

  const matchedSkills = skills.filter((skill) =>
    jobSkills.some(
      (jobSkill) =>
        jobSkill.toLowerCase() === skill.toLowerCase()
    )
  );

  const canUpdateStatus = (nextStatus) => {
    if (terminalStatuses.includes(status)) {
      return false;
    }

    if (nextStatus === "Shortlisted") {
      return ["Applied", "Under Review"].includes(status);
    }

    if (nextStatus === "Accepted") {
      return status === "Shortlisted";
    }

    return (
      nextStatus === "Rejected" &&
      ["Applied", "Under Review", "Shortlisted"].includes(status)
    );
  };

  const updateStatus = async (nextStatus) => {
    if (updating || !canUpdateStatus(nextStatus)) {
      return;
    }

    setUpdating(true);
    setNotice("");

    const { data, error } = await supabase
      .from("applications")
      .update({ status: nextStatus })
      .eq("id", applicationId)
      .select("id, status")
      .single();

    if (error) {
      console.error("Could not update application status:", error);
      setNotice(`Could not update status: ${error.message}`);
    } else {
      setStatus(data.status);

      setApplication((current) => ({
        ...current,
        status: data.status,
      }));

      setNotice(
        `Application ${nextStatus.toLowerCase()} successfully.`
      );
    }

    setUpdating(false);
  };

  return (
    <div className="nv">
      <Navbar role="employer" active="/employer/applicants" />

      <style>{`
        .cp-page {
          --cp-ink: #302626;
          --cp-muted: #817471;
          --cp-border: #e8dcd5;
          --cp-accent: #67464a;
          --cp-bg: #faf5f1;

          width: 100%;
          min-height: calc(100vh - 56px);
          padding: 34px clamp(20px, 5vw, 80px) 60px;
          box-sizing: border-box;
          background: var(--cp-bg);
          color: var(--cp-ink);
          font-family: "Manrope", "DM Sans", system-ui, sans-serif;
        }

        .cp-page *,
        .cp-page *::before,
        .cp-page *::after {
          box-sizing: border-box;
        }

        .cp-container {
          width: 100%;
          max-width: 1800px;
          margin: 0 auto;
        }

        .cp-back {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 26px;
          color: var(--cp-muted);
          font-size: 15px;
          font-weight: 550;
          text-decoration: none;
        }

        .cp-back:hover {
          color: var(--cp-accent);
        }

        .cp-back span {
          font-size: 21px;
        }

        .cp-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 28px;
          margin-bottom: 30px;
        }

        .cp-identity {
          display: flex;
          align-items: center;
          gap: 18px;
          min-width: 0;
        }

        .cp-avatar {
          display: grid;
          flex: 0 0 68px;
          width: 68px;
          height: 68px;
          place-items: center;
          border-radius: 16px;
          background: var(--cp-accent);
          color: white;
          font-size: 23px;
          font-weight: 800;
        }

        .cp-heading-text h1 {
          margin: 0;
          font-size: clamp(30px, 2.6vw, 44px);
          font-weight: 750;
          letter-spacing: -0.7px;
          line-height: 1.25;
        }

        .cp-heading-text p {
          margin: 8px 0 0;
          color: var(--cp-muted);
          font-size: 16px;
          line-height: 1.5;
        }

        .cp-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          flex-wrap: wrap;
          gap: 10px;
        }

        .cp-status {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 40px;
          padding: 9px 13px;
          border-radius: 8px;
          background: #f2e2de;
          color: #684449;
          font-size: 13px;
          font-weight: 750;
          white-space: nowrap;
        }

        .cp-status.under-review {
          background: #f2e2de;
          color: #684449;
        }

        .cp-status.applied {
          background: #eee5dc;
          color: #775e4e;
        }

        .cp-status.shortlisted {
          background: #e7eddf;
          color: #526b4b;
        }

        .cp-status.accepted {
          background: #dceee3;
          color: #276442;
        }

        .cp-status.rejected {
          background: #f8e4e2;
          color: #a33c3c;
        }

        .cp-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          padding: 10px 15px;
          border: 1px solid var(--cp-border);
          border-radius: 9px;
          background: white;
          font: inherit;
          font-size: 14px;
          font-weight: 650;
          cursor: pointer;
          transition: background 150ms ease, opacity 150ms ease;
        }

        .cp-button:hover:not(:disabled) {
          background: #f5ece8;
        }

        .cp-button:disabled {
          cursor: default;
          opacity: 0.45;
        }

        .cp-button.accept {
          border-color: var(--cp-accent);
          background: var(--cp-accent);
          color: white;
        }

        .cp-button.accept:hover:not(:disabled) {
          background: #513539;
        }

        .cp-button.reject {
          border-color: #d7a4a1;
          color: #a34545;
        }

        .cp-button.reject:hover:not(:disabled) {
          background: #fff1ef;
        }

        .cp-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.55fr) minmax(360px, 0.95fr);
          align-items: start;
          gap: 24px;
        }

        .cp-card {
          min-width: 0;
          padding: clamp(24px, 2.3vw, 36px);
          border: 1px solid var(--cp-border);
          border-radius: 16px;
          background: white;
          box-shadow: 0 5px 22px #4a2d2608;
        }

        .cp-card-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 24px;
        }

        .cp-label {
          display: block;
          margin-bottom: 9px;
          color: #9a8177;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.4px;
        }

        .cp-card-heading h2 {
          margin: 0;
          font-size: clamp(20px, 1.5vw, 24px);
          font-weight: 750;
          letter-spacing: -0.35px;
          line-height: 1.35;
        }

        .cp-card-icon {
          display: grid;
          flex: 0 0 44px;
          width: 44px;
          height: 44px;
          place-items: center;
          border-radius: 12px;
          background: #f7efeb;
          color: var(--cp-accent);
          font-size: 22px;
        }

        .cp-message {
          margin: 0 0 30px;
          padding: 20px 22px;
          border-left: 4px solid #b99b8c;
          border-radius: 0 10px 10px 0;
          background: #fcf8f5;
          color: #554844;
          font-size: 17px;
          line-height: 1.8;
        }

        .cp-detail {
          margin-top: 25px;
        }

        .cp-detail h3 {
          margin: 0 0 12px;
          color: #413331;
          font-size: 16px;
          font-weight: 750;
        }

        .cp-skills {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .cp-skill {
          display: inline-flex;
          align-items: center;
          min-height: 36px;
          padding: 8px 13px;
          border: 1px solid #e6d8d0;
          border-radius: 8px;
          background: #fffdfb;
          color: #5d4b46;
          font-size: 14px;
          line-height: 1.4;
        }

        .cp-value {
          margin: 0;
          color: #5d4b46;
          font-size: 16px;
          line-height: 1.65;
          overflow-wrap: anywhere;
        }

        .cp-job {
          padding: 22px;
          border: 1px solid #eee3dc;
          border-radius: 12px;
          background: #fcf8f5;
        }

        .cp-job h3 {
          margin: 0 0 18px;
          color: #443431;
          font-size: 20px;
          font-weight: 750;
        }

        .cp-job-meta {
          display: grid;
          gap: 14px;
        }

        .cp-job-meta p {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0;
          color: #74645e;
          font-size: 15px;
          line-height: 1.5;
        }

        .cp-meta-icon {
          display: grid;
          flex: 0 0 32px;
          width: 32px;
          height: 32px;
          place-items: center;
          border-radius: 9px;
          background: #f0e4dd;
          color: var(--cp-accent);
          font-size: 17px;
        }

        .cp-match {
          margin-top: 30px;
        }

        .cp-match h3 {
          margin: 0 0 18px;
          font-size: 18px;
          font-weight: 750;
          line-height: 1.45;
        }

        .cp-match-list {
          display: grid;
          gap: 17px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .cp-match-list li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          color: #5b6b52;
          font-size: 15px;
          line-height: 1.6;
        }

        .cp-check {
          display: grid;
          flex: 0 0 24px;
          width: 24px;
          height: 24px;
          place-items: center;
          border-radius: 50%;
          background: #e7eddf;
          color: #55704e;
          font-size: 14px;
          font-weight: 800;
        }

        .cp-match-summary {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 30px;
          padding: 18px;
          border: 1px solid #e5e9dc;
          border-radius: 12px;
          background: #f7f9f2;
        }

        .cp-score {
          display: grid;
          flex: 0 0 54px;
          width: 54px;
          height: 54px;
          place-items: center;
          border-radius: 12px;
          background: #e3ead8;
          color: #526b4b;
          font-size: 17px;
          font-weight: 850;
        }

        .cp-match-summary strong {
          display: block;
          color: #40513a;
          font-size: 15px;
        }

        .cp-match-summary p {
          margin: 5px 0 0;
          color: #7b8772;
          font-size: 12px;
          line-height: 1.5;
        }

        .cp-disclaimer {
          margin: 22px 0 0;
          color: #94857e;
          font-size: 13px;
          line-height: 1.7;
        }

        .cp-notice {
          margin-bottom: 20px;
          padding: 13px 16px;
          border: 1px solid #e8dcd5;
          border-radius: 9px;
          background: white;
          color: #67464a;
          font-size: 14px;
          line-height: 1.5;
        }

        .cp-loading {
          padding: 50px 20px;
          text-align: center;
          color: var(--cp-muted);
          font-size: 16px;
        }

        @media (min-width: 1600px) {
          .cp-message {
            font-size: 18px;
          }

          .cp-value,
          .cp-match-list li {
            font-size: 16px;
          }
        }

        @media (max-width: 1050px) {
          .cp-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .cp-actions {
            justify-content: flex-start;
          }

          .cp-card {
            padding: 22px;
          }
        }

        @media (max-width: 900px) {
          .cp-grid {
            grid-template-columns: minmax(0, 1fr);
            gap: 18px;
          }
        }

        @media (max-width: 760px) {
          .cp-page {
            padding: 26px 16px 40px;
          }

          .cp-header {
            gap: 22px;
            margin-bottom: 24px;
          }

          .cp-identity {
            align-items: flex-start;
            gap: 14px;
          }

          .cp-avatar {
            flex-basis: 54px;
            width: 54px;
            height: 54px;
            border-radius: 12px;
            font-size: 19px;
          }

          .cp-heading-text h1 {
            font-size: 27px;
          }

          .cp-heading-text p {
            font-size: 14px;
          }

          .cp-actions {
            justify-content: flex-start;
            gap: 8px;
          }

          .cp-actions .cp-button {
            flex: 1 1 auto;
          }

          .cp-status,
          .cp-button {
            min-height: 38px;
            padding: 8px 11px;
            font-size: 12px;
          }

          .cp-grid {
            grid-template-columns: minmax(0, 1fr);
            gap: 18px;
          }

          .cp-card {
            padding: 22px 18px;
            border-radius: 13px;
          }

          .cp-message {
            padding: 16px;
            font-size: 15px;
          }

          .cp-detail {
            margin-top: 22px;
          }

          .cp-skill {
            font-size: 13px;
          }
        }

        @media (max-width: 420px) {
          .cp-identity {
            width: 100%;
          }

          .cp-heading-text h1 {
            font-size: 24px;
          }

          .cp-actions {
            width: 100%;
          }

          .cp-actions .cp-status {
            flex-basis: 100%;
          }

          .cp-actions .cp-button {
            flex: 1 1 calc(50% - 8px);
          }
        }
      `}</style>

      <main className="cp-page">
        <div className="cp-container">
          <Link href="/employer/applicants" className="cp-back">
            <span aria-hidden="true">←</span> All applicants
          </Link>

          {loading ? (
            <div className="cp-loading">
              Loading applicant details...
            </div>
          ) : !candidate || !application || !job ? (
            <div className="cp-notice">
              {notice || "Applicant details could not be loaded."}
            </div>
          ) : (
            <>
              {notice && (
                <div className="cp-notice" role="status">
                  {notice}
                </div>
              )}

              <header className="cp-header">
                <div className="cp-identity">
                  <div className="cp-avatar">{initials}</div>

                  <div className="cp-heading-text">
                    <h1>{candidate.full_name || "Student"}</h1>
                    <p>{candidate.college || "College not provided"}</p>
                  </div>
                </div>

                <div className="cp-actions">
                  <span className={`cp-status ${statusClass}`}>
                    {status}
                  </span>

                  <button
                    className="cp-button"
                    disabled={
                      updating || !canUpdateStatus("Shortlisted")
                    }
                    onClick={() => updateStatus("Shortlisted")}
                  >
                    {updating ? "Updating..." : "Shortlist"}
                  </button>

                  <button
                    className="cp-button accept"
                    disabled={
                      updating || !canUpdateStatus("Accepted")
                    }
                    onClick={() => updateStatus("Accepted")}
                  >
                    Accept
                  </button>

                  <button
                    className="cp-button reject"
                    disabled={
                      updating || !canUpdateStatus("Rejected")
                    }
                    onClick={() => updateStatus("Rejected")}
                  >
                    Reject
                  </button>
                </div>
              </header>

              <div className="cp-grid">
                <section className="cp-card">
                  <div className="cp-card-heading">
                    <div>
                      <span className="cp-label">
                        APPLICATION DETAILS
                      </span>
                      <h2>Candidate information</h2>
                    </div>

                    <span className="cp-card-icon" aria-hidden="true">
                      ✉
                    </span>
                  </div>

                  <blockquote className="cp-message">
                    Application submitted on {appliedDate}.
                  </blockquote>

                  <div className="cp-detail">
                    <h3>Skills</h3>
                    <div className="cp-skills">
                      {skills.length > 0 ? (
                        skills.map((skill, index) => (
                          <span className="cp-skill" key={`${skill}-${index}`}>
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="cp-value">Not provided</p>
                      )}
                    </div>
                  </div>

                  <div className="cp-detail">
                    <h3>Experience</h3>
                    <p className="cp-value">
                      {candidate.experience || "Not provided"}
                    </p>
                  </div>

                  <div className="cp-detail">
                    <h3>Education</h3>
                    <p className="cp-value">
                      {candidate.education || "Not provided"}
                    </p>
                  </div>

                  <div className="cp-detail">
                    <h3>College</h3>
                    <p className="cp-value">
                      {candidate.college || "Not provided"}
                    </p>
                  </div>

                  <div className="cp-detail">
                    <h3>Availability</h3>
                    <p className="cp-value">
                      {candidate.availability || "Not provided"}
                    </p>
                  </div>

                  <div className="cp-detail">
                    <h3>Location</h3>
                    <p className="cp-value">
                      {candidate.city || "Not provided"}
                    </p>
                  </div>

                  <div className="cp-detail">
                    <h3>Phone</h3>
                    <p className="cp-value">
                      {candidate.phone || "Not provided"}
                    </p>
                  </div>

                  <div className="cp-detail">
                    <h3>Preferred job categories</h3>
                    <p className="cp-value">
                      {candidate.preferred_categories || "Not provided"}
                    </p>
                  </div>
                </section>

                <aside className="cp-card">
                  <div className="cp-card-heading">
                    <div>
                      <span className="cp-label">
                        POSITION OVERVIEW
                      </span>
                      <h2>Job details</h2>
                    </div>

                    <span className="cp-card-icon" aria-hidden="true">
                      ▤
                    </span>
                  </div>

                  <div className="cp-job">
                    <h3>{job.title || "Job"}</h3>

                    <div className="cp-job-meta">
                      <p>
                        <span className="cp-meta-icon">▦</span>
                        {jobDate}
                      </p>

                      <p>
                        <span className="cp-meta-icon">◷</span>
                        {job.hours || "Timing not specified"}
                      </p>

                      <p>
                        <span className="cp-meta-icon">⌖</span>
                        {job.location || "Location not specified"}
                      </p>

                      <p>
                        <span className="cp-meta-icon">₹</span>
                        {job.amount != null
                          ? `₹${job.amount} ${job.basis ? `/ ${job.basis}` : ""}`
                          : "Payment not specified"}
                      </p>

                      <p>
                        <span className="cp-meta-icon">◈</span>
                        {job.category || "Category not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="cp-match">
                    <h3>Candidate and job comparison</h3>

                    <ul className="cp-match-list">
                      <li>
                        <span className="cp-check">✓</span>
                        <span>
                          {matchedSkills.length} matching skills found
                        </span>
                      </li>

                      <li>
                        <span className="cp-check">✓</span>
                        <span>
                          Candidate availability:{" "}
                          {candidate.availability || "Not provided"}
                        </span>
                      </li>

                      <li>
                        <span className="cp-check">✓</span>
                        <span>
                          Candidate location:{" "}
                          {candidate.city || "Not provided"}
                        </span>
                      </li>

                      <li>
                        <span className="cp-check">✓</span>
                        <span>
                          Education:{" "}
                          {candidate.education || "Not provided"}
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="cp-match-summary">
                    <span className="cp-score">
                      {matchedSkills.length}/{skills.length}
                    </span>

                    <div>
                      <strong>Skills comparison</strong>
                      <p>
                        Based on the skills listed in the candidate and job
                        profiles
                      </p>
                    </div>
                  </div>

                  <p className="cp-disclaimer">
                    This comparison is indicative only. Review the candidate's
                    complete profile before making a final decision.
                  </p>
                </aside>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
