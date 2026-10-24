
"use client";

import React, { useState } from "react";
import "../styles/EmployerDashboard.css";

export default function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: "Event Assistant",
      category: "Event assistance",
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
      category: "Event assistance",
      date: "2026-10-25",
      workers: 3,
      filled: 0,
      applicants: 2,
      status: "Active",
      location: "Kozhikode",
      pay: 900,
      basis: "Per day",
    },
  ]);

  const [applications] = useState([
    {
      id: 1,
      name: "Anjali Nair",
      job: "Event Assistant",
      date: "16 Oct",
      status: "Under Review",
    },
    {
      id: 2,
      name: "Rohit Das",
      job: "Event Assistant",
      date: "17 Oct",
      status: "Applied",
    },
    {
      id: 3,
      name: "Fathima Shereen",
      job: "Event Assistant",
      date: "15 Oct",
      status: "Shortlisted",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState("");

  const [form, setForm] = useState({
    title: "Event Assistant",
    category: "Event assistance",
    workers: "5",
    description: "Welcome guests, help with setup and pack-down.",
    skills: "Communication, punctuality",
    location: "Kozhikode",
    date: "2026-10-24",
    hours: "9:00 am – 5:00 pm",
    pay: "800",
    basis: "Per day",
  });

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  function publishJob(event) {
    event.preventDefault();

    const workers = Number(form.workers);
    const pay = Number(form.pay);

    if (
      !form.title.trim() ||
      !form.location.trim() ||
      !form.date ||
      !Number.isInteger(workers) ||
      workers < 1 ||
      !Number.isFinite(pay) ||
      pay <= 0
    ) {
      setNotice("Please enter valid job details, workers and pay.");
      return;
    }

    const newJob = {
      id: Date.now(),
      ...form,
      workers,
      pay,
      filled: 0,
      applicants: 0,
      status: "Active",
    };

    setJobs((previous) => [...previous, newJob]);
    setShowForm(false);
    setActiveTab("Dashboard");
    setNotice("Your job has been published successfully!");

    setForm({
      title: "",
      category: "Event assistance",
      workers: "1",
      description: "",
      skills: "",
      location: "Kozhikode",
      date: "2026-10-24",
      hours: "9:00 am – 5:00 pm",
      pay: "800",
      basis: "Per day",
    });
  }

  function toggleJob(id) {
    setJobs((previous) =>
      previous.map((job) =>
        job.id === id
          ? {
              ...job,
              status: job.status === "Active" ? "Closed" : "Active",
            }
          : job
      )
    );
  }

  function navigate(tab) {
    setActiveTab(tab);
    setNotice("");
    setShowForm(tab === "Post a job");
  }

  return (
    <div className="employer-page">
      <main className="employer-main">
        {notice && (
          <div className="notice" role="status">
            {notice}
            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss message"
            >
              ×
            </button>
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
                <button
                  className="button button-primary"
                  onClick={() => navigate("Post a job")}
                >
                  Post a job
                </button>
                <button
                  className="button button-secondary"
                  onClick={() => navigate("Applicants")}
                >
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
                      <tr>
                        <th>Job</th>
                        <th>Date</th>
                        <th>Filled</th>
                        <th>Applicants</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map((job) => (
                        <tr key={job.id}>
                          <td>{job.title}</td>
                          <td>
                            {new Date(
                              `${job.date}T12:00:00`
                            ).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                            })}
                          </td>
                          <td>
                            {job.filled} of {job.workers}
                          </td>
                          <td>{job.applicants}</td>
                          <td>
                            <button
                              className="text-button"
                              onClick={() => {
                                setNotice(
                                  `${job.title}: ${job.applicants} applicants`
                                );
                                setActiveTab("Applicants");
                              }}
                            >
                              Review
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <h2 className="section-heading">
                  Recent applications
                </h2>

                <div className="application-list">
                  {applications.map((applicant) => (
                    <article
                      className="application-row"
                      key={applicant.id}
                    >
                      <div className="applicant-info">
                        <strong>{applicant.name}</strong>
                        <p>
                          {applicant.job} · {applicant.date} Oct
                        </p>
                      </div>

                      <span
                        className={`status-pill status-${applicant.status
                          .toLowerCase()
                          .replaceAll(" ", "-")}`}
                      >
                        {applicant.status}
                      </span>

                      <button
                        className="button button-small"
                        onClick={() => {
                          setNotice(
                            `${applicant.name} · ${applicant.status}`
                          );
                          setActiveTab("Applicants");
                        }}
                      >
                        View
                      </button>
                    </article>
                  ))}
                </div>
              </section>

              <aside className="side-panels">
                <section className="panel">
                  <h2>Upcoming staffing needs</h2>
                  <p>
                    <strong>Sat 24 Oct</strong> · 4 more event assistants
                  </p>
                  <p>
                    <strong>Sun 25 Oct</strong> · 3 stage crew
                  </p>
                  <p className="muted side-description">
                    Need many workers fast?
                  </p>
                  <button
                    className="button button-small"
                    onClick={() => navigate("Staffing")}
                  >
                    Request staffing help
                  </button>
                </section>

                <section className="panel">
                  <h2>Premium matching</h2>
                  <p className="muted">
                    Ranked candidates with match reasons.
                  </p>
                  <button
                    className="button button-small"
                    onClick={() => navigate("Plans")}
                  >
                    View plans
                  </button>
                </section>
              </aside>
            </div>
          </>
        )}

        {activeTab === "Post a job" && (
          <section className="form-page">
            <div className="dashboard-heading">
              <h1>Post a job</h1>
              <button
                className="button button-secondary"
                type="button"
                onClick={() => navigate("Dashboard")}
              >
                Back to dashboard
              </button>
            </div>

            <form onSubmit={publishJob}>
              <section className="panel form-section">
                <h2>1. Job basics</h2>

                <label>
                  Job title
                  <input
                    name="title"
                    value={form.title}
                    onChange={updateForm}
                    placeholder="e.g. Event Assistant"
                    required
                  />
                </label>

                <div className="form-row">
                  <label>
                    Category
                    <select
                      name="category"
                      value={form.category}
                      onChange={updateForm}
                    >
                      <option>Event assistance</option>
                      <option>Hospitality</option>
                      <option>Retail</option>
                      <option>Technology</option>
                      <option>Marketing</option>
                      <option>Other</option>
                    </select>
                  </label>

                  <label>
                    Workers needed
                    <input
                      name="workers"
                      type="number"
                      min="1"
                      value={form.workers}
                      onChange={updateForm}
                      required
                    />
                  </label>
                </div>

                <label>
                  Description and responsibilities
                  <textarea
                    name="description"
                    rows="4"
                    value={form.description}
                    onChange={updateForm}
                    required
                  />
                </label>

                <label>
                  Required skills
                  <input
                    name="skills"
                    value={form.skills}
                    onChange={updateForm}
                    placeholder="Separate skills with commas"
                  />
                  <small>Separate with commas</small>
                </label>
              </section>

              <section className="panel form-section">
                <h2>2. Where and when</h2>

                <label>
                  Work location
                  <input
                    name="location"
                    value={form.location}
                    onChange={updateForm}
                    required
                  />
                </label>

                <div className="form-row">
                  <label>
                    Date
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={updateForm}
                      required
                    />
                  </label>

                  <label>
                    Working hours
                    <input
                      name="hours"
                      value={form.hours}
                      onChange={updateForm}
                      required
                    />
                  </label>
                </div>
              </section>

              <section className="panel form-section">
                <h2>3. Pay</h2>

                <div className="form-row">
                  <label>
                    Amount (₹)
                    <input
                      type="number"
                      name="pay"
                      min="1"
                      value={form.pay}
                      onChange={updateForm}
                      required
                    />
                  </label>

                  <label>
                    Payment basis
                    <select
                      name="basis"
                      value={form.basis}
                      onChange={updateForm}
                    >
                      <option>Per day</option>
                      <option>Per hour</option>
                      <option>Fixed payment</option>
                    </select>
                  </label>
                </div>
              </section>

              <div className="form-actions">
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() =>
                    setNotice(
                      `Preview: ${form.title || "Untitled job"} · ₹${form.pay} ${form.basis}`
                    )
                  }
                >
                  Preview
                </button>

                <button
                  type="submit"
                  className="button button-primary"
                >
                  Publish job
                </button>
              </div>
            </form>
          </section>
        )}

        {activeTab === "Applicants" && (
          <section className="panel other-page">
            <h1>Manage applicants</h1>
            <p className="muted">
              Review applications for your job listings.
            </p>

            {applications.map((applicant) => (
              <article
                className="application-row"
                key={applicant.id}
              >
                <div className="applicant-info">
                  <strong>{applicant.name}</strong>
                  <p>
                    {applicant.job} · {applicant.date} Oct
                  </p>
                </div>
                <span className="status-pill">
                  {applicant.status}
                </span>
              </article>
            ))}
          </section>
        )}

        {["Matching", "Staffing", "Plans", "Profile"].includes(
          activeTab
        ) && (
          <section className="panel other-page">
            <h1>{activeTab}</h1>
            <p className="muted">
              This section is a prototype and is not connected to a
              backend yet.
            </p>
            <button
              className="button button-primary"
              onClick={() => navigate("Dashboard")}
            >
              Back to dashboard
            </button>
          </section>
        )}
      </main>

      <footer className="employer-footer">
        <strong>Nivra</strong> · Find work for a day. Build experience
        for tomorrow. Prototype with sample data; employers, jobs and
        students are fictional.
      </footer>
    </div>
  );
}