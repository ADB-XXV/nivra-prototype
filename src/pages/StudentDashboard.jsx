"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import StudentNavbar from "../components/StudentNavbar";

// Sample data only. Same applications as the My Applications page.
const RECENT = [
  { id: 1, title: "Event Assistant", employer: "Malabar Events", city: "Kozhikode", applied: "16 Oct", status: "Under Review" },
  { id: 2, title: "Catering Helper", employer: "Spice Route Caterers", city: "Kochi", applied: "12 Oct", status: "Accepted" },
  { id: 4, title: "Campus Event Crew", employer: "Aarambh Fest Team", city: "Kozhikode", applied: "14 Oct", status: "Shortlisted" },
];

const UPCOMING = { title: "Catering Helper", employer: "Spice Route Caterers", city: "Kochi", date: "Sun, 25 Oct", hours: "11:00 am – 4:00 pm", pay: 700 };

// Status badge colours live here so this page works with only globals.css.
// Move into globals.css when other pages need them.
const css = `
.nv .sd-head{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap}
.nv .sd-head h1{font-size:1.8rem;margin:0 0 4px}
.nv .sd-stats{display:flex;gap:40px;flex-wrap:wrap;margin:20px 0 24px}
.nv .sd-stats b{display:block;font-size:1.8rem;line-height:1.2}
.nv .sd-grid{display:grid;grid-template-columns:1.6fr 1fr;gap:24px;align-items:start}
.nv .sd-link{color:var(--sd);font-weight:500;text-decoration:none}
.nv .sd-link:hover{text-decoration:underline}
.nv .bd{font-size:.76rem;font-weight:700;padding:2px 9px;border-radius:4px;white-space:nowrap;background:var(--ln)}
.nv .bd.under-review{background:var(--tl)}
.nv .bd.shortlisted{background:var(--sl);color:var(--sd)}
.nv .bd.accepted{background:var(--sd);color:var(--bg)}
@media(max-width:760px){.nv .sd-grid{grid-template-columns:1fr}.nv .sd-stats{gap:24px}}
`;

const statusClass = (s) => s.toLowerCase().replace(" ", "-");

export default function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      const { data: { user }, error: authError } =
        await supabase.auth.getUser();

      if (authError || !user) {
        window.location.replace("/login?mode=login");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", user.id)
        .single();

      if (!active) return;

      if (error) {
        setProfileError("Could not load your profile. Please try again.");
        setLoading(false);
        return;
      }

      if (data.role !== "student") {
        window.location.replace("/employer/dashboard");
        return;
      }

      setProfile(data);
      setLoading(false);
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="nv">
      <style>{css}</style>
      <StudentNavbar active="/student/dashboard" />

      <main className="w" style={{ padding: "28px 20px 8px" }}>
        {/* Welcome */}
        <section className="sd-head">
          <div>
            <h1>
  {loading
    ? "Loading your dashboard..."
    : `Welcome back, ${profile?.full_name || "there"}`}
</h1>
{profileError && (
  <p role="alert" className="mu">{profileError}</p>
)}
            <p className="mu" style={{ margin: 0 }}>Here’s what’s happening with your job search.</p>
          </div>
          <div className="row">
            <a className="btn" href="/browsejobs">Browse jobs</a>
            <a className="btn s" href="/studentprofile">Edit profile</a>
          </div>
        </section>

        {/* Summary */}
        <section className="sd-stats" aria-label="Summary">
          <div><b>3</b><span className="mu">active applications</span></div>
          <div><b>1</b><span className="mu">upcoming job</span></div>
          <div><b>3</b><span className="mu">saved jobs</span></div>
        </section>

        <div className="sd-grid">
          {/* Recent applications */}
          <section className="box">
            <div className="row sp">
              <h3 style={{ margin: 0 }}>Recently applied</h3>
              <a className="sd-link" href="/applications">Application history →</a>
            </div>
            {RECENT.map((a) => (
              <div className="jr" key={a.id}>
                <div className="m">
                  <b>{a.title}</b>
                  <div className="mu">{a.employer} · {a.city}</div>
                  <div className="mu" style={{ fontSize: ".85rem" }}>Applied {a.applied}</div>
                </div>
                <span className={`bd ${statusClass(a.status)}`}>{a.status}</span>
              </div>
            ))}
          </section>

          {/* Right column */}
          <aside>
            <section className="box">
              <h3>Upcoming work</h3>
              <b>{UPCOMING.title}</b>
              <div className="mu">{UPCOMING.employer} · {UPCOMING.city}</div>
              <div className="mu" style={{ margin: "4px 0 14px" }}>
                {UPCOMING.date} · {UPCOMING.hours} · ₹{UPCOMING.pay}/day
              </div>
              <a className="btn s sm" href="/browsejobs">View job details</a>
            </section>

            <section className="box" style={{ marginTop: 14 }}>
              <div className="row sp">
                <h3 style={{ margin: 0 }}>Saved jobs</h3>
                <a className="sd-link" href="/savedjobs">View all →</a>
              </div>
              <p className="mu" style={{ margin: "6px 0 0" }}>3 jobs saved for later.</p>
            </section>
          </aside>
        </div>
      </main>

    </div>
  );
}