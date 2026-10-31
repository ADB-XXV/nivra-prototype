
"use client";

import EmployerNavbar from "../components/EmployerNavbar";
import Footer from "../components/Footer";
import { Pencil } from "lucide-react";
import "../styles/global.css";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function EmployerProfile() {
  const [company, setCompany] = useState({
    name: "",
    industry: "",
    size: "",
    website: "",
    location: "",
    contact: "",
    email: "",
    phone: "",
    description: "",
    category: "",
    teamSize: "",
  });

  const [draft, setDraft] = useState(company);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

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
      setMessage("Could not load profile: " + error.message);
      setLoading(false);
      return;
    }

    if (data.role !== "employer") {
      setMessage("This page is only available to employer accounts.");
      setLoading(false);
      return;
    }

    const profile = {
      name: data.business || "",
      industry: data.industry || "",
      size: data.company_size || "",
      website: data.website || "",
      location: data.city || "",
      contact: data.contact_person || "",
      email: user.email || "",
      phone: data.phone || "",
      description: data.description || "",
      category: data.business_category || "",
      teamSize: data.team_size || "",
    };

    setCompany(profile);
    setDraft(profile);
    setLoading(false);
  }

  function openEditModal() {
    setDraft({ ...company });
    setMessage("");
    setIsEditOpen(true);
  }

  async function saveChanges(event) {
    event.preventDefault();

    if (!userId) return;

    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("profiles")
      .update({
        business: draft.name,
        industry: draft.industry,
        company_size: draft.size,
        website: draft.website,
        city: draft.location,
        contact_person: draft.contact,
        phone: draft.phone,
        description: draft.description,
        business_category: draft.category,
        team_size: draft.teamSize,
      })
      .eq("id", userId);

    if (error) {
      setMessage("Could not save changes: " + error.message);
      setSaving(false);
      return;
    }

    setCompany({ ...draft });
    setIsEditOpen(false);
    setMessage("Company profile updated successfully!");
    setSaving(false);
  }

  if (loading) {
    return <div className="nv employer-profile">Loading profile...</div>;
  }

  if (!userId) {
    return <div className="nv employer-profile">{message}</div>;
  }

  return (
    <div className="nv employer-profile">
      <EmployerNavbar active="/employer/profile" />

      <main className="w" style={{ paddingTop: 36 }}>
        {message && (
          <p role="status" style={{ marginBottom: 16 }}>
            {message}
          </p>
        )}

        <section className="box employer-company-header">
          <div className="row sp" style={{ alignItems: "center", flexWrap: "wrap" }}>
            <div className="row" style={{ gap: 6 }}>
              <div className="employer-logo" aria-label="Company logo">
                {company.name
                  .split(/\s+/)
                  .filter(Boolean)
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>

              <div>
                <h2 className="employer-company-name">
                  {company.name || "Company name"}
                </h2>
                <p className="mu">
                  {company.industry} · {company.location}
                </p>
              </div>
            </div>

            <button
              className="btn"
              type="button"
              onClick={openEditModal}
            >
              <Pencil size={16} style={{ marginRight: 8, verticalAlign: "middle" }} />
              Edit Profile
            </button>
          </div>
        </section>

        <div className="e2">
          <section className="box employer-profile-card">
            <h2>About</h2>
            <p>{company.description || "No company description added yet."}</p>

            <h2 className="employer-section-heading">Contact</h2>

            <div className="contact-details">
              <p>{company.contact}</p>
              <p>{company.email}</p>
              <p>{company.phone}</p>
            </div>
          </section>

          <div>
            <section className="box employer-profile-card">
              <h2>Business details</h2>
              <p>Category: {company.category}</p>
              <p>City: {company.location}</p>
              <p>Team size: {company.teamSize}</p>
              <p>Company size: {company.size}</p>
              <p>Website: {company.website}</p>

              <h2>Verification</h2>
              <p>
                <span className="employer-verification-badge">
                  Not verified
                </span>
              </p>
              <p className="mu employer-verification-note">
                Company verification will be available after document checks
                are implemented.
              </p>
            </section>
          </div>
        </div>
      </main>

      {isEditOpen && (
        <div
          className="employer-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsEditOpen(false);
            }
          }}
        >
          <section
            className="employer-edit-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
          >
            <div className="employer-modal-header">
              <div>
                <h2 id="edit-profile-title">Edit Profile</h2>
                <p>Update your company information</p>
              </div>

              <button
                type="button"
                className="employer-modal-close"
                onClick={() => setIsEditOpen(false)}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            <form onSubmit={saveChanges}>
              <div className="employer-edit-grid">
                <label>
                  Company name
                  <input
                    required
                    value={draft.name}
                    onChange={(e) =>
                      setDraft({ ...draft, name: e.target.value })
                    }
                  />
                </label>

                <label>
                  Industry
                  <input
                    required
                    value={draft.industry}
                    onChange={(e) =>
                      setDraft({ ...draft, industry: e.target.value })
                    }
                  />
                </label>

                <label className="employer-field-full">
                  About the company
                  <textarea
                    rows={3}
                    value={draft.description}
                    onChange={(e) =>
                      setDraft({ ...draft, description: e.target.value })
                    }
                  />
                </label>

                <label>
                  Category
                  <input
                    value={draft.category}
                    onChange={(e) =>
                      setDraft({ ...draft, category: e.target.value })
                    }
                  />
                </label>

                <label>
                  Team size
                  <input
                    value={draft.teamSize}
                    onChange={(e) =>
                      setDraft({ ...draft, teamSize: e.target.value })
                    }
                  />
                </label>

                <label>
                  Company size
                  <input
                    value={draft.size}
                    onChange={(e) =>
                      setDraft({ ...draft, size: e.target.value })
                    }
                  />
                </label>

                <label>
                  Website
                  <input
                    value={draft.website}
                    onChange={(e) =>
                      setDraft({ ...draft, website: e.target.value })
                    }
                  />
                </label>

                <label className="employer-field-full">
                  Location
                  <input
                    value={draft.location}
                    onChange={(e) =>
                      setDraft({ ...draft, location: e.target.value })
                    }
                  />
                </label>

                <label>
                  Contact person
                  <input
                    value={draft.contact}
                    onChange={(e) =>
                      setDraft({ ...draft, contact: e.target.value })
                    }
                  />
                </label>

                <label>
                  Company email
                  <input
                    type="email"
                    value={draft.email}
                    disabled
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
                  />
                </label>
              </div>

              <div className="employer-modal-actions">
                <button
                  type="button"
                  className="employer-cancel-btn"
                  onClick={() => setIsEditOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="employer-save-btn"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      <Footer />
    </div>
  );
}
