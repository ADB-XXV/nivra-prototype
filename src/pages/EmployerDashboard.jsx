"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import PostJob from "./PostJob";
import "../styles/EmployerDashboard.css";
import EmployerNavbar from "../components/EmployerNavbar";

function formatDate(date) {
  if (!date) return "Not set";
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

export default function EmployerDashboard({ initialTab = "Dashboard" }) {
  const [activeTab, setActiveTab] = useState(initialTab);
 const [jobs, setJobs] = useState([]);
const [jobsLoading, setJobsLoading] = useState(true);
  const [notice, setNotice] = useState("");
const [profile, setProfile] = useState(null);
const [profileLoading, setProfileLoading] = useState(true);
const [profileError] = useState("");
const [applications, setApplications] = useState([]);
const [applicationsLoading, setApplicationsLoading] = useState(true);
const [updatingApplication, setUpdatingApplication] = useState(null);
useEffect(() => {
  let active = true;

  async function loadProfile() {
    const { data: { user }, error: authError } =
      await supabase.auth.getUser();

    if (authError || !user) {
  setNotice("Your session has expired. Please log in again.");
  throw new Error("Your session has expired. Please log in again.");
}

    const { data, error } = await supabase
      .from("profiles")
      .select("business, full_name, city, role")
      .eq("id", user.id)
      .single();

    if (!active) return;

 if (error) {
  console.error("Error publishing job:", error);
  setNotice(`Could not publish job: ${error.message}`);
  throw error;
}
    if (data.role !== "employer") {
      window.location.replace("/student/dashboard");
      return;
    }

    setProfile(data);
setProfileLoading(false);

const { data: jobData, error: jobError } = await supabase
  .from("jobs")
  .select("*")
  .eq("employer_id", user.id)
  .eq("status", "Active")
  .order("created_at", { ascending: false });

if (!active) return;

if (jobError) {
  console.error("Error loading jobs:", jobError);
  setNotice("Could not load jobs. Please refresh the page.");
} else {
  setJobs(
    jobData.map((job) => ({
      ...job,
      pay: Number(job.amount),
      filled: 0,
      applicants: 0,
    }))
  );
}

setJobsLoading(false);

const employerJobs = jobData || [];
const jobIds = employerJobs.map((job) => job.id);

if (jobIds.length === 0) {
  setApplications([]);
  setApplicationsLoading(false);
} else {
  
const { data: applicationData, error: applicationError } =
  await supabase
    .from("applications")
    .select("id, job_id, student_id, status, applied_at")
    .in("job_id", jobIds)
    .order("applied_at", { ascending: false });

if (!active) return;

if (applicationError) {
  console.error("Error loading applications:", applicationError);
  setNotice("Could not load applications. Please refresh the page.");
} else {
  const studentIds = [
    ...new Set((applicationData || []).map((app) => app.student_id)),
  ];

  let profiles = [];

  if (studentIds.length > 0) {
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name, college")
      .in("id", studentIds);
      console.log("STUDENT IDS:", studentIds);
console.log("PROFILE DATA:", profileData);
console.log("PROFILE ERROR:", profileError);

    if (profileError) {
      console.error("Error loading student profiles:", profileError);
    } else {
      profiles = profileData || [];
    }
  }

  if (!active) return;

  const profileById = Object.fromEntries(
    profiles.map((profile) => [profile.id, profile])
  );
console.log("PROFILE LOOKUP:", profileById);
console.log("APPLICATION DATA:", applicationData);
  const jobNames = Object.fromEntries(
    employerJobs.map((job) => [job.id, job.title])
  );

  setApplications(
    (applicationData || []).map((app) => ({
      ...app,
      name: profileById[app.student_id]?.full_name || "Student",
      college: profileById[app.student_id]?.college || "",
      job: jobNames[app.job_id] || "Job",
      date: formatDate(app.applied_at?.slice(0, 10)),
    }))
  );

  setJobs((previous) =>
    previous.map((job) => ({
      ...job,
      applicants: (applicationData || []).filter(
        (app) => app.job_id === job.id
      ).length,
    }))
  );
}

setApplicationsLoading(false);
}

  }

  loadProfile();

  return () => {
    active = false;
  };
}, []);
  function navigate(tab) {
    setActiveTab(tab);
    setNotice("");
  }

 async function handlePublish(job) {
  setNotice("");

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    setNotice("Your session has expired. Please log in again.");
    return;
  }

  const { data, error } = await supabase
    .from("jobs")
    .insert({
      employer_id: user.id,
      title: job.title.trim(),
      category: job.category,
      workers: Number(job.workers),
      description: job.description.trim(),
      skills: job.skills || null,
      location: job.location.trim(),
      date: job.date,
      hours: job.hours || null,
      amount: Number(job.amount),
      basis: job.basis,
      status: "Active",
    })
    .select()
    .single();

  if (error) {
    console.error("Error publishing job:", error);
    setNotice("Could not publish job. Please try again.");
    return;
  }

  setJobs((previous) => [
    {
      ...data,
      pay: Number(data.amount),
      filled: 0,
      applicants: 0,
    },
    ...previous,
  ]);

  setActiveTab("Dashboard");
  setNotice("Your job has been published successfully!");
}

async function updateApplicationStatus(applicationId, status) {
  if (updatingApplication) return;

  setUpdatingApplication(applicationId);
  setNotice("");

  const { data, error } = await supabase
    .from("applications")
    .update({ status })
    .eq("id", applicationId)
    .select("id, status")
    .single();

  if (error) {
    console.error("Error updating application:", error);
    setNotice(`Could not update application: ${error.message}`);
  } else {
    setApplications((previous) =>
      previous.map((app) =>
        app.id === data.id
          ? { ...app, status: data.status }
          : app
      )
    );

    setNotice(`Application ${status.toLowerCase()} successfully.`);
  }

  setUpdatingApplication(null);
}

  return (
    <div className="employer-page">
      <EmployerNavbar active="/employer/dashboard" />
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
               <h1>
  {profileLoading
    ? "Loading dashboard..."
    : profile?.business || profile?.full_name || "Your business"}
</h1>
<p>
  {profileError ||
    [profile?.city, "Employer dashboard"]
      .filter(Boolean)
      .join(" · ")}
</p>
              </div>
              <div className="heading-actions">
                <button className="button button-primary" onClick={() => window.location.assign("/employer/post-job")}>
                  Post a job
                </button>
                <button className="button button-secondary" onClick={() => window.location.assign("/employer/applicants")}>
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
  {jobsLoading ? (
    <tr>
      <td colSpan={5}>Loading jobs...</td>
    </tr>
  ) : jobs.length === 0 ? (
    <tr>
      <td colSpan={5}>You have no active jobs yet.</td>
    </tr>
  ) : (
    jobs.map((job) => (
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
                           ))
  )}
</tbody>
                  </table>
                </div>

                <h2 className="section-heading">Recent applications</h2>
                
<div className="application-list">
  {applicationsLoading ? (
    <p>Loading applications...</p>
  ) : applications.length === 0 ? (
    <p>No applications received yet.</p>
  ) : (
    applications.slice(0, 5).map((applicant) => (
      <article className="application-row" key={applicant.id}>
        <div className="applicant-info">
          <strong>{applicant.name}</strong>
          <p>{applicant.job} · {applicant.date}</p>
        </div>

        <span className={`status-pill status-${applicant.status.toLowerCase()}`}>
          {applicant.status}
        </span>

        <button
          className="button button-small"
          onClick={() => window.location.assign(`/candidate-profile?id=${applicant.student_id || applicant.id}`)}
        >
          View
        </button>
      </article>
    ))
  )}
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
           <PostJob
  employerName={profile?.business || profile?.full_name || ""}
  onSubmit={handlePublish}
  onCancel={() => navigate("Dashboard")}
/>
          </section>
        )}

       
{activeTab === "Applicants" && (
  <section className="panel other-page">
    <h1>Manage applicants</h1>
    <p className="muted">
      Review applications for your job listings.
    </p>

    {applicationsLoading ? (
      <p>Loading applications...</p>
    ) : applications.length === 0 ? (
      <p>No applications received yet.</p>
    ) : (
      applications.map((applicant) => (
        <article className="application-row" key={applicant.id}>
          <div className="applicant-info">
            <strong>{applicant.name}</strong>
            <p>
              {applicant.job} · {applicant.date}
              {applicant.college ? ` · ${applicant.college}` : ""}
            </p>
          </div>

          <span className={`status-pill status-${applicant.status.toLowerCase()}`}>
            {applicant.status}
          </span>

          {applicant.status === "Pending" && (
            <>
              <button
                className="button button-small"
                disabled={updatingApplication !== null}
                onClick={() =>
                  updateApplicationStatus(applicant.id, "Accepted")
                }
              >
                {updatingApplication === applicant.id ? "Updating..." : "Accept"}
              </button>

              <button
                className="button button-small"
                disabled={updatingApplication !== null}
                onClick={() =>
                  updateApplicationStatus(applicant.id, "Rejected")
                }
              >
                Reject
              </button>
            </>
          )}
        </article>
      ))
    )}

    <button
      className="button button-secondary"
      onClick={() => navigate("Dashboard")}
    >
      Back to dashboard
    </button>
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
    </div>
  );
}