
"use client";

import { useEffect, useMemo, useState } from "react";
import EmployerNavbar from "../components/EmployerNavbar";
import { supabase } from "../lib/supabase";

const MARK = {
  full: ["✓", "Provided"],
  part: ["~", "Partial"],
  low: ["!", "Not provided"],
};

const css = `
.nv .mr-head{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;flex-wrap:wrap;margin-bottom:16px}
.nv .mr-head h1{font-size:1.7rem;margin:0 0 4px}
.nv .mr-note{background:var(--sl);border-radius:6px;padding:10px 14px;font-size:.88rem;margin-bottom:16px}
.nv .mr-bar{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:12px}
.nv .mr-bar select{width:auto;min-width:150px}
.nv .mr-bar .grow{flex:1}
.nv .mr-job-select{width:100%;max-width:450px;margin:12px 0 16px}
.nv .mr-job-select select{width:100%;padding:11px;border:1px solid var(--ln);border-radius:7px;background:var(--sf);color:inherit}
.nv .mr-list{background:var(--sf);border:1px solid var(--ln);border-radius:8px}
.nv .mr-row{display:grid;grid-template-columns:76px minmax(0,1fr) 150px;gap:18px;padding:18px 20px;border-bottom:1px solid var(--ln);align-items:start}
.nv .mr-row:last-child{border-bottom:0}
.nv .mr-score{text-align:center}
.nv .mr-score b{display:block;font-size:1.9rem;line-height:1;color:var(--sd)}
.nv .mr-score span{font-size:.72rem;color:var(--mu);text-transform:uppercase;letter-spacing:.05em}
.nv .mr-rank{font-size:.78rem;color:var(--mu);margin-bottom:6px}
.nv .mr-name{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:2px}
.nv .mr-name b{font-size:1.05rem}
.nv .mr-badge{font-size:.74rem;font-weight:700;padding:2px 9px;border-radius:4px;background:var(--ln)}
.nv .mr-badge.sl{background:var(--sl);color:var(--sd)}
.nv .mr-facts{display:grid;grid-template-columns:1fr 1fr;gap:8px 20px;margin-top:12px}
.nv .mr-fact{font-size:.88rem;display:flex;gap:8px;align-items:baseline;min-width:0;overflow-wrap:anywhere}
.nv .mr-fact small{display:block;color:var(--mu);font-size:.75rem;text-transform:uppercase;letter-spacing:.04em}
.nv .mr-mk{flex:none;width:20px;height:20px;border-radius:50%;display:grid;place-items:center;font-size:.75rem;font-weight:700;background:var(--sl);color:var(--sd)}
.nv .mr-mk.part{background:var(--tl);color:var(--btn)}
.nv .mr-mk.low{background:none;border:1px solid var(--er);color:var(--er)}
.nv .mr-act{display:flex;flex-direction:column;gap:8px}
.nv .mr-act .btn{width:100%;text-align:center}
.nv .mr-act .btn:disabled{opacity:.5;cursor:not-allowed}
.nv .mr-chk{display:flex;gap:8px;align-items:center;font-weight:400;margin:0;font-size:.85rem}
.nv .mr-chk input{width:auto}
.nv .mr-ex{margin-top:16px}.nv .mr-ex .box{padding:14px 20px}
.nv .mr-ov{position:fixed;inset:0;background:rgba(30,20,22,.5);display:grid;place-items:center;z-index:20;padding:16px}
.nv .mr-md{background:var(--sf);border-radius:10px;padding:24px;max-width:760px;width:100%;max-height:88vh;overflow:auto}
.nv .mr-md table{width:100%;border-collapse:collapse;font-size:.9rem}
.nv .mr-md th,.nv .mr-md td{text-align:left;padding:10px 8px;border-bottom:1px solid var(--ln);vertical-align:top}
.nv .mr-md th{font-size:.78rem;color:var(--mu);text-transform:uppercase;letter-spacing:.04em}
.nv .mr-empty{text-align:center;padding:36px 12px}
.nv .mr-error{color:var(--er);margin:12px 0}
.nv .mr-success{color:var(--sd);margin:12px 0}
.nv .mr-profile-link{color:var(--sd);text-decoration:underline;cursor:pointer}
@media(max-width:760px){
 .nv .mr-row{grid-template-columns:60px minmax(0,1fr);padding:16px}
 .nv .mr-act{grid-column:1 / -1;flex-direction:row;flex-wrap:wrap;align-items:center}
 .nv .mr-act .btn{width:auto;flex:1}
 .nv .mr-facts{grid-template-columns:1fr}
}
`;

function skillList(value) {
  if (Array.isArray(value)) {
    return value.map((x) => String(x).trim().toLowerCase()).filter(Boolean);
  }

  if (!value) return [];

  return String(value)
    .split(/[,;\n|]/)
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean);
}

function calculateSkillMatch(required, candidate) {
  const requiredSkills = [...new Set(skillList(required))];
  const candidateSkills = [...new Set(skillList(candidate))];

  if (requiredSkills.length === 0 || candidateSkills.length === 0) {
    return null;
  }

  const matched = requiredSkills.filter((skill) =>
    candidateSkills.some(
      (candidateSkill) =>
        candidateSkill === skill ||
        candidateSkill.includes(skill) ||
        skill.includes(candidateSkill)
    )
  );

  return {
    score: Math.round((matched.length / requiredSkills.length) * 100),
    matched: matched.length,
    total: requiredSkills.length,
    skills: matched,
  };
}

function experienceValue(value) {
  if (!value) return 0;

  const text = String(value).toLowerCase();
  const years = text.match(/(\d+(?:\.\d+)?)\s*(?:years?|yrs?)/);
  const months = text.match(/(\d+(?:\.\d+)?)\s*(?:months?|mos?)/);

  return (years ? Number(years[1]) * 12 : 0) +
    (months ? Number(months[1]) : 0);
}

function formatDate(value) {
  if (!value) return "Date not set";

  return new Date(`${value}T12:00:00`).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

function getFactors(candidate) {
  return [
    {
      key: "skills",
      label: "Skills",
      level: candidate.skillMatch
        ? candidate.skillMatch.score >= 70
          ? "full"
          : "part"
        : "low",
      text: candidate.skillMatch
        ? `${candidate.skillMatch.matched} of ${candidate.skillMatch.total} required skills matched`
        : "Skills not provided or job requirements missing",
    },
    {
      key: "avail",
      label: "Availability",
      level: candidate.availability ? "full" : "low",
      text: candidate.availability || "Not provided",
    },
    {
      key: "loc",
      label: "Location",
      level: candidate.city ? "full" : "low",
      text: candidate.city || "Not provided",
    },
    {
      key: "exp",
      label: "Experience",
      level: candidate.experience ? "full" : "low",
      text: candidate.experience || "Not provided",
    },
  ];
}
const defaultNavigate = (path) => window.location.assign(path);

export default function MatchingResults({
  onNavigate = defaultNavigate,
}) {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [sort, setSort] = useState("match");
  const [minScore, setMinScore] = useState(0);
  const [availOnly, setAvailOnly] = useState(false);
  const [compare, setCompare] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const selectedJob = jobs.find(
    (job) => String(job.id) === String(selectedJobId)
  );
const isJobCompleted =
  selectedJob?.status?.toLowerCase() === "completed" ||
  (selectedJob?.date &&
    selectedJob.date < new Date().toLocaleDateString("en-CA"));
  useEffect(() => {
    let active = true;

    async function loadJobs() {
      setLoading(true);
      setError("");

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        onNavigate("/login?mode=login");
        return;
      }

      const { data, error: jobError } = await supabase
        .from("jobs")
        .select("*")
        .eq("employer_id", user.id)
        .order("created_at", { ascending: false });

      if (!active) return;

      if (jobError) {
        console.error("Could not load employer jobs:", jobError);
        setError(jobError.message);
        setLoading(false);
        return;
      }

      setJobs(data || []);

      if (data?.length) {
        setSelectedJobId(data[0].id);
      }

      setLoading(false);
    }

    loadJobs();

    return () => {
      active = false;
    };
  }, [onNavigate]);

  useEffect(() => {
    let active = true;

    async function loadCandidates() {
      if (!selectedJobId) {
        setCandidates([]);
        return;
      }

      setLoading(true);
      setError("");
      setNotice("");
      setCompare([]);

      const { data: applications, error: applicationError } =
        await supabase
          .from("applications")
          .select("id, job_id, student_id, status, applied_at")
          .eq("job_id", selectedJobId)
          .order("applied_at", { ascending: false });

      if (!active) return;

      if (applicationError) {
        console.error("Could not load applications:", applicationError);
        setError(applicationError.message);
        setLoading(false);
        return;
      }

      const applicationRows = applications || [];
      const studentIds = [
        ...new Set(applicationRows.map((app) => app.student_id)),
      ];

      let profiles = [];

      if (studentIds.length > 0) {
        const { data, error: profileError } = await supabase
          .from("profiles")
          .select(
            "id, full_name, college, skills, availability, experience, city"
          )
          .in("id", studentIds);

        if (!active) return;

        if (profileError) {
          console.error("Could not load student profiles:", profileError);
          setError(profileError.message);
          setLoading(false);
          return;
        }

        profiles = data || [];
      }

      const profileMap = Object.fromEntries(
        profiles.map((profile) => [profile.id, profile])
      );

      const job = jobs.find(
        (item) => String(item.id) === String(selectedJobId)
      );

      const formatted = applicationRows.map((application) => {
        const profile = profileMap[application.student_id] || {};
        const skillMatch = calculateSkillMatch(
          job?.skills,
          profile.skills
        );

        return {
          id: application.id,
          studentId: application.student_id,
          jobId: application.job_id,
          name: profile.full_name || "Student",
          college: profile.college || "College not provided",
          skills: profile.skills || "",
          availability: profile.availability || "",
          experience: profile.experience || "",
          city: profile.city || "",
          status: application.status || "Applied",
          appliedAt: application.applied_at,
          score: skillMatch?.score ?? null,
          skillMatch,
        };
      });

      if (active) {
        setCandidates(formatted);
        setLoading(false);
      }
    }

    loadCandidates();

    return () => {
      active = false;
    };
  }, [selectedJobId, jobs]);

  useEffect(() => {
    if (!showCompare) return;

    const onKey = (event) => {
      if (event.key === "Escape") setShowCompare(false);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showCompare]);

  const list = useMemo(() => {
    return candidates
      .filter((candidate) => {
        if (minScore > 0 &&
          (candidate.score === null || candidate.score < minScore)) {
          return false;
        }

        if (availOnly && !candidate.availability.trim()) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sort === "exp") {
          return experienceValue(b.experience) -
            experienceValue(a.experience);
        }

        if (sort === "recent") {
          return new Date(b.appliedAt || 0) -
            new Date(a.appliedAt || 0);
        }

        return (b.score ?? -1) - (a.score ?? -1);
      });
  }, [candidates, minScore, availOnly, sort]);

  const picked = candidates.filter((candidate) =>
    compare.includes(candidate.id)
  );

  function toggleCompare(id) {
    setCompare((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : current.length < 3
          ? [...current, id]
          : current
    );
  }

  function resetFilters() {
    setMinScore(0);
    setAvailOnly(false);
    setSort("match");
  }

  async function toggleShortlist(candidate) {
    if (updating) return;

    let nextStatus;

    if (candidate.status === "Shortlisted") {
      nextStatus = "Under Review";
    } else if (
      candidate.status === "Applied" ||
      candidate.status === "Under Review"
    ) {
      nextStatus = "Shortlisted";
    } else {
      return;
    }

    setUpdating(candidate.id);
    setNotice("");
    setError("");

    const { data, error: updateError } = await supabase
      .from("applications")
      .update({ status: nextStatus })
      .eq("id", candidate.id)
      .eq("job_id", selectedJobId)
      .select("id, status")
      .single();

    if (updateError) {
      console.error("Could not update shortlist:", updateError);
      setError(updateError.message);
    } else {
      setCandidates((current) =>
        current.map((item) =>
          item.id === data.id
            ? { ...item, status: data.status }
            : item
        )
      );

      setNotice(
        nextStatus === "Shortlisted"
          ? "Candidate shortlisted successfully."
          : "Candidate removed from shortlist."
      );
    }

    setUpdating(null);
  }

  const factors = (candidate) => getFactors(candidate);

  if (loading && jobs.length === 0) {
    return (
      <div className="nv">
        <EmployerNavbar active="/employer/matching" />
        <main className="w" style={{ padding: "28px 20px" }}>
          Loading matching results...
        </main>
      </div>
    );
  }

  return (
    <div className="nv">
      <style>{css}</style>
      <EmployerNavbar active="/employer/matching" />

      <main className="w" style={{ padding: "28px 20px 8px" }}>
        <div className="mr-head">
          <div>
            <h1>Matching results</h1>
            <p className="mu" style={{ margin: 0 }}>
              Find suitable candidates for your posted jobs.
            </p>
          </div>
          <span className="tag">Premium</span>
        </div>

        {jobs.length > 0 && (
          <div className="mr-job-select">
            <label htmlFor="matching-job">
              <b>Select a job to match applicants</b>
            </label>
            <select
              id="matching-job"
              value={selectedJobId}
              onChange={(event) => setSelectedJobId(event.target.value)}
            >
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title} · {formatDate(job.date)}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedJob && (
          <p className="mu" style={{ marginBottom: 16 }}>
            {selectedJob.title} · {selectedJob.location || "Location not provided"} ·{" "}
            {formatDate(selectedJob.date)} ·{" "}
            {selectedJob.hours || "Hours not specified"} ·{" "}
            {selectedJob.workers || 0} workers needed
          </p>
        )}

        <p className="mr-note">
          Match scores are based on overlap between the job's required skills
          and the skills listed in each applicant's profile. Availability,
          location and experience are displayed separately and should be
          verified before selecting a candidate.
        </p>

        {error && <p className="mr-error" role="alert">{error}</p>}
        {notice && <p className="mr-success" role="status">{notice}</p>}

        {jobs.length === 0 && !loading ? (
          <section className="mr-list">
            <div className="mr-empty">
              <h3>You haven't posted any jobs yet.</h3>
              <p className="mu">Post a job to start matching applicants.</p>
              <button
                className="btn"
                onClick={() => onNavigate("/employer/post-job")}
              >
                Post a job
              </button>
            </div>
          </section>
        ) : (
          <>
            <div className="mr-bar">
              <select
                aria-label="Sort candidates"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
              >
                <option value="match">Sort: Best skill match</option>
                <option value="exp">Sort: Most experience</option>
                <option value="recent">Sort: Recently applied</option>
              </select>

              <select
                aria-label="Minimum match score"
                value={minScore}
                onChange={(event) => setMinScore(Number(event.target.value))}
              >
                <option value={0}>Any score</option>
                <option value={70}>70 and above</option>
                <option value={80}>80 and above</option>
              </select>

              <select
                aria-label="Availability filter"
                value={availOnly ? "provided" : "all"}
                onChange={(event) =>
                  setAvailOnly(event.target.value === "provided")
                }
              >
                <option value="all">Any availability</option>
                <option value="provided">Availability provided</option>
              </select>

              <span className="grow mu" style={{ fontSize: ".88rem" }}>
                {list.length} applicants ·{" "}
                {candidates.filter((c) => c.status === "Shortlisted").length} shortlisted
              </span>

              <button
                className="btn s"
                disabled={compare.length < 2}
                style={{ opacity: compare.length < 2 ? 0.55 : 1 }}
                onClick={() => setShowCompare(true)}
              >
                Compare ({compare.length}/3)
              </button>
            </div>

            <section className="mr-list" aria-label="Matching candidates">
              {loading ? (
                <div className="mr-empty">Loading applicants...</div>
              ) : list.length === 0 ? (
                <div className="mr-empty">
                  <h3>No applicants match these filters</h3>
                  <p className="mu">
                    Try lowering the minimum score or clearing the availability filter.
                  </p>
                  <button className="btn s" onClick={resetFilters}>
                    Clear filters
                  </button>
                </div>
              ) : (
                list.map((candidate, index) => {
                  const isShortlisted = candidate.status === "Shortlisted";
                  const canShortlist =
  !isJobCompleted &&
  ["Applied", "Under Review", "Shortlisted"].includes(candidate.status);

                  const candidateFactors = factors(candidate);

                  return (
                    <article className="mr-row" key={candidate.id}>
                      <div className="mr-score">
                        <div className="mr-rank">#{index + 1}</div>
                        <b>
                          {candidate.score === null
                            ? "—"
                            : candidate.score}
                        </b>
                        <span>skill match</span>
                      </div>

                      <div>
                        <div className="mr-name">
                          <b>{candidate.name}</b>
                          <span className={`mr-badge ${isShortlisted ? "sl" : ""}`}>
                            {candidate.status}
                          </span>
                        </div>

                        <div className="mu" style={{ fontSize: ".88rem" }}>
                          {candidate.college}
                        </div>

                        <div className="mr-facts">
                          {candidateFactors.map((factor) => (
                            <div className="mr-fact" key={factor.key}>
                              <span
                                className={`mr-mk ${factor.level}`}
                                role="img"
                                aria-label={MARK[factor.level][1]}
                              >
                                {MARK[factor.level][0]}
                              </span>
                              <div>
                                <small>{factor.label}</small>
                                {factor.text}
                              </div>
                            </div>
                          ))}
                        </div>

                        <p className="mu" style={{ fontSize: ".8rem", marginTop: 10 }}>
                          Applied:{" "}
                          {candidate.appliedAt
                            ? new Date(candidate.appliedAt).toLocaleDateString("en-GB")
                            : "Unknown"}
                        </p>
                      </div>

                      <div className="mr-act">
                        <button
                          className={`btn ${isShortlisted ? "" : "s"}`}
                          onClick={() => toggleShortlist(candidate)}
                          disabled={!canShortlist || updating === candidate.id}
                          aria-pressed={isShortlisted}
                        >
                          {updating === candidate.id
                            ? "Updating..."
                            : isShortlisted
                              ? "✓ Shortlisted"
                              : canShortlist
                                ? "Shortlist"
                                : candidate.status}
                        </button>

                        <button
                          className="btn s"
                          onClick={() =>
                            onNavigate(
                              `/candidate-profile?id=${candidate.studentId}&applicationId=${candidate.id}`
                            )
                          }
                        >
                          View profile
                        </button>

                        <label className="mr-chk">
                          <input
                            type="checkbox"
                            checked={compare.includes(candidate.id)}
                            onChange={() => toggleCompare(candidate.id)}
                            disabled={
                              !compare.includes(candidate.id) &&
                              compare.length >= 3
                            }
                          />
                          Compare
                        </label>
                      </div>
                    </article>
                  );
                })
              )}
            </section>
          </>
        )}
      </main>

      {showCompare && (
        <div
          className="mr-ov"
          onClick={(event) =>
            event.target === event.currentTarget && setShowCompare(false)
          }
        >
          <div
            className="mr-md"
            role="dialog"
            aria-modal="true"
            aria-label="Compare candidates"
          >
            <h2>Compare candidates</h2>

            <table>
              <thead>
                <tr>
                  <th></th>
                  {picked.map((candidate) => (
                    <th key={candidate.id}>{candidate.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="mu">Skill match</td>
                  {picked.map((candidate) => (
                    <td key={candidate.id}>
                      {candidate.score === null
                        ? "Not available"
                        : `${candidate.score}%`}
                    </td>
                  ))}
                </tr>

                {[
                  ["college", "College"],
                  ["skills", "Skills"],
                  ["availability", "Availability"],
                  ["city", "Location"],
                  ["experience", "Experience"],
                ].map(([key, label]) => (
                  <tr key={key}>
                    <td className="mu">{label}</td>
                    {picked.map((candidate) => (
                      <td key={candidate.id}>
                        {key === "skills" && Array.isArray(candidate[key])
                          ? candidate[key].join(", ")
                          : candidate[key] || "Not provided"}
                      </td>
                    ))}
                  </tr>
                ))}

                <tr>
                  <td className="mu">Status</td>
                  {picked.map((candidate) => (
                    <td key={candidate.id}>{candidate.status}</td>
                  ))}
                </tr>
              </tbody>
            </table>

            <div className="row" style={{ marginTop: 16 }}>
              {picked.map((candidate) => (
                <button
                  key={candidate.id}
                  className="btn s sm"
                  disabled={
                    !["Applied", "Under Review", "Shortlisted"].includes(
                      candidate.status
                    )
                  }
                  onClick={() => toggleShortlist(candidate)}
                >
                  {candidate.status === "Shortlisted"
                    ? `Remove ${candidate.name.split(" ")[0]}`
                    : `Shortlist ${candidate.name.split(" ")[0]}`}
                </button>
              ))}

              <button
                className="btn sm"
                onClick={() => setShowCompare(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
