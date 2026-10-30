
"use client";

import React, { useEffect, useState } from "react";
import "../styles/StudentProfile.css";
import StudentNavbar from "../components/StudentNavbar";
import { supabase } from "../lib/supabase";

export default function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [userId, setUserId] = useState(null);

  const [name, setName] = useState("");
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [categories, setCategories] = useState("");
  const [availability, setAvailability] = useState("");
  const [location, setLocation] = useState("");

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
    setSkills(data.skills || "");
    setExperience(data.experience || "");
    setCategories(data.preferred_categories || "");
    setAvailability(data.availability || "");
    setLocation(data.city || "");

    setLoading(false);
  }

  async function saveProfile() {
    if (!userId) return;

    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: name,
        education: education,
        skills: skills,
        experience: experience,
        preferred_categories: categories,
        availability: availability,
        city: location
      })
      .eq("id", userId);

    if (error) {
      setMessage("Could not save profile: " + error.message);
      setSaving(false);
      return;
    }

    setMessage("Profile updated successfully!");
    setIsEditing(false);
    setSaving(false);
  }

  if (loading) {
    return <div className="nivra-profile">Loading profile...</div>;
  }

  if (!userId) {
    return <div className="nivra-profile">{message}</div>;
  }

  return (
    <div className="nivra-profile">
      <StudentNavbar active="/student/profile" />

      <main className="profile-container">
        <div className="profile-grid">
          <section className="profile-left">
            <div className="profile-identity">
              <div className="profile-avatar">
                {name
                  .trim()
                  .split(/\s+/)
                  .filter(Boolean)
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>

              <div>
                {isEditing ? (
                  <>
                    <label>Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                    />

                    <label>Education</label>
                    <input
                      type="text"
                      value={education}
                      onChange={(e) => setEducation(e.target.value)}
                      placeholder="College and course"
                    />

                    <label>Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Your location"
                    />
                  </>
                ) : (
                  <>
                    <h1>{name}</h1>
                    <p>{education}</p>
                    <p>{location}</p>
                  </>
                )}
              </div>
            </div>

            <div className="profile-card">
              <h3>Skills</h3>

              {isEditing ? (
                <textarea
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="Enter your skills separated by commas"
                  rows={3}
                />
              ) : (
                <div className="skill-list">
                  {skills
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter(Boolean)
                    .map((skill, index) => (
                      <span key={index}>{skill}</span>
                    ))}
                </div>
              )}

              <h3 className="info-heading">Experience</h3>

              {isEditing ? (
                <textarea
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="Enter your experience"
                  rows={5}
                />
              ) : (
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
              )}

              <h3 className="info-heading">Availability</h3>

              {isEditing ? (
                <textarea
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  placeholder="When are you available?"
                  rows={2}
                />
              ) : (
                <p>{availability}</p>
              )}
            </div>
          </section>

          <aside className="profile-right">
            <button
              type="button"
              className="edit-button"
              disabled={saving}
              onClick={() => {
                if (isEditing) {
                  saveProfile();
                } else {
                  setMessage("");
                  setIsEditing(true);
                }
              }}
            >
              {saving
                ? "Saving..."
                : isEditing
                ? "Done editing"
                : "Edit profile"}
            </button>

            {message && <p role="status">{message}</p>}

            <div className="profile-card preferences-card">
              <h3>Preferred categories</h3>

              {isEditing ? (
                <textarea
                  value={categories}
                  onChange={(e) => setCategories(e.target.value)}
                  placeholder="Enter preferred categories separated by commas"
                  rows={3}
                />
              ) : (
                <div className="skill-list">
                  {categories
                    .split(",")
                    .map((category) => category.trim())
                    .filter(Boolean)
                    .map((category, index) => (
                      <span key={index}>{category}</span>
                    ))}
                </div>
              )}

              <h3 className="info-heading">Availability</h3>
              <p>{availability}</p>

              <h3 className="info-heading">Location</h3>
              <p>{location}</p>
            </div>
          </aside>
        </div>
      </main>

      <footer className="nivra-footer">
        <strong>Nivra</strong> · Find work for a day. Build experience for
        tomorrow.
      </footer>
    </div>
  );
}
