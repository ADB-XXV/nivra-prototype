
"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Building2, Mail, Phone, MapPin, Globe, Pencil, ShieldCheck } from "lucide-react";
import "../styles/global.css";

export default function EmployerProfile({
  onNavigate = (path) => window.location.assign(path),
}) {
  const company = {
    name: "Malabar Events",
    industry: "Event management",
    size: "51–200 employees",
    website: "www.techflowsolutions.com",
    location: "Kochi, Kerala, India",
    contact: "Priya Raj, Hiring coordinator",
    email: "hello@malabarevents.example",
    phone: "+91 90000 00000",
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
      <p className="mu">{company.industry} · Kozhikode</p>
    </div>
  </div>

  <button
    className="btn"
    type="button"
    onClick={() => alert("Edit Profile is not implemented yet.")}
  >
    <Pencil size={16} style={{ marginRight: 8, verticalAlign: "middle" }} />
    Edit Profile
  </button>
</div>
          
        </section>

        <div className="e2">
          <section className="box employer-profile-card">
            <h2>About</h2>
            <label>Weddings,collge fests and corporate events across north kerala. Sample business description</label>

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
              <p>Category: Events</p>
              <p>City: Kozhikode</p>
              <p>Team size: 12</p>
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

      <Footer/>
    </div>
  );
}
