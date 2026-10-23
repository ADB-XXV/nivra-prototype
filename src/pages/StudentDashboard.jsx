"use client";

import React from "react";
import "../styles/StudentDashboard.css";

export default function StudentDashboard() {
  return (
    <div className="student-dashboard">

      {/* Welcome section */}
      <section className="dashboard-welcome">
        <div>
          <p className="welcome-label">STUDENT DASHBOARD</p>
          <h1>Welcome back, Anjali!</h1>
          <p>Here's what's happening with your job search.</p>
        </div>

        <div className="student-avatar">AN</div>
      </section>

      {/* Summary cards */}
      <section className="dashboard-stats">

        <div className="stat-card">
          <p>Active applications</p>
          <h2>3</h2>
          <span>Jobs you've applied for</span>
        </div>

        <div className="stat-card">
          <p>Upcoming jobs</p>
          <h2>1</h2>
          <span>Your next scheduled work</span>
        </div>

        <div className="stat-card">
          <p>Saved jobs</p>
          <h2>3</h2>
          <span>Jobs saved for later</span>
        </div>

      </section>

      {/* Main dashboard content */}
      <div className="dashboard-content">

        {/* Recent applications */}
        <section className="dashboard-card applications-card">
          <div className="section-heading">
            <div>
              <h2>Recent applications</h2>
              <p>Track the progress of your applications.</p>
            </div>

            <a href="/myapplications">View all</a>
          </div>

          <div className="application-item">
            <div className="job-icon">EA</div>

            <div className="job-details">
              <h3>Event Assistant</h3>
              <p>Campus Events · Kozhikode</p>
              <span>Applied recently</span>
            </div>

            <span className="status under-review">Under Review</span>
          </div>

          <div className="application-item">
            <div className="job-icon">CH</div>

            <div className="job-details">
              <h3>Catering Helper</h3>
              <p>Spice Route Caterers</p>
              <span>Applied recently</span>
            </div>

            <span className="status accepted">Accepted</span>
          </div>

          <div className="application-item">
            <div className="job-icon">EC</div>

            <div className="job-details">
              <h3>Campus Event Crew</h3>
              <p>College Events · Kozhikode</p>
              <span>Applied recently</span>
            </div>

            <span className="status shortlisted">Shortlisted</span>
          </div>
        </section>

        {/* Right side */}
        <div className="dashboard-sidebar">

          {/* Upcoming work */}
          <section className="dashboard-card upcoming-card">
            <h2>Upcoming work</h2>
            <p className="card-subtitle">Your next scheduled job.</p>

            <div className="upcoming-job">
              <span className="upcoming-label">UPCOMING SHIFT</span>

              <h3>Catering Helper</h3>
              <p>Spice Route Caterers</p>

              <div className="job-info">
                <span>📍 Kochi</span>
                <span>📅 Sun, 25 Oct</span>
                <span>🕒 11 AM – 4 PM</span>
              </div>

              <button className="view-job-button">
                View job details
              </button>
            </div>
          </section>

          {/* Saved jobs */}
          <section className="dashboard-card saved-jobs-card">
            <div className="section-heading">
              <h2>Saved jobs</h2>
              <a href="/savedjobs">View all</a>
            </div>

            <p>You have 3 jobs saved for later.</p>

            <a className="browse-jobs-link" href="/browsejobs">
              Browse more jobs →
            </a>
          </section>

        </div>
      </div>

      <footer className="dashboard-footer">
        Nivra · Find work for a day. Build experience for tomorrow.
      </footer>

    </div>
  );
}