"use client";

import React, { useEffect, useState } from "react";
import "../styles/StudentProfile.css";
import StudentNavbar from "../components/StudentNavbar";
import { supabase } from "../lib/supabase";

const extraCss = `
.nivra-profile .sp-metrics{display:flex;gap:36px;flex-wrap:wrap;margin:18px 0 20px;padding:14px 0;border-top:1px solid #e9dfdb;border-bottom:1px solid #e9dfdb}
.nivra-profile .sp-metrics b{display:block;font-size:1.5rem;line-height:1.2}
.nivra-profile .sp-metrics span{color:#7b6b6e;font-size:.85rem}
.nivra-profile .sp-avatar-img{width:100%;height:100%;object-fit:cover;border-radius:inherit}
.nivra-profile .sp-card{margin-top:16px}
.nivra-profile .sp-scroll{overflow-x:auto}
.nivra-profile .sp-table{width:100%;border-collapse:collapse;font-size:.9rem;min-width:520px}
.nivra-profile .sp-table th{text-align:left;font-size:.74rem;color:#7b6b6e;text-transform:uppercase;letter-spacing:.04em;padding:8px 6px;border-bottom:1px solid #e9dfdb}
.nivra-profile .sp-table td{padding:11px 6px;border-bottom:1px solid #f0e8e4;vertical-align:top}
.nivra-profile .sp-badge{display:inline-block;font-size:.74rem;font-weight:700;padding:2px 9px;border-radius:4px;margin:0 6px 4px 0;white-space:nowrap;background:#eee5dc;color:#775e4e}
.nivra-profile .sp-badge.verified{background:#e7eddf;color:#526b4b}
.nivra-profile .sp-badge.paid{background:#593c42;color:#faf5f0}
.nivra-profile .sp-badge.pending{background:#f4e3e1;color:#684449}
.nivra-profile .sp-review{padding:14px 0;border-top:1px solid #f0e8e4}
.nivra-profile .sp-review:first-of-type{border-top:0}
.nivra-profile .sp-stars{color:#b9852a;letter-spacing:1px}
.nivra-profile .sp-review p{margin:6px 0}
.nivra-profile .sp-meta{color:#7b6b6e;font-size:.85rem}
.nivra-profile .sp-link{background:none;border:0;padding:0;color:#7b6b6e;font:inherit;font-size:.82rem;text-decoration:underline;cursor:pointer}
.nivra-profile .sp-empty{color:#7b6b6e;margin:8px 0 0}
.nivra-profile .sp-field{margin-bottom:4px}
`;

const rupees = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const stars = (n) => "★".repeat(n) + "☆".repeat(5 - n);

function formatLong(date) {
  if (!date) return "Date not set";

  return new Date(`${date.slice(0, 10)}T12:00:00`).toLocaleDateString(
    "en-IN",
    { day: "numeric", month: "long", year: "numeric" }
  );
}

export default function StudentProfile() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState("");

  const [name, setName] = useState("");
  const [education, setEducation] = useState("");
  const [college, setCollege] = useState("");
  const [course, setCourse] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [phone, setPhone] = useState("");
  const [about, setAbout] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [categories, setCategories] = useState("");
  const [availability, setAvailability] = useState("");
  const [location, setLocation] = useState("");

  const [draft, setDraft] = useState({
    name: "",
    college: "",
    course: "",
    yearOfStudy: "",
    location: "",
    phone: "",
    about: "",
    skills: "",
    experience: "",
    categories: "",
    availability: "",
  });

  const [gigs, setGigs] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);
    setMessage("");

    const { data: { user }, error: authError } =
      await supabase.auth.getUser();

    if (authError || !user) {
      setMessage("Please log in to view your profile.");
      setLoading(false);
      return;
    }

    setUserId(user.id);
    setEmail(user.email || "");

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      setMessage("Could not load your profile: " + error.message);
      setLoading(false);
      return;
    }

    if (data.role !== "student") {
      setMessage("This page is only available to student accounts.");
      setLoading(false);
      return;
    }

    setName(data.full_name || "");
    setEducation(data.education || "");
    setCollege(data.college || "");
    setCourse(data.course || "");
    setYearOfStudy(data.year_of_study || "");
    setPhone(data.phone || "");
    setAbout(data.about || "");
    setAvatarUrl(data.avatar_url || "");
    setSkills(data.skills || "");
    setExperience(data.experience || "");
    setCategories(data.preferred_categories || "");
    setAvailability(data.availability || "");
    setLocation(data.city || "");

    setLoading(false);
    loadWorkHistory(user.id);
  }

  async function loadWorkHistory(uid) {
    setHistoryLoading(true);
    setHistoryError("");

    const { data: apps, error: appError } = await supabase
      .from("applications")
      .select(
        "id, job_id, completed_at, verified_at, paid_at, rating, review, review_reported"
      )
      .eq("student_id", uid)
    .in("status", ["Accepted", "Completed"])
      .not("completed_at", "is", null)
      .order("completed_at", { ascending: false });

    if (appError) {
      console.error(appError);
      setHistoryError("Could not load your work history.");
      setHistoryLoading(false);
      return;
    }

    const applications = apps || [];

    if (applications.length === 0) {
      setGigs([]);
      setHistoryLoading(false);
      return;
    }

    // Fetch actual payment amounts and statuses for these applications.
    const { data: paymentRows, error: paymentError } = await supabase
      .from("payments")
      .select("application_id, student_amount, status, paid_at")
      .eq("student_id", uid)
      .in(
        "application_id",
        applications.map((application) => application.id)
      );

    if (paymentError) {
      console.error("Could not load payment details:", paymentError);
      setHistoryError("Could not load payment details.");
    }

    const paymentMap = Object.fromEntries(
      (paymentRows || []).map((payment) => [
        payment.application_id,
        payment,
      ])
    );

    const jobIds = [...new Set(applications.map((a) => a.job_id))];

    const { data: jobs, error: jobsError } = await supabase
      .from("jobs")
      .select("id, title, date, amount, basis, employer_id")
      .in("id", jobIds);

    if (jobsError) {
      console.error(jobsError);
      setHistoryError("Could not load job details.");
      setHistoryLoading(false);
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

      if (error) console.error(error);
      else employers = data || [];
    }

    const jobMap = Object.fromEntries(
      jobList.map((job) => [job.id, job])
    );

    const employerMap = Object.fromEntries(
      employers.map((e) => [
        e.id,
        e.business || e.full_name || "Employer",
      ])
    );

    setGigs(
      applications
        .map((a) => {
          const job = jobMap[a.job_id];

          if (!job) return null;

          const payment = paymentMap[a.id];

          return {
            id: a.id,
            title: job.title || "Untitled job",
            employer: employerMap[job.employer_id] || "Employer",
            date: job.date,
            amount:
              payment?.student_amount != null
                ? Number(payment.student_amount)
               : Math.round((Number(job.amount) || 0) * 0.97 * 100) / 100,
            paymentStatus:
              payment?.status || (a.paid_at ? "Paid" : null),
            completedAt: a.completed_at,
            verifiedAt: a.verified_at,
            paidAt:
              payment?.status === "Paid"
                ? payment.paid_at || a.paid_at
                : !payment
                  ? a.paid_at
                  : null,
            rating: a.rating,
            review: a.review,
            reported: a.review_reported,
          };
        })
        .filter(Boolean)
    );

    setHistoryLoading(false);
  }

  function openEditModal() {
    setDraft({
      name,
      college,
      course,
      yearOfStudy,
      location,
      phone,
      about,
      skills,
      experience,
      categories,
      availability,
    });

    setMessage("");
    setIsEditOpen(true);
  }

  async function saveProfile(event) {
    event.preventDefault();

    if (!userId) return;

    setSaving(true);
    setMessage("");

    const combinedEducation = [
      draft.course,
      draft.yearOfStudy,
      draft.college,
    ]
      .map((part) => part.trim())
      .filter(Boolean)
      .join(", ");

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: draft.name,
        education: combinedEducation || education,
        college: draft.college,
        course: draft.course,
        year_of_study: draft.yearOfStudy,
        phone: draft.phone,
        about: draft.about,
        skills: draft.skills,
        experience: draft.experience,
        preferred_categories: draft.categories,
        availability: draft.availability,
        city: draft.location,
      })
      .eq("id", userId);

    if (error) {
      setMessage("Could not save profile: " + error.message);
      setSaving(false);
      return;
    }

    setName(draft.name);
    setCollege(draft.college);
    setCourse(draft.course);
    setYearOfStudy(draft.yearOfStudy);
    setLocation(draft.location);
    setPhone(draft.phone);
    setAbout(draft.about);
    setSkills(draft.skills);
    setExperience(draft.experience);
    setCategories(draft.categories);
    setAvailability(draft.availability);
    setEducation(combinedEducation || education);

    setMessage("Profile updated successfully!");
    setIsEditOpen(false);
    setSaving(false);
  }

  async function reportReview(gig) {
    const { error } = await supabase.rpc("report_review", {
      p_application_id: String(gig.id),
      p_reason: "Reported by student",
    });

    if (error) {
      console.error(error);
      setMessage("Could not report this review: " + error.message);
      return;
    }

    setGigs((current) =>
      current.map((g) =>
        g.id === gig.id ? { ...g, reported: true } : g
      )
    );

    setMessage("Thanks. Nivra will look at this review.");
  }

  const verifiedGigs = gigs.filter((g) => g.verifiedAt);
  const reviews = verifiedGigs.filter((g) => g.rating);

  const averageRating = reviews.length
    ? (
        reviews.reduce((sum, g) => sum + g.rating, 0) / reviews.length
      ).toFixed(1)
    : null;

  const totalEarnings = gigs
    .filter((g) => g.paymentStatus === "Paid" || g.paidAt)
    .reduce((sum, g) => sum + g.amount, 0);

  if (loading) {
    return <div className="nivra-profile">Loading profile...</div>;
  }

  if (!userId) {
    return <div className="nivra-profile">{message}</div>;
  }

  return (
    <div className="nivra-profile">
      <style>{extraCss}</style>
      <StudentNavbar active="/student/profile" />

      <main className="profile-container">
        <div className="profile-grid">
          <section className="profile-left">
            <div className="profile-identity">
              <div className="profile-avatar">
                {avatarUrl ? (
                  <img
                    className="sp-avatar-img"
                    src={avatarUrl}
                    alt={`${name || "Student"} profile`}
                  />
                ) : (
                  name
                    .trim()
                    .split(/\s+/)
                    .filter(Boolean)
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                )}
              </div>

              <div>
                <h1>{name}</h1>
                <p>{college || education}</p>
                {(course || yearOfStudy) && (
                  <p>{[course, yearOfStudy].filter(Boolean).join(", ")}</p>
                )}
                <p>{location}</p>
              </div>
            </div>

            <div className="sp-metrics" aria-label="Reputation">
              <div>
                <b>{historyLoading ? "—" : verifiedGigs.length}</b>
                <span>Verified gigs</span>
              </div>
              <div>
                <b>
                  {historyLoading
                    ? "—"
                    : averageRating
                      ? `★ ${averageRating}/5`
                      : "—"}
                </b>
                <span>Average rating</span>
              </div>
              <div>
                <b>{historyLoading ? "—" : rupees(totalEarnings)}</b>
                <span>Total earnings</span>
              </div>
            </div>

            <div className="profile-card">
              <h3>About me</h3>

              {about.trim() ? (
                <p>{about}</p>
              ) : (
                <p className="sp-empty">
                  Add a short description about yourself.
                </p>
              )}
            </div>

            <div className="profile-card sp-card">
              <h3>Skills</h3>

              <div className="skill-list">
                {skills
                  .split(",")
                  .map((skill) => skill.trim())
                  .filter(Boolean)
                  .map((skill, index) => (
                    <span key={index}>{skill}</span>
                  ))}
              </div>

              <h3 className="info-heading">Experience</h3>

              <div>
                {experience
                  .split("\n")
                  .map((item) => item.trim())
                  .filter(Boolean)
                  .map((item, index) => (
                    <div className="experience-item" key={index}>
                      <p>{item}</p>
                    </div>
                  ))}
              </div>

              <h3 className="info-heading">Availability</h3>
              <p>{availability}</p>
            </div>

            <div className="profile-card sp-card">
              <h3>Work history</h3>

              {historyError && (
                <p role="alert" className="sp-empty">{historyError}</p>
              )}

              {historyLoading && (
                <p className="sp-empty">Loading work history...</p>
              )}

              {!historyLoading && !historyError && gigs.length === 0 && (
                <p className="sp-empty">
                  Completed gigs will appear here.
                </p>
              )}

              {!historyLoading && gigs.length > 0 && (
                <div className="sp-scroll">
                  <table className="sp-table">
                    <thead>
                      <tr>
                        <th>Job</th>
                        <th>Employer</th>
                        <th>Amount received</th>
                        <th>Transaction status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gigs.map((gig) => (
                        <tr key={gig.id}>
                          <td>{gig.title}</td>
                          <td>{gig.employer}</td>
                          <td>{rupees(gig.amount)}</td>
                          <td>
                            {gig.verifiedAt ? (
                              <span className="sp-badge verified">
                                ✓ Verified
                              </span>
                            ) : (
                              <span className="sp-badge">
                                Awaiting verification
                              </span>
                            )}

                            {gig.paymentStatus === "Paid" || gig.paidAt ? (
                              <span className="sp-badge paid">
                                ✓ Paid
                              </span>
                            ) : gig.paymentStatus === "Pending" ||
                              gig.verifiedAt ? (
                              <span className="sp-badge pending">
                                ◷ Payment Pending
                              </span>
                            ) : null}

                            {gig.paidAt && (
                              <div className="sp-meta">
                                Paid on{" "}
                                {new Date(gig.paidAt).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="profile-card sp-card">
              <h3>Employer reviews</h3>

              {historyLoading && (
                <p className="sp-empty">Loading reviews...</p>
              )}

              {!historyLoading && reviews.length === 0 && (
                <p className="sp-empty">
                  Reviews appear after an employer verifies a completed gig.
                </p>
              )}

              {!historyLoading && reviews.length > 0 && (
                <>
                  <p>
                    <b className="sp-stars">★</b>{" "}
                    <b>{averageRating} / 5</b>{" "}
                    <span className="sp-meta">
                      · Based on {reviews.length}{" "}
                      {reviews.length === 1 ? "review" : "reviews"}
                    </span>
                  </p>

                  {reviews.map((gig) => (
                    <div className="sp-review" key={gig.id}>
                      <b>{gig.employer}</b>
                      <div
                        className="sp-stars"
                        aria-label={`${gig.rating} out of 5`}
                      >
                        {stars(gig.rating)}
                      </div>
                      {gig.review && <p>“{gig.review}”</p>}
                      <div className="sp-meta">
                        {gig.title} · {formatLong(gig.date)}
                      </div>
                      <div style={{ marginTop: 4 }}>
                        {gig.reported ? (
                          <span className="sp-meta">
                            Reported. Nivra is reviewing it.
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="sp-link"
                            onClick={() => reportReview(gig)}
                          >
                            Report this review
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </section>

          <aside className="profile-right">
            <button
              type="button"
              className="edit-button"
              onClick={openEditModal}
            >
              Edit profile
            </button>

            {message && <p role="status">{message}</p>}

            <div className="profile-card">
              <h3>Contact information</h3>

              <p className="sp-meta" style={{ margin: "0 0 2px" }}>
                Email
              </p>
              <p>{email || "Not set"}</p>

              <p className="sp-meta" style={{ margin: "0 0 2px" }}>
                Phone
              </p>
              <p>{phone || "Not set"}</p>
            </div>

            <div className="profile-card preferences-card sp-card">
              <h3>Preferred categories</h3>

              <div className="skill-list">
                {categories
                  .split(",")
                  .map((category) => category.trim())
                  .filter(Boolean)
                  .map((category, index) => (
                    <span key={index}>{category}</span>
                  ))}
              </div>

              <h3 className="info-heading">Availability</h3>
              <p>{availability}</p>

              <h3 className="info-heading">Location</h3>
              <p>{location}</p>
            </div>
          </aside>
        </div>
      </main>

      {isEditOpen && (
        <div
          className="sp-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsEditOpen(false);
            }
          }}
        >
          <section
            className="sp-edit-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-student-profile-title"
          >
            <div className="sp-modal-header">
              <div>
                <h2 id="edit-student-profile-title">Edit Profile</h2>
                <p>Update your personal information</p>
              </div>

              <button
                type="button"
                className="sp-modal-close"
                onClick={() => setIsEditOpen(false)}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <form onSubmit={saveProfile}>
              <div className="sp-edit-grid">
                <label>
                  Name
                  <input
                    required
                    type="text"
                    value={draft.name}
                    onChange={(e) =>
                      setDraft({ ...draft, name: e.target.value })
                    }
                    placeholder="Your name"
                  />
                </label>

                <label>
                  College
                  <input
                    type="text"
                    value={draft.college}
                    onChange={(e) =>
                      setDraft({ ...draft, college: e.target.value })
                    }
                    placeholder="College name"
                  />
                </label>

                <label>
                  Course
                  <input
                    type="text"
                    value={draft.course}
                    onChange={(e) =>
                      setDraft({ ...draft, course: e.target.value })
                    }
                    placeholder="e.g. B.Com"
                  />
                </label>

                <label>
                  Year of study
                  <input
                    type="text"
                    value={draft.yearOfStudy}
                    onChange={(e) =>
                      setDraft({ ...draft, yearOfStudy: e.target.value })
                    }
                    placeholder="e.g. 2nd year"
                  />
                </label>

                <label>
                  Location
                  <input
                    type="text"
                    value={draft.location}
                    onChange={(e) =>
                      setDraft({ ...draft, location: e.target.value })
                    }
                    placeholder="Your location"
                  />
                </label>

                <label>
                  Phone number
                  <input
                    type="tel"
                    value={draft.phone}
                    onChange={(e) =>
                      setDraft({ ...draft, phone: e.target.value })
                    }
                    placeholder="Your phone number"
                  />
                </label>

                <label className="sp-field-full">
                  Email
                  <input type="email" value={email} disabled />
                </label>

                <label className="sp-field-full">
                  About me
                  <textarea
                    rows={3}
                    value={draft.about}
                    onChange={(e) =>
                      setDraft({ ...draft, about: e.target.value })
                    }
                    placeholder="A short description about you and the work you are looking for"
                  />
                </label>

                <label className="sp-field-full">
                  Skills
                  <textarea
                    rows={3}
                    value={draft.skills}
                    onChange={(e) =>
                      setDraft({ ...draft, skills: e.target.value })
                    }
                    placeholder="Enter your skills separated by commas"
                  />
                </label>

                <label className="sp-field-full">
                  Experience
                  <textarea
                    rows={4}
                    value={draft.experience}
                    onChange={(e) =>
                      setDraft({ ...draft, experience: e.target.value })
                    }
                    placeholder="Enter your experience (one item per line)"
                  />
                </label>

                <label className="sp-field-full">
                  Availability
                  <textarea
                    rows={2}
                    value={draft.availability}
                    onChange={(e) =>
                      setDraft({ ...draft, availability: e.target.value })
                    }
                    placeholder="When are you available?"
                  />
                </label>

                <label className="sp-field-full">
                  Preferred categories
                  <textarea
                    rows={3}
                    value={draft.categories}
                    onChange={(e) =>
                      setDraft({ ...draft, categories: e.target.value })
                    }
                    placeholder="Enter preferred categories separated by commas"
                  />
                </label>
              </div>

              <div className="sp-modal-actions">
                <button
                  type="button"
                  className="sp-cancel-btn"
                  onClick={() => setIsEditOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="sp-save-btn"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}