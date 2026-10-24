
"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";

export default function Applicants() {
  const [applicants, setApplicants] = useState([
    {
      name: "Anjali Nair",
      skills: "Registration desk, Crowd handling",
      availability: "Sat 24 Oct, full day",
      experience: "2 college fests",
      applied: "16 Oct",
      status: "Under Review",
    },
    {
      name: "Rohit Das",
      skills: "Stage setup, Sound basics",
      availability: "Sat 24 Oct, full day",
      experience: "1 wedding crew job",
      applied: "17 Oct",
      status: "Applied",
    },
    {
      name: "Fathima Shereen",
      skills: "Guest welcome, Billing",
      availability: "Sat 24 Oct, 9 am - 3 pm",
      experience: "Retail intern, 2 months",
      applied: "15 Oct",
      status: "Shortlisted",
    },
    {
      name: "Arjun Menon",
      skills: "Event support, Photography",
      availability: "Sat 24 Oct, full day",
      experience: "3 events",
      applied: "18 Oct",
      status: "Applied",
    },
    {
      name: "Neha Pillai",
      skills: "Registration desk, Hindi, English",
      availability: "Sat 24 Oct, from 1 pm",
      experience: "1 college fest",
      applied: "14 Oct",
      status: "Applied",
    },
  ]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  function updateStatus(name, status) {
    setApplicants((previous) =>
      previous.map((applicant) =>
        applicant.name === name
          ? { ...applicant, status }
          : applicant
      )
    );
  }

  const filteredApplicants = applicants.filter((applicant) => {
    const matchesSearch = applicant.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || applicant.status === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="nv applicants-page">
      {/* eslint-disable-next-line react/no-unknown-property */}
      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .applicants-page {
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

        .applicants-main {
          width: 100%;
          max-width: 750px;
          margin: 0 auto;
          padding: 20px 0 29px;
        }

        .page-heading h1 {
          font-size: 17px;
          font-weight: 700;
          margin: 0 0 6px;
          color: #302322;
        }

        .page-heading p {
          margin: 0;
          color: #826e6a;
          font-size: 11.5px;
          line-height: 1.5;
        }

        .applicant-controls {
          display: flex;
          gap: 9px;
          margin-top: 9px;
          margin-bottom: 9px;
        }

        .applicant-controls input,
        .applicant-controls select {
          height: 31px;
          padding: 0 9px;
          border: 1px solid #eadfd8;
          border-radius: 5px;
          background: #fff;
          color: #342725;
          font-family: inherit;
          font-size: 12px;
          outline: none;
        }

        .applicant-controls input {
          width: 188px;
        }

        .applicant-controls select {
          width: 130px;
          cursor: pointer;
        }

        .applicant-controls input:focus,
        .applicant-controls select:focus {
          border-color: #765056;
          box-shadow: 0 0 0 2px rgba(100, 61, 67, 0.08);
        }

        .applicant-controls input::placeholder {
          color: #8a7b77;
        }

        .applicants-table-card {
          width: 100%;
          padding: 3px 8px 4px;
          background: #fff;
          border: 1px solid #ebdfd8;
          border-radius: 6px;
          overflow: hidden;
        }

        .table-scroll {
          width: 100%;
          overflow-x: auto;
        }

        .applicants-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          text-align: left;
        }

        .applicants-table th {
          color: #806965;
          font-size: 9.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.35px;
          padding: 9px 5px 8px;
          border-bottom: 1px solid #eadfd8;
          white-space: nowrap;
        }

        .applicants-table td {
          padding: 7px 5px;
          font-size: 11.5px;
          line-height: 1.45;
          vertical-align: top;
          border-bottom: 1px solid #eee4de;
          overflow-wrap: break-word;
        }

        .applicants-table th:nth-child(1) { width: 12%; }
        .applicants-table th:nth-child(2) { width: 16%; }
        .applicants-table th:nth-child(3) { width: 14%; }
        .applicants-table th:nth-child(4) { width: 13%; }
        .applicants-table th:nth-child(5) { width: 8%; }
        .applicants-table th:nth-child(6) { width: 12%; }
        .applicants-table th:nth-child(7) { width: 25%; }

        .candidate-name {
          font-weight: 700;
          color: #302322;
        }

        .candidate-link {
          color: inherit;
          text-decoration: none;
        }

        .candidate-link:hover {
          text-decoration: underline;
        }

        .status-badge {
          display: inline-block;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 10px;
          font-weight: 700;
          line-height: 1.1;
          white-space: nowrap;
        }

        .status-under-review {
          background: #f2e1dc;
          color: #51383a;
        }

        .status-applied {
          background: #e9ddd1;
          color: #59433b;
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

        .action-buttons {
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
        }

        .action-buttons button {
          min-height: 24px;
          padding: 4px 7px;
          border-radius: 5px;
          font-family: inherit;
          font-size: 10.5px;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .btn-shortlist {
          background: #fff;
          color: #443331;
          border: 1px solid #eadfd8;
        }

        .btn-shortlist:hover {
          background: #f6eee9;
        }

        .btn-accept {
          background: #603f44;
          color: #fff;
          border: 1px solid #603f44;
        }

        .btn-accept:hover {
          background: #4b3035;
        }

        .btn-reject {
          background: #fff;
          color: #c44c4c;
          border: 1px solid #d76b6b;
        }

        .btn-reject:hover {
          background: #fff0ef;
        }

        .empty-message {
          text-align: center;
          padding: 22px !important;
          color: #826e6a;
        }

        .applicants-footer {
          border-top: 1px solid #eae0d9;
          padding: 17px 20px;
          margin-top: 0;
          flex: 1;
        }

        .applicants-footer p {
          max-width: 750px;
          margin: 0 auto;
          color: #88746f;
          font-size: 11px;
          line-height: 1.7;
        }

        .applicants-footer strong {
          color: #725457;
        }

        @media (max-width: 800px) {
          .applicants-main {
            max-width: none;
            padding: 20px 16px 28px;
          }

          .table-scroll {
            overflow-x: visible;
          }

          .applicants-table,
          .applicants-table tbody {
            display: block;
            min-width: 0;
          }

          .applicants-table thead {
            display: none;
          }

          .applicants-table tr {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            padding: 7px 0;
            border-bottom: 1px solid #eee4de;
          }

          .applicants-table td {
            display: flex;
            flex-direction: column;
            border: 0;
            padding: 5px;
            min-width: 0;
          }

          .applicants-table td::before {
            content: attr(data-label);
            margin-bottom: 2px;
            color: #806965;
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 0.25px;
            text-transform: uppercase;
          }

          .applicants-table td:first-child,
          .applicants-table td:last-child {
            grid-column: 1 / -1;
          }

          .applicants-table td:first-child::before,
          .applicants-table td:last-child::before {
            content: none;
          }

          .action-buttons {
            flex-wrap: wrap;
          }

          .applicants-footer p {
            max-width: none;
          }
        }

        @media (max-width: 420px) {
          .applicant-controls input {
            flex: 1;
            min-width: 0;
          }

          .applicant-controls select {
            width: 120px;
          }

          .applicants-main {
            padding-left: 12px;
            padding-right: 12px;
          }
        }
      `}</style>

      <Navbar role="employer" active="/employer/applicants" />

      <main className="applicants-main">
        <section className="page-heading">
          <h1>Applicants</h1>
          <p>
            Event Assistant · Kozhikode · Sat 24 Oct · 1 of 5 filled
          </p>
        </section>

        <section className="applicant-controls">
          <input
            type="text"
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search applicants by name"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label="Filter applicants by status"
          >
            <option value="All">All</option>
            <option value="Applied">Applied</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </section>

        <section className="applicants-table-card">
          <div className="table-scroll">
            <table className="applicants-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Skills</th>
                  <th>Availability</th>
                  <th>Experience</th>
                  <th>Applied</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredApplicants.map((applicant) => (
                  <tr key={applicant.name}>
                    <td className="candidate-name" data-label="Candidate">
                      <a
                        className="candidate-link"
                        href="/candidate-profile"
                      >
                        {applicant.name}
                      </a>
                    </td>

                    <td data-label="Skills">{applicant.skills}</td>
                    <td data-label="Availability">{applicant.availability}</td>
                    <td data-label="Experience">{applicant.experience}</td>
                    <td data-label="Applied">{applicant.applied}</td>

                    <td data-label="Status">
                      <span
                        className={`status-badge status-${applicant.status
                          .toLowerCase()
                          .replace(/ /g, "-")}`}
                      >
                        {applicant.status}
                      </span>
                    </td>

                    <td data-label="Actions">
                      <div className="action-buttons">
                        <button
                          className="btn-shortlist"
                          onClick={() =>
                            updateStatus(applicant.name, "Shortlisted")
                          }
                        >
                          Shortlist
                        </button>

                        <button
                          className="btn-accept"
                          onClick={() =>
                            updateStatus(applicant.name, "Accepted")
                          }
                        >
                          Accept
                        </button>

                        <button
                          className="btn-reject"
                          onClick={() =>
                            updateStatus(applicant.name, "Rejected")
                          }
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredApplicants.length === 0 && (
                  <tr>
                    <td colSpan="7" className="empty-message">
                      No applicants found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer className="applicants-footer">
        <p>
          <strong>Nivra</strong> · Find work for a day. Build
          experience for tomorrow. Prototype with sample data;
          employers, jobs and students are fictional.
        </p>
      </footer>
    </div>
  );
}
