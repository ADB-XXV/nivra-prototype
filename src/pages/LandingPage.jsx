
"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";
import logo from "../images/logo.png";

const CATEGORIES = [
  "Event assistance",
  "Catering",
  "Retail",
  "Tutoring",
  "Delivery",
  "Campus events",
  "Hospitality",
];

const STEPS = [
  [
    "For students",
    [
      "Create a profile with your skills and free days.",
      "Search jobs by date, pay and location.",
      "Apply with a short note and track the status.",
    ],
  ],
  [
    "For employers",
    [
      "Register your business.",
      "Post a job with date, hours and pay.",
      "Review applicants, then shortlist or accept.",
    ],
  ],
];

const formatDate = (date) => {
  if (!date) return "Date not specified";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

const payPeriod = (basis) => {
  if (!basis) return "/day";

  const value = basis.toLowerCase();

  if (value.includes("hour")) return "/hour";
  if (value.includes("month")) return "/month";
  if (value.includes("fixed")) return "";

  return "/day";
};

function JobRow({ job, onView, saved, onToggleSave }) {
  return (
    <div className="jr">
      <div className="m">
        <b>
          <a onClick={() => onView(job.id)}>{job.title}</a>
        </b>
        <div className="mu">
          {job.company} · {job.location}
        </div>
        <div className="mu" style={{ fontSize: ".85rem" }}>
          {job.dateLabel} · {job.time} · {job.type}
        </div>
      </div>

      <div className="pay">
        ₹{Number(job.pay || 0).toLocaleString("en-IN")}
        <small>{payPeriod(job.basis)}</small>
      </div>

      {onToggleSave && (
        <button
          className="btn s sm"
          onClick={() => onToggleSave(job.id)}
        >
          {saved ? "★ Saved" : "☆ Save"}
        </button>
      )}

      <button className="btn sm" onClick={() => onView(job.id)}>
        View
      </button>
    </div>
  );
}

// onNavigate(path) can be passed by a client-side router; otherwise it reloads the page.
export default function LandingPage({
  onNavigate = (p) => window.location.assign(p),
}) {
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadFeaturedJobs = async () => {
      setJobsLoading(true);
      setJobsError("");

      try {
        const { data: jobs, error: jobsError } = await supabase
          .from("jobs")
          .select(
            "id, title, category, location, date, hours, amount, basis, employer_id, created_at"
          )
          .eq("status", "Active")
          .order("created_at", { ascending: false })
          .limit(5);

        if (jobsError) throw jobsError;

        const jobList = jobs || [];

        if (jobList.length === 0) {
          if (!cancelled) {
            setFeaturedJobs([]);
            setJobsLoading(false);
          }
          return;
        }

        const employerIds = [
          ...new Set(
            jobList.map((job) => job.employer_id).filter(Boolean)
          ),
        ];

        let employers = [];

        if (employerIds.length > 0) {
          const { data, error } = await supabase
            .from("profiles")
            .select("id, business, full_name")
            .in("id", employerIds);

          if (error) {
            console.error("Could not load employer names:", error);
          } else {
            employers = data || [];
          }
        }

        const employerMap = Object.fromEntries(
          employers.map((employer) => [
            employer.id,
            employer.business || employer.full_name || "Employer",
          ])
        );

        const formattedJobs = jobList.map((job) => ({
          id: job.id,
          title: job.title,
          company: employerMap[job.employer_id] || "Employer",
          location: job.location || "Location not specified",
          dateLabel: formatDate(job.date),
          time: job.hours || "Hours not specified",
          type: job.basis || "One day",
          pay: Number(job.amount || 0),
          basis: job.basis,
        }));

        if (!cancelled) {
          setFeaturedJobs(formattedJobs);
          setJobsLoading(false);
        }
      } catch (error) {
        console.error("Could not load featured jobs:", error);

        if (!cancelled) {
          setJobsError("Could not load featured jobs. Please try again later.");
          setJobsLoading(false);
        }
      }
    };

    loadFeaturedJobs();

    return () => {
      cancelled = true;
    };
  }, []);

  const viewJob = (id) =>
    onNavigate(`/jobdetails/${id}?from=landing`);

  const toggleSave = () =>
    onNavigate("/login?mode=login");

  const search = (e) => {
    e.preventDefault();

    onNavigate(
      `/browsejobs?q=${encodeURIComponent(title)}&loc=${encodeURIComponent(city)}&from=landing`
    );
  };

  return (
    <div className="nv">
      <Navbar role="public" onNavigate={onNavigate} />

      <main>
        <section className="w hero">
          <div>
            <h1>Find work for a day. Build experience for tomorrow.</h1>

            <p className="mu" style={{ fontSize: "1.05rem" }}>
              Nivra lists one-day and short-term jobs near you: events,
              catering, retail, tutoring and more. Employers post a job
              and review applicants in one place.
            </p>

            <form
              className="box"
              style={{ padding: 14 }}
              onSubmit={search}
            >
              <div className="f2">
                <div>
                  <label htmlFor="hero-title" style={{ marginTop: 0 }}>
                    Job title
                  </label>
                  <input
                    id="hero-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Event Assistant"
                  />
                </div>

                <div>
                  <label htmlFor="hero-city" style={{ marginTop: 0 }}>
                    Location
                  </label>
                  <input
                    id="hero-city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Kozhikode"
                  />
                </div>
              </div>

              <div className="row" style={{ marginTop: 12 }}>
                <button type="submit" className="btn">
                  Search jobs
                </button>

                <button
                  type="button"
                  className="btn s"
                  onClick={() =>
                    onNavigate("/login?role=employer&mode=signup")
                  }
                >
                  Hire workers
                </button>

                <button
                  type="button"
                  className="btn g"
                  onClick={() => onNavigate("/browsejobs?from=landing")}
                >
                  Find jobs →
                </button>
              </div>
            </form>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              gap: 22,
              padding: "12px 0",
            }}
          >
            <img
              src={logo.src}
              alt="Nivra"
              style={{ height: 350, width: "auto", maxWidth: "100%" }}
            />

            <p
              style={{
                transform: "translateY(-55px)",
                margin: 0,
                fontSize: "1.4rem !important",
                fontWeight: 700,
                lineHeight: 1.35,
                letterSpacing: "-.01em",
                color: "#593c42",
              }}
            >
              Work When You Want,
              <br />
              <span style={{ color: "#A8B89A" }}>
                Earn When You Need.
              </span>
            </p>
          </div>
        </section>

        <section className="w">
          <h2>Browse by category</h2>

          {CATEGORIES.map((c) => (
            <button
              key={c}
              className="ch"
              onClick={() =>
                onNavigate(
                  `/browsejobs?category=${encodeURIComponent(c)}&from=landing`
                )
              }
            >
              {c}
            </button>
          ))}
        </section>

        <section className="w" style={{ marginTop: 28 }}>
          <h2>Featured jobs</h2>

          <div className="box" style={{ padding: "4px 20px" }}>
            {jobsLoading && (
              <p className="mu">Loading featured jobs...</p>
            )}

            {!jobsLoading && jobsError && (
              <p className="mu" role="alert">{jobsError}</p>
            )}

            {!jobsLoading &&
              !jobsError &&
              featuredJobs.length === 0 && (
                <p className="mu">
                  No active jobs available right now. Check back soon!
                </p>
              )}

            {!jobsLoading &&
              !jobsError &&
              featuredJobs.map((job) => (
                <JobRow
                  key={job.id}
                  job={job}
                  onView={viewJob}
                  saved={false}
                  onToggleSave={toggleSave}
                />
              ))}
          </div>
        </section>

        <section className="w" style={{ marginTop: 36 }}>
          <h2>How it works</h2>

          <div className="e2">
            {STEPS.map(([heading, steps]) => (
              <div className="box" key={heading}>
                <h3>{heading}</h3>

                {steps.map((s, i) => (
                  <div className="step" key={s}>
                    <b>{i + 1}</b>
                    {s}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section className="band">
          <div className="w row sp">
            <div style={{ maxWidth: 620 }}>
              <h2>Premium for employers</h2>
              <p>
                Advanced candidate filters, side-by-side comparison,
                matching insights and help with bulk hiring.
              </p>
            </div>

            <button
              className="btn"
              onClick={() => onNavigate("/SeePlans")}
            >
              See plans
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
