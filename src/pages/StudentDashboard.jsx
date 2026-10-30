
"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import StudentNavbar from "../components/StudentNavbar";

const css = `
.nv .sd-head{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap}
.nv .sd-head h1{font-size:1.8rem;margin:0 0 4px}
.nv .sd-stats{display:flex;gap:40px;flex-wrap:wrap;margin:20px 0 24px}
.nv .sd-stats b{display:block;font-size:1.8rem;line-height:1.2}
.nv .sd-grid{display:grid;grid-template-columns:1.6fr 1fr;gap:24px;align-items:start}
.nv .sd-link{color:var(--sd);font-weight:500;text-decoration:none}
.nv .sd-link:hover{text-decoration:underline}
.nv .bd{font-size:.76rem;font-weight:700;padding:2px 9px;border-radius:4px;white-space:nowrap;background:var(--ln)}
.nv .bd.under-review{background:var(--tl)}
.nv .bd.shortlisted{background:var(--sl);color:var(--sd)}
.nv .bd.accepted{background:var(--sd);color:var(--bg)}
.nv .bd.applied{background:var(--ln)}
.nv .bd.rejected{background:#f5dddd;color:#8b3030}
.nv .sd-empty{padding:18px 0;color:var(--mu)}
@media(max-width:760px){.nv .sd-grid{grid-template-columns:1fr}.nv .sd-stats{gap:24px}}
`;

const statusClass = (s) => (s || "").toLowerCase().replace(/\s+/g, "-");

function formatDate(date) {
  if (!date) return "Date not set";

  return new Date(`${date.slice(0, 10)}T12:00:00`).toLocaleDateString(
    "en-IN",
    {
      weekday: "short",
      day: "numeric",
      month: "short",
    }
  );
}

function formatAppliedDate(date) {
  if (!date) return "Unknown";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export default function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [recent, setRecent] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [activeCount, setActiveCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        window.location.replace("/login?mode=login");
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", user.id)
        .single();

      if (!active) return;

      if (profileError) {
        setDashboardError("Could not load your profile.");
        setLoading(false);
        return;
      }

      if (profileData.role !== "student") {
        window.location.replace("/employer/dashboard");
        return;
      }

      setProfile(profileData);

      const [applicationResult, savedResult] = await Promise.all([
        supabase
          .from("applications")
          .select("id, job_id, status, applied_at")
          .eq("student_id", user.id)
          .order("applied_at", { ascending: false }),

        supabase
          .from("saved_jobs")
          .select("job_id")
          .eq("student_id", user.id),
      ]);

      if (!active) return;

      if (applicationResult.error) {
        console.error(applicationResult.error);
        setDashboardError("Could not load your applications.");
      }

      if (savedResult.error) {
        console.error(savedResult.error);
        setDashboardError("Could not load your saved jobs.");
      }

      const applications = applicationResult.data || [];
      const savedJobs = savedResult.data || [];

      setActiveCount(
        applications.filter((application) =>
          ["Applied", "Under Review", "Shortlisted"].includes(
            application.status
          )
        ).length
      );

      setSavedCount(savedJobs.length);

      const jobIds = [
        ...new Set([
          ...applications.map((application) => application.job_id),
          ...savedJobs.map((item) => item.job_id),
        ]),
      ];

      if (jobIds.length === 0) {
        setRecent([]);
        setUpcoming([]);
        setLoading(false);
        return;
      }

      const { data: jobs, error: jobsError } = await supabase
        .from("jobs")
        .select("id, title, location, date, hours, amount, basis, employer_id")
        .in("id", jobIds);

      if (!active) return;

      if (jobsError) {
        console.error(jobsError);
        setDashboardError("Could not load job details.");
        setLoading(false);
        return;
      }

      const jobList = jobs || [];
      const employerIds = [
        ...new Set(jobList.map((job) => job.employer_id).filter(Boolean)),
      ];

      let employers = [];

      if (employerIds.length > 0) {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, business, full_name")
          .in("id", employerIds);

        if (!active) return;

        if (error) {
          console.error(error);
        } else {
          employers = data || [];
        }
      }

      const jobMap = Object.fromEntries(
        jobList.map((job) => [job.id, job])
      );

      const employerMap = Object.fromEntries(
        employers.map((employer) => [
          employer.id,
          employer.business || employer.full_name || "Employer",
        ])
      );

      const formattedRecent = applications
        .slice(0, 5)
        .map((application) => {
          const job = jobMap[application.job_id];

          if (!job) return null;

          return {
            id: application.id,
            title: job.title || "Untitled job",
            employer: employerMap[job.employer_id] || "Employer",
            city: job.location || "Location not specified",
            applied: formatAppliedDate(application.applied_at),
            status: application.status || "Applied",
          };
        })
        .filter(Boolean);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const formattedUpcoming = applications
        .filter((application) => application.status === "Accepted")
        .map((application) => {
          const job = jobMap[application.job_id];

          if (!job || !job.date) return null;

          const jobDate = new Date(`${job.date}T12:00:00`);

          if (jobDate < today) return null;

          return {
            id: application.id,
            jobId: job.id,
            title: job.title || "Untitled job",
            employer: employerMap[job.employer_id] || "Employer",
            city: job.location || "Location not specified",
            date: formatDate(job.date),
            hours: job.hours || "Timing not specified",
            pay: Number(job.amount) || 0,
            basis: job.basis || "shift",
          };
        })
        .filter(Boolean)
        .sort((a, b) => a.date.localeCompare(b.date));

      if (active) {
        setRecent(formattedRecent);
        setUpcoming(formattedUpcoming);
        setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="nv">
      <style>{css}</style>
      <StudentNavbar active="/student/dashboard" />

      <main className="w" style={{ padding: "28px 20px 8px" }}>
        <section className="sd-head">
          <div>
            <h1>
              {loading
                ? "Loading your dashboard..."
                : `Welcome back, ${profile?.full_name || "there"}`}
            </h1>

            {dashboardError && (
              <p role="alert" className="mu">{dashboardError}</p>
            )}

            <p className="mu" style={{ margin: 0 }}>
              Here’s what’s happening with your job search.
            </p>
          </div>

          <div className="row">
            <a className="btn" href="/browsejobs">Browse jobs</a>
            <a className="btn s" href="/studentprofile">Edit profile</a>
          </div>
        </section>

        <section className="sd-stats" aria-label="Summary">
          <div>
            <b>{loading ? "—" : activeCount}</b>
            <span className="mu">active applications</span>
          </div>

          <div>
            <b>{loading ? "—" : upcoming.length}</b>
            <span className="mu">upcoming jobs</span>
          </div>

          <div>
            <b>{loading ? "—" : savedCount}</b>
            <span className="mu">saved jobs</span>
          </div>
        </section>

        <div className="sd-grid">
          <section className="box">
            <div className="row sp">
              <h3 style={{ margin: 0 }}>Recently applied</h3>
              <a className="sd-link" href="/applications">
                Application history →
              </a>
            </div>

            {loading && <p className="sd-empty">Loading applications...</p>}

            {!loading && recent.length === 0 && (
              <p className="sd-empty">
               You haven&apos;t applied for any jobs yet.
              </p>
            )}

            {!loading && recent.map((application) => (
              <div className="jr" key={application.id}>
                <div className="m">
                  <b>{application.title}</b>
                  <div className="mu">
                    {application.employer} · {application.city}
                  </div>
                  <div className="mu" style={{ fontSize: ".85rem" }}>
                    Applied {application.applied}
                  </div>
                </div>

                <span className={`bd ${statusClass(application.status)}`}>
                  {application.status}
                </span>
              </div>
            ))}
          </section>

          <aside>
            <section className="box">
              <h3>Upcoming work</h3>

              {loading && <p className="mu">Loading...</p>}

              {!loading && upcoming.length === 0 && (
                <p className="mu">
                  No upcoming accepted jobs yet.
                </p>
              )}

              {!loading && upcoming.slice(0, 3).map((job) => (
                <div key={job.id} style={{ marginBottom: 16 }}>
                  <b>{job.title}</b>
                  <div className="mu">
                    {job.employer} · {job.city}
                  </div>
                  <div className="mu" style={{ margin: "4px 0 10px" }}>
                    {job.date} · {job.hours} · ₹{job.pay}/{job.basis}
                  </div>
                  <a className="btn s sm" href={`/jobdetails/${job.jobId}`}>
                    View job details
                  </a>
                </div>
              ))}
            </section>

            <section className="box" style={{ marginTop: 14 }}>
              <div className="row sp">
                <h3 style={{ margin: 0 }}>Saved jobs</h3>
                <a className="sd-link" href="/savedjobs">View all →</a>
              </div>

              <p className="mu" style={{ margin: "6px 0 0" }}>
                {savedCount} {savedCount === 1 ? "job" : "jobs"} saved for later.
              </p>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
