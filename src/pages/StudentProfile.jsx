"use client";

import React, { useState } from "react";
import "../styles/StudentProfile.css";
import StudentNavbar from "../components/StudentNavbar";

export default function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState("Anjali Nair");

  const [education, setEducation] = useState(
    "B.Com, 2nd year - St. Joseph's College, Devagiri"
  );

  const [skills, setSkills] = useState(
    "Registration desk, Crowd handling, Billing, Hindi, Malayalam, English"
  );

  const [experience, setExperience] = useState(
    "Volunteer, Aarambh Fest 2025; Registration desk, 2 days\nRetail assistant, Mini Mart; Weekends, 2 months"
  );

  const [categories, setCategories] = useState(
    "Event assistance, Campus events, Retail"
  );

  const [availability, setAvailability] = useState(
    "Weekends and college holidays, Weekdays after 4 pm"
  );

  const [location, setLocation] = useState(
    "Kozhikode (up to 15 km)"
  );

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
              onClick={() => setIsEditing((previous) => !previous)}
            >
              {isEditing ? "Done editing" : "Edit profile"}
            </button>

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