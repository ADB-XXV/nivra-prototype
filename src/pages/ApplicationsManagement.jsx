"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import EmployerNavbar from "../components/EmployerNavbar";
import { INITIAL_APPLICANTS } from "../data/applicants";

export default function ApplicationsManagement() {
  const terminalStatuses = ["Accepted", "Rejected"];

  const [applicants, setApplicants] = useState(() => [...INITIAL_APPLICANTS]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const statuses = [
    "Applied",
    "Under Review",
    "Shortlisted",
    "Accepted",
    "Rejected",
  ];

  function canUpdateStatus(currentStatus, nextStatus) {
    if (terminalStatuses.includes(currentStatus)) {
      return false;
    }

    if (nextStatus === "Shortlisted") {
      return currentStatus === "Applied" || currentStatus === "Under Review";
    }

    if (nextStatus === "Accepted") {
      return currentStatus === "Shortlisted";
    }

    return nextStatus === "Rejected" &&
      ["Applied", "Under Review", "Shortlisted"].includes(currentStatus);
  }

  function updateStatus(id, status) {
    setApplicants((current) =>
      current.map((applicant) => {
        if (
          applicant.id !== id ||
          !canUpdateStatus(applicant.status, status)
        ) {
          return applicant;
        }

        return { ...applicant, status };
      })
    );
  }

  const filteredApplicants = useMemo(() => {
    return applicants.filter((applicant) => {
      const matchesName = applicant.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        filter === "All" || applicant.status === filter;

      return matchesName && matchesStatus;
    });
  }, [applicants, search, filter]);

  function statusClass(status) {
    return status.toLowerCase().replace(/\s+/g, "-");
  }

  return (
    <div className="nv">
      <EmployerNavbar active="/employer/applicants" />
      <style>{`
        .am-page {
          --am-ink: #302626;
          --am-muted: #817471;
          --am-border: #e8dcd5;
          --am-accent: #67464a;
          --am-bg: #faf5f1;

          width: 100%;
          min-height: calc(100vh - 56px);
          padding: 42px clamp(20px, 4vw, 64px) 60px;
          box-sizing: border-box;
          background: var(--am-bg);
          color: var(--am-ink);
          font-family: "Manrope", "DM Sans", system-ui, sans-serif;
        }

        .am-page *,
        .am-page *::before,
        .am-page *::after {
          box-sizing: border-box;
        }

        .am-container {
          width: 100%;
          max-width: 1800px;
          margin: 0 auto;
        }

        .am-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
          margin-bottom: 30px;
        }

        .am-eyebrow {
          margin: 0 0 9px;
          color: var(--am-muted);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .am-heading h1 {
          margin: 0;
          font-size: clamp(32px, 2.8vw, 48px);
          line-height: 1.2;
          letter-spacing: -0.7px;
        }

        .am-subtitle {
          margin: 12px 0 0;
          color: var(--am-muted);
          font-size: 16px;
          line-height: 1.6;
        }

        .am-count {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 18px;
          border: 1px solid var(--am-border);
          border-radius: 12px;
          background: white;
          white-space: nowrap;
        }

        .am-count strong {
          color: var(--am-accent);
          font-size: 28px;
        }

        .am-count span {
          color: var(--am-muted);
          font-size: 14px;
        }

        .am-toolbar {
          display: flex;
          align-items: flex-end;
          gap: 18px;
          margin-bottom: 24px;
        }

        .am-search {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          max-width: 620px;
          min-height: 44px;
          padding: 0 16px;
          border: 1px solid var(--am-border);
          border-radius: 10px;
          background: white;
        }

        .am-search:focus-within {
          border-color: var(--am-accent);
          box-shadow: 0 0 0 3px #67464a15;
        }

        .am-search-icon {
          color: var(--am-muted);
          font-size: 25px;
        }

        /* Higher specificity so the global ".nv input:focus-visible" green outline can't apply */
        .am-page .am-search input,
        .am-page .am-search input:focus,
        .am-page .am-search input:focus-visible {
          width: 100%;
          min-width: 0;
          padding: 9px 0;
          border: 0;
          border-radius: 0;
          outline: none;
          box-shadow: none;
          background: transparent;
          color: var(--am-ink);
          font: inherit;
          font-size: 15px;
        }

        .am-filter {
          display: grid;
          gap: 7px;
          min-width: 210px;
          color: var(--am-muted);
          font-size: 13px;
          font-weight: 700;
        }

        .am-filter select {
          width: 100%;
          min-height: 52px;
          padding: 0 14px;
          border: 1px solid var(--am-border);
          border-radius: 10px;
          background: white;
          color: var(--am-ink);
          font: inherit;
          font-size: 15px;
          cursor: pointer;
        }

        .am-table-card {
          width: 100%;
          overflow: hidden;
          border: 1px solid var(--am-border);
          border-radius: 14px;
          background: white;
          box-shadow: 0 5px 22px #4a2d2608;
        }

        .am-table-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 22px 26px;
          border-bottom: 1px solid var(--am-border);
        }

        .am-table-heading h2 {
          margin: 0;
          font-size: 22px;
        }

        .am-table-heading span {
          color: var(--am-muted);
          font-size: 14px;
        }

        .am-table-scroll {
          width: 100%;
          overflow-x: auto;
        }

        .am-table {
          width: 100%;
          min-width: 1120px;
          border-collapse: collapse;
          text-align: left;
        }

        .am-table th {
          padding: 18px 16px;
          background: #fcf9f7;
          color: #776965;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .am-table th:first-child,
        .am-table td:first-child {
          padding-left: 26px;
        }

        .am-table td {
          padding: 19px 16px;
          border-top: 1px solid #eee5df;
          color: #544946;
          font-size: 16px;
          line-height: 1.65;
          vertical-align: middle;
        }

        .am-table tbody tr:hover {
          background: #fdfaf8;
        }

        .am-candidate {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 170px;
        }

        .am-avatar {
          display: grid;
          flex: 0 0 42px;
          width: 42px;
          height: 42px;
          place-items: center;
          border-radius: 12px;
          background: #f0e2dc;
          color: var(--am-accent);
          font-size: 13px;
          font-weight: 800;
        }

        .am-candidate strong {
          color: #332827;
          font-size: 15px;
        }

        .am-candidate-name {
          color: inherit;
          text-decoration: none;
        }

        .am-candidate-name:hover {
          color: var(--am-accent);
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .am-candidate-name:focus-visible {
          border-radius: 2px;
          outline: 2px solid var(--am-accent);
          outline-offset: 3px;
        }

        .am-status {
          display: inline-flex;
          align-items: center;
          padding: 7px 11px;
          border-radius: 7px;
          font-size: 12px;
          font-weight: 750;
          line-height: 1.4;
          white-space: nowrap;
        }

        .am-status.applied {
          background: #eee5dc;
          color: #775e4e;
        }

        .am-status.under-review {
          background: #f2e2de;
          color: #684449;
        }

        .am-status.shortlisted {
          background: #e7eddf;
          color: #526b4b;
        }

        .am-status.accepted {
          background: #dceee3;
          color: #276442;
        }

        .am-status.rejected {
          background: #f8e4e2;
          color: #a33c3c;
        }

        .am-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }

        .am-button {
          min-height: 38px;
          padding: 8px 12px;
          border: 1px solid var(--am-border);
          border-radius: 8px;
          background: white;
          font: inherit;
          font-size: 13px;
          font-weight: 650;
          cursor: pointer;
          transition: background 150ms ease, opacity 150ms ease;
        }

        .am-button:hover:not(:disabled) {
          background: #f5ece8;
        }

        .am-button:disabled {
          cursor: default;
          opacity: 0.45;
        }

        .am-button.accept {
          border-color: var(--am-accent);
          background: var(--am-accent);
          color: white;
        }

        .am-button.accept:hover:not(:disabled) {
          background: #513539;
        }

        .am-button.reject {
          border-color: #d7a4a1;
          color: #a34545;
        }

        .am-button.reject:hover:not(:disabled) {
          background: #fff1ef;
        }

        .am-empty {
          padding: 55px 20px !important;
          text-align: center;
        }

        .am-empty strong {
          display: block;
          font-size: 17px;
        }

        .am-empty p {
          margin: 8px 0 0;
          color: var(--am-muted);
        }

        .am-footer {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          padding: 18px 26px;
          border-top: 1px solid var(--am-border);
          background: #fcf9f7;
          color: var(--am-muted);
          font-size: 13px;
        }

        @media (min-width: 1600px) {
          .am-table td {
            padding-top: 23px;
            padding-bottom: 23px;
            font-size: 16px;
          }

          .am-table th {
            padding-top: 20px;
            padding-bottom: 20px;
          }
        }

        @media (max-width: 760px) {
          .am-page {
            padding: 28px 16px 40px;
          }

          .am-heading {
            align-items: flex-start;
            flex-direction: column;
            gap: 18px;
          }

          .am-toolbar {
            align-items: stretch;
            flex-direction: column;
          }

          .am-search {
            max-width: none;
          }

          .am-filter {
            min-width: 0;
          }

          .am-table-heading,
          .am-footer {
            align-items: flex-start;
            flex-direction: column;
            padding: 18px;
          }

          .am-table th:first-child,
          .am-table td:first-child {
            padding-left: 18px;
          }

          .am-table-scroll {
            overflow: visible;
          }

          .am-table,
          .am-table tbody {
            display: block;
            width: 100%;
            min-width: 0;
          }

          .am-table thead {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            clip-path: inset(50%);
          }

          .am-table tbody tr {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            padding: 12px 16px;
            border-top: 1px solid #eee5df;
          }

          .am-table td {
            display: flex;
            min-width: 0;
            flex-direction: column;
            align-items: flex-start;
            gap: 5px;
            padding: 10px 2px;
            border: 0;
            overflow-wrap: anywhere;
            font-size: 14px;
          }

          .am-table td::before {
            content: attr(data-label);
            color: var(--am-muted);
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.5px;
            text-transform: uppercase;
          }

          .am-table td:first-child,
          .am-table td:last-child {
            grid-column: 1 / -1;
            padding-left: 2px;
          }

          .am-table td:first-child::before,
          .am-table td.am-empty::before {
            content: none;
          }

          .am-table td.am-empty {
            grid-column: 1 / -1;
            padding: 30px 4px !important;
          }

          .am-actions {
            width: 100%;
            flex-wrap: wrap;
            white-space: normal;
          }

          .am-button {
            flex: 1 1 85px;
          }
        }
      `}</style>

      <main className="am-page">
        <div className="am-container">
          <header className="am-heading">
            <div>
              {/* <p className="am-eyebrow">EMPLOYER WORKSPACE</p> */}
              <h1>Applicants</h1>
              <p className="am-subtitle">
                Event Assistant · Kozhikode · Sat 24 Oct
              </p>
            </div>

            <div className="am-count">
              <strong>{filteredApplicants.length}</strong>
              <span>of {applicants.length} applicants</span>
            </div>
          </header>

          <section className="am-toolbar">
            <label className="am-search">
              <span className="am-search-icon" aria-hidden="true">
                ⌕
              </span>
              <input
                type="search"
                placeholder="Search by candidate name..."
                aria-label="Search applicants by name"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>

            <label className="am-filter">
              <span>Filter by status</span>
              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
              >
                <option value="All">All statuses</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </section>

          <section className="am-table-card">
            <div className="am-table-heading">
              <h2>All applications</h2>
              <span>
                Showing {filteredApplicants.length} candidates
              </span>
            </div>

            <div className="am-table-scroll">
              <table className="am-table">
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
                    <tr key={applicant.id}>
                      <td data-label="Candidate">
                        <div className="am-candidate">
                          <div className="am-avatar">
                            {applicant.name
                              .split(" ")
                              .map((part) => part[0])
                              .slice(0, 2)
                              .join("")}
                          </div>
                          <strong>
                            <Link
                              className="am-candidate-name"
                              href={`/candidate-profile?id=${applicant.id}`}
                            >
                              {applicant.name}
                            </Link>
                          </strong>
                        </div>
                      </td>

                      <td data-label="Skills">{applicant.skills}</td>
                      <td data-label="Availability">{applicant.availability}</td>
                      <td data-label="Experience">{applicant.experience}</td>
                      <td data-label="Applied">{applicant.applied}</td>

                      <td data-label="Status">
                        <span
                          className={`am-status ${statusClass(
                            applicant.status
                          )}`}
                        >
                          {applicant.status}
                        </span>
                      </td>

                      <td data-label="Actions">
                        <div className="am-actions">
                          <button
                            className="am-button"
                            disabled={!canUpdateStatus(applicant.status, "Shortlisted")}
                            onClick={() =>
                              updateStatus(applicant.id, "Shortlisted")
                            }
                          >
                            Shortlist
                          </button>

                          <button
                            className="am-button accept"
                            disabled={!canUpdateStatus(applicant.status, "Accepted")}
                            onClick={() =>
                              updateStatus(applicant.id, "Accepted")
                            }
                          >
                            Accept
                          </button>

                          <button
                            className="am-button reject"
                            disabled={!canUpdateStatus(applicant.status, "Rejected")}
                            onClick={() =>
                              updateStatus(applicant.id, "Rejected")
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
                      <td className="am-empty" colSpan={7}>
                        <strong>No applicants found</strong>
                        <p>
                          Try another name or select a different status.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <footer className="am-footer">
              <span>
                {filteredApplicants.length} of {applicants.length} results
              </span>
              
            </footer>
          </section>
        </div>
      </main>
    </div>
  );
}