"use client";

import { useEffect, useState } from "react";
import StudentNavbar from "../components/StudentNavbar";
import { supabase } from "../lib/supabase";

const FILTERS = [
  "All",
  "Applied",
  "Under Review",
  "Shortlisted",
  "Accepted",
  "Rejected",
  "Completed",
];

const WITHDRAWABLE = ["Applied", "Under Review"];

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
  --danger: #a33a3a;
  min-height: 100vh;
  background: var(--bg);
  color: var(--ink);
  font-family: "DejaVu Sans", "Segoe UI", system-ui, -apple-system, Roboto, sans-serif;
  font-size: 15px;
  box-sizing: border-box;
}
.nv-root *, .nv-root *::before, .nv-root *::after { box-sizing: inherit; }
.nv-root button { font-family: inherit; cursor: pointer; }

.nv-header { background: var(--surface); border-bottom: 1px solid var(--line); }
.nv-header-inner {
  max-width: 1160px; margin: 0 auto; padding: 10px 24px;
  display: flex; align-items: center; gap: 8px;
}
.nv-logo { font-size: 20px; font-weight: 700; margin-right: 18px; letter-spacing: 0.2px; }
.nv-logo-dot {
  display: inline-block; width: 8px; height: 8px; border-radius: 50%;
  background: var(--rose); margin-left: 2px;
}
.nv-nav { display: flex; gap: 4px; flex: 1; flex-wrap: wrap; }
.nv-nav a {
  padding: 8px 10px; border-radius: 6px; color: var(--muted);
  text-decoration: none; font-size: 16px;
}
.nv-nav a:hover { color: var(--ink); }
.nv-nav a.active { background: var(--rose-soft); color: var(--ink); }
.nv-right { display: flex; align-items: center; gap: 30px; }
.nv-role {
  background: #e7efe0; color: #3f5a35; font-weight: 700; font-size: 12.5px;
  padding: 5px 11px; border-radius: 6px;
}
.nv-logout { color: var(--muted); text-decoration: none; font-size: 15px; }

.nv-main { max-width: 1160px; margin: 0 auto; padding: 28px 24px 40px; }
.nv-title { font-size: 24px; font-weight: 700; margin: 0 0 10px; }

.nv-filters { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
.nv-chip {
  background: var(--surface); border: 1px solid var(--line); color: var(--ink);
  padding: 5px 11px; border-radius: 6px; font-size: 14px;
}
.nv-chip:hover { border-color: var(--rose); }
.nv-chip.active { background: var(--rose-soft); border-color: var(--rose); }
.nv-chip:focus-visible, .nv-btn:focus-visible { outline: 2px solid var(--brand); outline-offset: 2px; }

.nv-card {
  background: var(--surface); border: 1px solid var(--line);
  border-radius: 10px; padding: 0 20px;
}
.nv-row {
  display: flex; align-items: center; justify-content: space-between;
  gap: 16px; padding: 14px 0; border-bottom: 1px solid var(--line);
}
.nv-row:last-child { border-bottom: none; }
.nv-info { min-width: 0; }
.nv-job-title { font-weight: 700; font-size: 16px; margin: 0 0 3px; }
.nv-job-sub { color: var(--muted); font-size: 16px; margin: 0 0 3px; }
.nv-job-meta { color: var(--muted); font-size: 13.5px; margin: 0; }

.nv-side { display: flex; align-items: center; gap: 14px; flex-shrink: 0; }
.nv-pay { font-weight: 700; font-size: 16px; }
.nv-pay small { font-weight: 400; color: var(--muted); font-size: 13.5px; }
.nv-applied { color: var(--muted); font-size: 14.5px; }

.nv-badge {
  font-size: 12.5px; font-weight: 700; padding: 4px 11px; border-radius: 4px;
  border: 1px solid transparent; white-space: nowrap;
}
.nv-badge.under-review { background: var(--rose-soft); color: var(--ink); }
.nv-badge.accepted { background: #4f6143; color: #fff; }
.nv-badge.shortlisted { background: #e7efe0; color: #3f5a35; }
.nv-badge.applied { background: #e8ddd3; color: #5a4a3e; }
.nv-badge.completed { background: transparent; color: #5a4a3e; border: 1px dashed #5a4a3e; }
.nv-badge.rejected { background: transparent; color: var(--danger); border-color: var(--danger); }

.nv-btn {
  background: var(--surface); border: 1px solid var(--line); color: var(--ink);
  padding: 8px 12px; border-radius: 6px; font-size: 14.5px;
}
.nv-btn:hover { background: #faf6f3; }
.nv-btn.danger { color: var(--danger); border-color: var(--danger); }
.nv-btn.danger:hover { background: #fbeeee; }
.nv-btn:disabled { opacity: 0.5; cursor: wait; }
.nv-slot { display: inline-block; min-width: 84px; }

.nv-empty { padding: 36px 0; text-align: center; color: var(--muted); }

.nv-footer p {
  max-width: 1160px; margin: 0 auto; padding: 22px 24px;
  color: var(--muted); font-size: 14px;
}
.nv-footer strong { color: var(--ink); }

@media (max-width: 820px) {
  .nv-row { flex-direction: column; align-items: flex-start; }
  .nv-side { flex-wrap: wrap; }
  .nv-right { gap: 14px; }
  .nv-header-inner { flex-wrap: wrap; }
}
`;

const slug = (s) => s.toLowerCase().replace(/\s+/g, "-");

function formatDate(date) {
  if (!date) return "Date not set";

  return new Date(`${date.slice(0, 10)}T12:00:00`).toLocaleDateString(
    "en-GB",
    {
      weekday: "short",
      day: "2-digit",
      month: "short",
    }
  );
}

function formatAppliedDate(date) {
  if (!date) return "Unknown";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

export default function MyApplications({
  onNavigate = (path) => window.location.assign(path),
}) {
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;

    async function loadApplications() {
      setLoading(true);
      setNotice("");

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        if (active) {
          setNotice("Please log in to view your applications.");
          setLoading(false);
        }
        return;
      }

      const { data: applicationData, error: applicationError } =
        await supabase
          .from("applications")
          .select("id, job_id, status, applied_at")
          .eq("student_id", user.id)
          .order("applied_at", { ascending: false });

      if (!active) return;

      if (applicationError) {
        console.error("Could not load applications:", applicationError);
        setNotice("Could not load your applications. Please refresh.");
        setLoading(false);
        return;
      }

      if (!applicationData || applicationData.length === 0) {
        setApplications([]);
        setLoading(false);
        return;
      }

      const jobIds = [
        ...new Set(applicationData.map((application) => application.job_id)),
      ];

      const { data: jobData, error: jobError } = await supabase
        .from("jobs")
        .select("*")
        .in("id", jobIds);

      if (!active) return;

      if (jobError) {
        console.error("Could not load application jobs:", jobError);
        setNotice("Could not load job details. Please refresh.");
        setLoading(false);
        return;
      }

      const jobs = jobData || [];
      const employerIds = [
        ...new Set(jobs.map((job) => job.employer_id).filter(Boolean)),
      ];

      let profiles = [];

      if (employerIds.length > 0) {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id, business, full_name")
          .in("id", employerIds);

        if (!active) return;

        if (profileError) {
          console.error("Could not load employer profiles:", profileError);
        } else {
          profiles = profileData || [];
        }
      }

      const jobById = Object.fromEntries(
        jobs.map((job) => [job.id, job])
      );

      const profileById = Object.fromEntries(
        profiles.map((profile) => [profile.id, profile])
      );

      const formattedApplications = applicationData
        .map((application) => {
          const job = jobById[application.job_id];

          if (!job) return null;

          const employer = profileById[job.employer_id];

          return {
            id: application.id,
            jobId: job.id,
            title: job.title || "Untitled job",
            company:
              employer?.business ||
              employer?.full_name ||
              "Employer",
            city: job.location || "Location not specified",
            schedule: `${formatDate(job.date)} · ${
              job.hours || "Timing not specified"
            }`,
            pay: Number(job.amount) || 0,
            basis: job.basis || "shift",
            applied: formatAppliedDate(application.applied_at),
            status: application.status || "Applied",
          };
        })
        .filter(Boolean);

      if (active) {
        setApplications(formattedApplications);
        setLoading(false);
      }
    }

    loadApplications();

    return () => {
      active = false;
    };
  }, []);

  const countFor = (f) =>
    f === "All"
      ? applications.length
      : applications.filter((a) => a.status === f).length;

  const visible =
    filter === "All"
      ? applications
      : applications.filter((a) => a.status === filter);

  async function withdraw(id) {
    if (withdrawing) return;

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      setNotice("Your session has expired. Please log in again.");
      return;
    }

    setWithdrawing(id);
    setNotice("");

    const { data: deletedApplication, error } = await supabase
  .from("applications")
  .delete()
  .eq("id", id)
  .eq("student_id", user.id)
  .select("id")
  .maybeSingle();

if (error || !deletedApplication) {
  console.error("Could not withdraw application:", error);
  setNotice(
    error
      ? `Could not withdraw application: ${error.message}`
      : "This application could not be withdrawn. Its status may have changed."
  );
} else {
  setApplications((list) => list.filter((a) => a.id !== id));
  setNotice("Application withdrawn successfully.");
}

    setWithdrawing(null);
  }

  return (
    <div className="nv-root">
      <style>{CSS}</style>

      <StudentNavbar active="/applications" />

      <main className="nv-main">
        <h1 className="nv-title">My applications</h1>

        <div className="nv-filters" role="group" aria-label="Filter by status">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className={`nv-chip${filter === f ? " active" : ""}`}
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f} {countFor(f)}
            </button>
          ))}
        </div>

        {notice && (
          <p role="status" style={{ color: "#67464a", margin: "12px 0" }}>
            {notice}
          </p>
        )}

        <section className="nv-card">
          {loading && (
            <div className="nv-empty">Loading your applications...</div>
          )}

          {!loading && visible.length === 0 && (
            <div className="nv-empty">
              {applications.length === 0
                ? "You haven't applied for any jobs yet."
                : "No applications with this status yet."}
            </div>
          )}

          {!loading &&
            visible.map((a) => (
              <article className="nv-row" key={a.id}>
                <div className="nv-info">
                  <h2 className="nv-job-title">{a.title}</h2>
                  <p className="nv-job-sub">
                    {a.company} · {a.city}
                  </p>
                  <p className="nv-job-meta">{a.schedule}</p>
                </div>

                <div className="nv-side">
                  <span className="nv-pay">
                    ₹{a.pay}
                    <small>/{a.basis}</small>
                  </span>
                  <span className="nv-applied">Applied {a.applied}</span>
                  <span className={`nv-badge ${slug(a.status)}`}>
                    {a.status}
                  </span>
                  <button
                    type="button"
                    className="nv-btn"
                    onClick={() =>
                      onNavigate(
                        `/jobdetails/${a.jobId}?returnTo=applications`
                      )
                    }
                  >
                    View job
                  </button>

                  {WITHDRAWABLE.includes(a.status) && (
                    <button
                      type="button"
                      className="nv-btn danger"
                      disabled={withdrawing === a.id}
                      onClick={() => withdraw(a.id)}
                    >
                      {withdrawing === a.id ? "Withdrawing..." : "Withdraw"}
                    </button>
                  )}
                </div>
              </article>
            ))}
        </section>
      </main>
    </div>
  );
}