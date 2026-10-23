
"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Building2, Mail, Phone, MapPin, Globe, Pencil, ShieldCheck } from "lucide-react";
import "../styles/global.css";
import { useState } from "react";

export default function EmployerProfile({
  onNavigate = (path) => window.location.assign(path),
}) {
  const [company, setCompany] = useState({
  name: "Malabar Events",
  industry: "Event management",
  size: "51–200 employees",
  website: "www.techflowsolutions.com",
  location: "Kozhikode, Kerala, India",
  contact: "Priya Raj, Hiring coordinator",
  email: "hello@malabarevents.example",
  phone: "+91 90000 00000",
  description:
    "Weddings, college fests and corporate events across North Kerala.",
  category: "Events",
  teamSize: "12",
});

const [isEditOpen, setIsEditOpen] = useState(false);
const [draft, setDraft] = useState(company);

const openEditModal = () => {
  setDraft({ ...company });
  setIsEditOpen(true);
};

const saveChanges = (event) => {
  event.preventDefault();
  setCompany({ ...draft });
  setIsEditOpen(false);
};

  return (
    <div className="nv employer-profile">
      <Navbar
        role="employer"
        active="/employer/profile"
        onNavigate={onNavigate}
      />

      <main className="w" style={{ paddingTop: 36 }}>
       

        <section
  className="box employer-company-header"
  
>
          <div className="row sp" style={{ alignItems: "center", flexWrap: "wrap" }}>
  <div className="row" style={{ gap: 6 }}>
    
<div className="employer-logo" aria-label="Malabar Events logo">
  ME
</div>


    <div>
      <h2 className="employer-company-name">{company.name}</h2>
<p className="mu">{company.industry} · {company.location}</p>
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
            <p>{company.description}</p>

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
              <h2>Verification</h2>
              <p>
              <span className="employer-verification-badge">
              Sample status: not verified
              </span>
              </p>
              <p className="mu employer-verification-note">
                This badge is demo content. Real verification will need
                 document checks once the backend exists.
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
              onChange={(e) =>
                setDraft({ ...draft, email: e.target.value })
              }
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
          >
            Cancel
          </button>

          <button type="submit" className="employer-save-btn">
            Save Changes
          </button>
        </div>
      </form>
    </section>
  </div>
)}
      <Footer/>
    </div>
  );
}
