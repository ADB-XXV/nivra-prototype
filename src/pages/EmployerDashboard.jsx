"use client";

import React, { useState } from "react";
import "./PostJob";
import PostJob from "./PostJob";
import "../styles/EmployerDashboard.css";

const initialJobs = [
  {
    id: 1,
    title: "Event Assistant",
    date: "2026-10-24",
    workers: 5,
    filled: 1,
    applicants: 5,
    status: "Active",
    location: "Kozhikode",
    pay: 800,
    basis: "Per day",
  },
  {
    id: 2,
    title: "Stage Crew",
    date: "2026-10-25",
    workers: 3,
    filled: 0,
    applicants: 2,
    status: "Active",
    location: "Kozhikode",
    pay: 900,
    basis: "Per day",
  },
];

const applications = [
  { id: 1, name: "Anjali Nair", job: "Event Assistant", date: "16 Oct", status: "Under Review" },
  { id: 2, name: "Rohit Das", job: "Event Assistant", date: "17 Oct", status: "Applied" },
  { id: 3, name: "Fathima Shereen", job: "Event Assistant", date: "15 Oct", status: "Shortlisted" },
];

function formatDate(date) {
  if (!date) return "Not set";
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

export default function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [jobs, setJobs] = useState(initialJobs);
  const [notice, setNotice] = useState("");

  function navigate(tab) {
    setActiveTab(tab);
    setNotice("");
  }

  function handlePublish(job) {
    const newJob = {
      id: Date.now(),
      ...job,
      pay: Number(job.amount),
      filled: 0,
      applicants: 0,
      status: "Active",
    };

    setJobs((previous) => [...previous, newJob]);
    setActiveTab("Dashboard");
    setNotice("Your job has been published successfully!");
  }

  return (
    <div className="employer-page">
      <main className="employer-main">
        {notice && (
          <div className="notice" role="status">
            <span>{notice}</span>
            <button type="button" onClick={() => setNotice("")} aria-label="Dismiss message">×</button>
          </div>
        )}

        {activeTab === "Dashboard" && (
          <>
            <header className="dashboard-heading">
              <div>
                <h1>Malabar Events</h1>
                <p>Kozhikode · Sample employer</p>
              </div>
              <div className="heading-actions">
                <button className="button button-primary" onClick={() => navigate("Post a job")}>
                  Post a job
                </button>
                <button className="button button-secondary" onClick={() => navigate("Applicants")}>
                  Manage applicants
                </button>
              </div>
            </header>

            <div className="dashboard-grid">
              <section className="panel listings-panel">
                <h2>Active listings</h2>
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr><th>Job</th><th>Date</th><th>Filled</th><th>Applicants</th><th></th></tr>
                    </thead>
                    <tbody>
                      {jobs.map((job) => (
                        <tr key={job.id}>
                          <td>{job.title}</td>
                          <td>{new Date(`${job.date}T12:00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</td>
                          <td>{job.filled} of {job.workers}</td>
                          <td>{job.applicants}</td>
                          <td>
                            <button className="text-button" onClick={() => {
                              setNotice(`${job.title}: ${job.applicants} applicants`);
                              setActiveTab("Applicants");
                            }}>Review</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h2 className="section-heading">Recent applications</h2>
                <div className="application-list">
                  {applications.map((applicant) => (
                    <article className="application-row" key={applicant.id}>
                      <div className="applicant-info">
                        <strong>{applicant.name}</strong>
                        <p>{applicant.job} · {applicant.date}</p>
                      </div>
                      <span className={`status-pill status-${applicant.status.toLowerCase().replaceAll(" ", "-")}`}>
                        {applicant.status}
                      </span>
                      <button className="button button-small" onClick={() => {
                        setNotice(`${applicant.name} · ${applicant.status}`);
                        setActiveTab("Applicants");
                      }}>View</button>
                    </article>
                  ))}
                </div>
              </section>

              <aside className="side-panels">
                <section className="panel">
                  <h2>Upcoming staffing needs</h2>
                  <p><strong>Sat 24 Oct</strong> · 4 more event assistants</p>
                  <p><strong>Sun 25 Oct</strong> · 3 stage crew</p>
                  <p className="muted side-description">Need many workers fast?</p>
                  <button className="button button-small" onClick={() => navigate("Staffing")}>Request staffing help</button>
                </section>
                <section className="panel">
                  <h2>Premium matching</h2>
                  <p className="muted">Ranked candidates with match reasons.</p>
                  <button className="button button-small" onClick={() => navigate("Plans")}>View plans</button>
                </section>
              </aside>
            </div>
          </>
        )}

        {activeTab === "Post a job" && (
          <section className="form-page">
            <PostJob onSubmit={handlePublish} onCancel={() => navigate("Dashboard")} />
          </section>
        )}

        {activeTab === "Applicants" && (
          <section className="panel other-page">
            <h1>Manage applicants</h1>
            <p className="muted">Review applications for your job listings.</p>
            {applications.map((applicant) => (
              <article className="application-row" key={applicant.id}>
                <div className="applicant-info">
                  <strong>{applicant.name}</strong>
                  <p>{applicant.job} · {applicant.date}</p>
                </div>
                <span className={`status-pill status-${applicant.status.toLowerCase().replaceAll(" ", "-")}`}>{applicant.status}</span>
              </article>
            ))}
            <button className="button button-secondary" onClick={() => navigate("Dashboard")}>Back to dashboard</button>
          </section>
        )}

        {["Matching", "Staffing", "Plans", "Profile"].includes(activeTab) && (
          <section className="panel other-page">
            <h1>{activeTab}</h1>
            <p className="muted">This section is a prototype and is not connected to a backend yet.</p>
            <button className="button button-primary" onClick={() => navigate("Dashboard")}>Back to dashboard</button>
          </section>
        )}
      </main>

      <footer className="employer-footer">
        <strong>Nivra</strong> · Find work for a day. Build experience for tomorrow. Prototype with sample data; employers, jobs and students are fictional.
      </footer>
    </div>
  );
}