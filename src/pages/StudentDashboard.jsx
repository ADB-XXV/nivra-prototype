"use client";

import React, { useEffect, useMemo, useState } from "react";
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
.nv .bd.upcoming{background:var(--ln)}
.nv .bd.in-progress{background:var(--tl)}
.nv .bd.awaiting-verification{background:var(--tl)}
.nv .bd.payment-pending{background:var(--tl)}
.nv .bd.payment-completed{background:var(--sd);color:var(--bg)}
.nv .sd-empty{padding:18px 0;color:var(--mu)}
.nv .sd-label{margin:14px 0 0;font-size:.74rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--mu)}
.nv .sd-gig{border:1px solid var(--ln);border-radius:8px;padding:16px;margin-top:10px;display:flex;gap:16px;justify-content:space-between;align-items:flex-start;flex-wrap:wrap}
.nv .sd-gig h4{margin:0 0 2px;font-size:1rem}
.nv .sd-gig .m{flex:1;min-width:220px}
.nv .sd-side{display:flex;flex-direction:column;align-items:flex-end;gap:8px}
.nv .sd-side small{color:var(--mu);max-width:180px;text-align:right}
.nv .sd-line{font-size:.88rem;margin-top:4px}
.nv .sd-line.ok{color:var(--sd);font-weight:500}
.nv .sd-table{width:100%;border-collapse:collapse;font-size:.9rem}
.nv .sd-table th{text-align:left;font-size:.75rem;color:var(--mu);text-transform:uppercase;letter-spacing:.04em;padding:8px 6px;border-bottom:1px solid var(--ln)}
.nv .sd-table td{padding:10px 6px;border-bottom:1px solid var(--ln)}
.nv .sd-ov{position:fixed;inset:0;background:rgba(30,20,22,.5);display:grid;place-items:center;z-index:30;padding:16px}
.nv .sd-md{background:var(--sf);color:var(--tx);border-radius:10px;padding:24px;max-width:440px;width:100%}
.nv .sd-md h2{margin:0 0 8px}
.nv .sd-notice{margin:0 0 16px;padding:10px 14px;border-radius:8px;background:var(--sl);color:var(--sd);font-size:.9rem}
@media(max-width:760px){.nv .sd-grid{grid-template-columns:1fr}.nv .sd-stats{gap:24px}.nv .sd-side{align-items:flex-start}.nv .sd-side small{text-align:left}}
`;

const statusClass = (s) => (s || "").toLowerCase().replace(/\s+/g, "-");
const rupees = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

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

function formatLong(date) {
  if (!date) return "Date not set";

  return new Date(`${date.slice(0, 10)}T12:00:00`).toLocaleDateString(
    "en-IN",
    { day: "numeric", month: "long", year: "numeric" }
  );
}

function formatShort(date) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function gigState(g) {
  if (g.paidAt) return "Payment Completed";
  if (g.verifiedAt) return "Payment Pending";
  if (g.completedAt) return "Awaiting Verification";
  return g.started ? "In Progress" : "Upcoming";
}

export default function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [gigs, setGigs] = useState([]);
  const [activeCount, setActiveCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");

  const [confirming, setConfirming] = useState(null);
  const [busy, setBusy] = useState(false);
  const [modalError, setModalError] = useState("");
  const [notice, setNotice] = useState("");

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
          .select(
            "id, job_id, status, applied_at, completed_at, verified_at, paid_at"
          )
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

      // Load the student's own payment records.
      let paymentRows = [];

      if (applications.length > 0) {
        const { data, error } = await supabase
          .from("payments")
          .select("application_id, student_amount, status, paid_at")
          .eq("student_id", user.id)
          .in(
            "application_id",
            applications.map((application) => application.id)
          );

        if (!active) return;

        if (error) {
          console.error("Could not load student payments:", error);
          setDashboardError("Could not load your payment details.");
        } else {
          paymentRows = data || [];
        }
      }

      const paymentMap = Object.fromEntries(
        paymentRows.map((payment) => [payment.application_id, payment])
      );

      const jobIds = [
        ...new Set([
          ...applications.map((application) => application.job_id),
          ...savedJobs.map((item) => item.job_id),
        ]),
      ];

      if (jobIds.length === 0) {
        setGigs([]);
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

      const todayISO = new Date().toLocaleDateString("en-CA");

     const accepted = applications
  .filter((application) =>
    ["Accepted", "Completed"].includes(application.status)
  )
        .map((application) => {
          const job = jobMap[application.job_id];

          if (!job) return null;

          const payment = paymentMap[application.id];
          const dateISO = job.date ? job.date.slice(0, 10) : "";

          return {
            id: application.id,
            jobId: job.id,
            title: job.title || "Untitled job",
            employer: employerMap[job.employer_id] || "Employer",
            city: job.location || "Location not specified",
            dateISO,
            date: formatDate(job.date),
            dateLong: formatLong(job.date),
            hours: job.hours || "Timing not specified",
            pay: Number(job.amount) || 0,
            receivedAmount: Number(payment?.student_amount) || 0,
            expectedAmount:
              payment?.student_amount != null
                ? Number(payment.student_amount)
                : Math.round((Number(job.amount) || 0) * 0.97 * 100) / 100,
            paymentStatus:
              payment?.status || (application.paid_at ? "Paid" : null),
            basis: job.basis || "shift",
            started: Boolean(dateISO) && dateISO <= todayISO,
            completedAt: application.completed_at,
            verifiedAt: application.verified_at,
            paidAt:
              payment?.status === "Paid"
                ? payment.paid_at || application.paid_at
                : !payment
                  ? application.paid_at
                  : null,
          };
        })
        .filter(Boolean);

      if (active) {
        setGigs(accepted);
        setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!confirming) return;

    const onKey = (e) => e.key === "Escape" && !busy && setConfirming(null);

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [confirming, busy]);

  const todayISO = new Date().toLocaleDateString("en-CA");

  const activeGigs = useMemo(
    () =>
      gigs
        .filter((g) => !g.completedAt)
        .sort((a, b) =>
          (a.dateISO || "9999").localeCompare(b.dateISO || "9999")
        ),
    [gigs]
  );

  const completedGigs = useMemo(
    () =>
      gigs
        .filter((g) => g.completedAt)
        .sort((a, b) => b.completedAt.localeCompare(a.completedAt)),
    [gigs]
  );

  const upcoming = activeGigs.filter(
    (g) => g.dateISO && g.dateISO >= todayISO
  );

  const paidGigs = completedGigs
    .filter((g) => g.paidAt)
    .sort((a, b) => b.paidAt.localeCompare(a.paidAt));

  const totalEarnings = paidGigs.reduce(
    (sum, g) => sum + g.receivedAmount,
    0
  );

  const pendingEarnings = completedGigs
    .filter((g) => !g.paidAt)
    .reduce((sum, g) => sum + g.expectedAmount, 0);

  function openConfirm(gig) {
    setModalError("");
    setConfirming(gig);
  }

  async function confirmCompletion() {
    if (!confirming) return;

    setBusy(true);
    setModalError("");

    const { error } = await supabase.rpc("mark_gig_completed", {
      p_application_id: String(confirming.id),
    });

    if (error) {
      console.error(error);
      setModalError(error.message || "Could not mark this gig as completed.");
      setBusy(false);
      return;
    }

    const id = confirming.id;
    const title = confirming.title;

    setGigs((current) =>
      current.map((g) =>
        g.id === id ? { ...g, completedAt: new Date().toISOString() } : g
      )
    );

    setNotice(
      `${title} is marked as completed. Your employer has been asked to verify it.`
    );

    setConfirming(null);
    setBusy(false);
  }

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

        {notice && <p className="sd-notice" role="status">{notice}</p>}

        <div className="sd-grid">
          <div>
            <section className="box">
              <div className="row sp">
                <h3 style={{ margin: 0 }}>My Accepted Gigs</h3>
                <a className="sd-link" href="/applications">
                  Application history →
                </a>
              </div>

              <p className="sd-label">Upcoming / active gigs</p>

              {loading && <p className="sd-empty">Loading gigs...</p>}

              {!loading && activeGigs.length === 0 && (
                <p className="sd-empty">
                  No accepted gigs right now. When an employer accepts your
                  application, it will show up here.
                </p>
              )}

              {!loading && activeGigs.map((gig) => (
                <article className="sd-gig" key={gig.id}>
                  <div className="m">
                    <h4>{gig.title}</h4>
                    <div className="mu">{gig.employer} · {gig.city}</div>
                    <div className="mu" style={{ fontSize: ".88rem", marginTop: 2 }}>
                      {gig.dateLong} · {gig.hours}
                    </div>
                    <div style={{ marginTop: 6 }}>
                      <b>Earnings: {rupees(gig.pay)}</b>{" "}
                      <span className="mu">/{gig.basis}</span>
                    </div>
                  </div>

                  <div className="sd-side">
                    <span className={`bd ${statusClass(gigState(gig))}`}>
                      {gigState(gig)}
                    </span>
                    {gig.started ? (
                      <button className="btn sm" onClick={() => openConfirm(gig)}>
                        ✓ Mark as Completed
                      </button>
                    ) : (
                      <small>Available on the day of the gig</small>
                    )}
                  </div>
                </article>
              ))}
            </section>

            <section className="box" style={{ marginTop: 14 }}>
              <h3 style={{ margin: 0 }}>Completed Gigs</h3>

              {loading && <p className="sd-empty">Loading...</p>}

              {!loading && completedGigs.length === 0 && (
                <p className="sd-empty">
                  Gigs you mark as completed appear here until they are
                  verified and paid.
                </p>
              )}

              {!loading && completedGigs.map((gig) => (
                <article className="sd-gig" key={gig.id}>
                  <div className="m">
                    <h4>{gig.title}</h4>
                    <div className="mu">{gig.employer}</div>
                    <div className="mu" style={{ fontSize: ".88rem", marginTop: 2 }}>
                      {gig.dateLong} · {rupees(gig.pay)}
                    </div>

                    {gig.verifiedAt ? (
                      <div className="sd-line ok">✓ Job Verified</div>
                    ) : (
                      <div className="sd-line mu">
                        ◷ Employer verification is pending
                      </div>
                    )}

                    {gig.paidAt ? (
                      <>
                        <div className="sd-line ok">✓ Payment Completed</div>
                        <div className="sd-line">
                          Amount received: <b>{rupees(gig.receivedAmount)}</b>
                        </div>
                        <div className="sd-line mu">
                          Paid on: {formatShort(gig.paidAt)}
                        </div>
                      </>
                    ) : gig.verifiedAt ? (
                      <div className="sd-line">◷ Payment Pending</div>
                    ) : null}
                  </div>

                  <div className="sd-side">
                    <span className={`bd ${statusClass(gigState(gig))}`}>
                      {gigState(gig)}
                    </span>
                  </div>
                </article>
              ))}
            </section>

            <section className="box" style={{ marginTop: 14 }}>
              <h3 style={{ margin: 0 }}>My Earnings</h3>

              <div className="sd-stats" style={{ margin: "12px 0 14px" }}>
                <div>
                  <b>{loading ? "—" : rupees(totalEarnings)}</b>
                  <span className="mu">total earnings</span>
                </div>
                <div>
                  <b>{loading ? "—" : rupees(pendingEarnings)}</b>
                  <span className="mu">pending, not paid yet</span>
                </div>
              </div>

              {!loading && paidGigs.length === 0 && (
                <p className="sd-empty" style={{ paddingTop: 0 }}>
                  Paid gigs will be listed here.
                </p>
              )}

              {!loading && paidGigs.length > 0 && (
                <table className="sd-table">
                  <thead>
                    <tr>
                      <th>Gig</th>
                      <th>Amount received</th>
                      <th>Payment date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paidGigs.map((gig) => (
                      <tr key={gig.id}>
                        <td>{gig.title}</td>
                        <td>{rupees(gig.receivedAmount)}</td>
                        <td>{formatShort(gig.paidAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
          </div>

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
                <a className="sd-link" href="/saved">View all →</a>
              </div>

              <p className="mu" style={{ margin: "6px 0 0" }}>
                {savedCount} {savedCount === 1 ? "job" : "jobs"} saved for later.
              </p>
            </section>
          </aside>
        </div>
      </main>

      {confirming && (
        <div
          className="sd-ov"
          onClick={(e) =>
            e.target === e.currentTarget && !busy && setConfirming(null)
          }
        >
          <div
            className="sd-md"
            role="dialog"
            aria-modal="true"
            aria-labelledby="sd-confirm-title"
          >
            <h2 id="sd-confirm-title">Have you completed this gig?</h2>
            <p className="mu">
              {confirming.title} · {confirming.employer} · {confirming.dateLong}
            </p>
            <p>Please confirm that you have finished the assigned work.</p>

            {modalError && (
              <p role="alert" style={{ color: "var(--er)" }}>{modalError}</p>
            )}

            <div className="row" style={{ justifyContent: "flex-end", marginTop: 16 }}>
              <button
                className="btn s"
                disabled={busy}
                onClick={() => setConfirming(null)}
              >
                Cancel
              </button>
              <button
                className="btn"
                disabled={busy}
                onClick={confirmCompletion}
              >
                {busy ? "Saving..." : "Confirm Completion"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}