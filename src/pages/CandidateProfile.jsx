
"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";

export default function CandidateDetails() {
  const [status, setStatus] = useState("Under Review");

  function handleAction(action) {
    setStatus(action);
  }

  return (
    <div className="nv candidate-page">
      {/* eslint-disable-next-line react/no-unknown-property */}
      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .candidate-page {
          --bg: #faf5f0;
          --sf: #fff;
          --ln: #e7ddd3;
          --tx: #2d2124;
          --mu: #7b6b6e;
          --sd: #56694b;
          --tl: #f4e3e1;
          --sl: #e9efe3;
          --btn: #593c42;
          --btx: #fff;
          --er: #a23b3b;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #faf5f0;
          color: #302322;
          font-family: Arial, Helvetica, sans-serif;
          font-size: 12px;
        }

        .candidate-main {
          width: 100%;
          max-width: 754px;
          margin: 0 auto;
          padding: 20px 0 40px;
        }

        .back-link {
          display: block;
          padding: 0;
          margin: 0 0 8px;
          color: #8a706d;
          font-family: inherit;
          font-size: 12px;
          cursor: pointer;
          text-decoration: none;
        }

        .back-link:hover {
          color: #603f44;
        }

        .candidate-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .candidate-profile {
          display: flex;
          align-items: center;
          gap: 9px;
          min-width: 0;
        }

        .candidate-avatar {
          width: 41px;
          height: 41px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #603f44;
          color: white;
          border-radius: 7px;
          font-size: 16px;
          font-weight: 700;
        }

        .candidate-info h1 {
          margin: 0 0 3px;
          font-size: 21px;
          line-height: 1.15;
          font-weight: 700;
          color: #211918;
        }

        .candidate-info p {
          margin: 0;
          font-size: 12px;
          color: #806d69;
        }

        .candidate-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          flex-shrink: 0;
        }

        .candidate-status {
          display: inline-block;
          padding: 4px 7px;
          border-radius: 4px;
          background: #f1e1dc;
          color: #4e3537;
          font-size: 10px;
          font-weight: 700;
          white-space: nowrap;
        }

        .status-shortlisted {
          background: #e5ebdc;
          color: #536344;
        }

        .status-accepted {
          background: #dcebdc;
          color: #355c3b;
        }

        .status-rejected {
          background: #f5dedd;
          color: #a33d3d;
        }

        .candidate-btn {
          height: 25px;
          padding: 0 9px;
          border-radius: 6px;
          font-family: inherit;
          font-size: 11px;
          white-space: nowrap;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .shortlist-btn {
          color: #443331;
          background: transparent;
          border: 1px solid #eadfd8;
        }

        .shortlist-btn:hover {
          background: #f1e7e0;
        }

        .accept-btn {
          color: white;
          background: #603f44;
          border: 1px solid #603f44;
        }

        .accept-btn:hover {
          background: #4b3035;
        }

        .reject-btn {
          color: #c44c4c;
          background: transparent;
          border: 1px solid #d76b6b;
        }

        .reject-btn:hover {
          background: #fff0ef;
        }

        .candidate-content {
          display: grid;
          grid-template-columns: 452px 283px;
          gap: 17px;
          align-items: start;
        }

        .detail-card {
          min-width: 0;
          background: #fff;
          border: 1px solid #ebdfd8;
          border-radius: 7px;
          padding: 13px 14px;
        }

        .detail-card h2 {
          margin: 0 0 5px;
          color: #302322;
          font-size: 13px;
          font-weight: 700;
        }

        .detail-card h3 {
          margin: 7px 0 5px;
          color: #302322;
          font-size: 12px;
          font-weight: 700;
        }

        .detail-card p {
          margin: 0;
          line-height: 1.45;
          font-size: 12px;
        }

        .application-message {
          margin-bottom: 7px !important;
          line-height: 1.45 !important;
        }

        .skill-list {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin: 0 0 5px;
        }

        .skill-list span {
          padding: 3px 7px;
          border: 1px solid #eadfd8;
          border-radius: 4px;
          background: #fff;
          color: #443331;
          font-size: 11px;
          line-height: 1.2;
        }

        .requirements-card {
          padding: 13px 14px 22px;
        }

        .job-description {
          color: #88746f;
          line-height: 1.45 !important;
          margin-bottom: 8px !important;
        }

        .requirements-card .match-heading {
          margin-top: 8px;
          margin-bottom: 5px;
        }

        .match-list {
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .match-list li {
          position: relative;
          padding-left: 13px;
          margin-bottom: 2px;
          color: #5e7050;
          font-size: 12px;
          line-height: 1.3;
        }

        .match-list li::before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #73865f;
          font-weight: 700;
        }

        .disclaimer {
          margin-top: 9px !important;
          color: #88746f;
          font-size: 11px !important;
          line-height: 1.45 !important;
        }

        .candidate-footer {
          margin-top: auto;
          border-top: 1px solid #eae0d9;
          padding: 17px 20px;
        }

        .candidate-footer p {
          max-width: 754px;
          margin: 0 auto;
          color: #88746f;
          font-size: 11px;
          line-height: 1.7;
        }

        .candidate-footer strong {
          color: #725457;
        }

        @media (max-width: 800px) {
          .candidate-main {
            max-width: none;
            padding: 20px 16px 36px;
          }

          .candidate-content {
            grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
            gap: 12px;
          }

          .candidate-header {
            flex-wrap: wrap;
          }

          .candidate-actions {
            flex-wrap: wrap;
            justify-content: flex-start;
          }
        }

        @media (max-width: 560px) {
          .candidate-content {
            grid-template-columns: 1fr;
          }

          .candidate-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .candidate-actions {
            width: 100%;
            gap: 6px;
          }

          .candidate-info h1 {
            font-size: 19px;
          }

          .candidate-footer {
            padding: 16px;
          }
        }
      `}</style>

      <Navbar role="employer" active="/employer/applicants" />

      <main className="candidate-main">
        <a className="back-link" href="/employer/applicants">
          ← All applicants
        </a>

        <section className="candidate-header">
          <div className="candidate-profile">
            <div className="candidate-avatar">AN</div>

            <div className="candidate-info">
              <h1>Anjali Nair</h1>
              <p>St. Joseph’s College, Devagiri</p>
            </div>
          </div>

          <div className="candidate-actions">
            <span
              className={`candidate-status ${
                status === "Under Review"
                  ? ""
                  : `status-${status.toLowerCase()}`
              }`}
            >
              {status}
            </span>

            <button
              className="candidate-btn shortlist-btn"
              onClick={() => handleAction("Shortlisted")}
            >
              Shortlist
            </button>

            <button
              className="candidate-btn accept-btn"
              onClick={() => handleAction("Accepted")}
            >
              Accept
            </button>

            <button
              className="candidate-btn reject-btn"
              onClick={() => handleAction("Rejected")}
            >
              Reject
            </button>
          </div>
        </section>

        <section className="candidate-content">
          <article className="detail-card application-card">
            <h2>Application message</h2>

            <p className="application-message">
              “I volunteered at the registration desk for two
              college fests and can reach the venue by 8:30 am.”
            </p>

            <h3>Skills</h3>

            <div className="skill-list">
              <span>Registration desk</span>
              <span>Crowd handling</span>
              <span>Malayalam, English, Hindi</span>
            </div>

            <h3>Experience</h3>
            <p>2 college fests</p>

            <h3>Availability</h3>
            <p>Sat 24 Oct, full day</p>
          </article>

          <aside className="detail-card requirements-card">
            <h2>Job requirements</h2>

            <p className="job-description">
              Event Assistant · 24 Oct · 9 am – 5 pm ·
              Kozhikode
            </p>

            <h2 className="match-heading">
              Why this candidate may match
            </h2>

            <ul className="match-list">
              <li>4 of 5 required skills</li>
              <li>Free 9 am – 5 pm on 24 Oct</li>
              <li>Kozhikode, about 3 km away</li>
              <li>2 similar events</li>
            </ul>

            <p className="disclaimer">
              Indicative only. Check the profile before deciding.
            </p>
          </aside>
        </section>
      </main>

      <footer className="candidate-footer">
        <p>
          <strong>Nivra</strong> · Find work for a day. Build
          experience for tomorrow. Prototype with sample data;
          employers, jobs and students are fictional.
        </p>
      </footer>
    </div>
  );
}
