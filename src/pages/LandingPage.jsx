"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JOBS from "../data/jobs";

const CATEGORIES = ["Event assistance", "Catering", "Retail", "Tutoring", "Delivery", "Campus events", "Hospitality"];

const STEPS = [
  ["For students", ["Create a profile with your skills and free days.", "Search jobs by date, pay and location.", "Apply with a short note and track the status."]],
  ["For employers", ["Register your business.", "Post a job with date, hours and pay.", "Review applicants, then shortlist or accept."]],
];

function JobRow({ job, onView, saved, onToggleSave }) {
  return (
    <div className="jr">
      <div className="m">
        <b><a onClick={() => onView(job.id)}>{job.title}</a></b>
        <div className="mu">{job.company} · {job.location}</div>
        <div className="mu" style={{ fontSize: ".85rem" }}>{job.dateLabel} · {job.time} · {job.type}</div>
      </div>
      <div className="pay">₹{job.pay}<small>/day</small></div>
      {onToggleSave && (
        <button className="btn s sm" onClick={() => onToggleSave(job.id)}>{saved ? "★ Saved" : "☆ Save"}</button>
      )}
      <button className="btn sm" onClick={() => onView(job.id)}>View</button>
    </div>
  );
}

// onNavigate(path) can be passed by a client-side router; otherwise it reloads the page.
export default function LandingPage({ onNavigate = (p) => window.location.assign(p) }) {
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [saved, setSaved] = useState([6]);

  const viewJob = (id) => onNavigate(`/jobs/${id}`);
  const toggleSave = (id) => setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const search = (e) => {
    e.preventDefault();
    onNavigate(`/jobs?q=${encodeURIComponent(title)}&loc=${encodeURIComponent(city)}`);
  };

  return (
    <div className="nv">
      <Navbar role="public" onNavigate={onNavigate} />

      <main>
        <section className="w hero">
          <div>
            <h1>Find work for a day. Build experience for tomorrow.</h1>
            <p className="mu" style={{ fontSize: "1.05rem" }}>
              Nivra lists one-day and short-term jobs near you: events, catering, retail, tutoring and more.
              Employers post a job and review applicants in one place.
            </p>
            <form className="box" style={{ padding: 14 }} onSubmit={search}>
              <div className="f2">
                <div>
                  <label htmlFor="hero-title" style={{ marginTop: 0 }}>Job title</label>
                  <input id="hero-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Event Assistant" />
                </div>
                <div>
                  <label htmlFor="hero-city" style={{ marginTop: 0 }}>Location</label>
                  <input id="hero-city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Kozhikode" />
                </div>
              </div>
              <div className="row" style={{ marginTop: 12 }}>
                <button type="submit" className="btn">Search jobs</button>
                <button type="button" className="btn s" onClick={() => onNavigate("/login?role=employer&mode=signup")}>Hire workers</button>
                <button type="button" className="btn g" onClick={() => onNavigate("/jobs")}>Find jobs →</button>
              </div>
            </form>
          </div>
          <div className="box">
            <h3>Sample openings this week</h3>
            {JOBS.slice(0, 3).map((j) => <JobRow key={j.id} job={j} onView={viewJob} />)}
          </div>
        </section>

        <section className="w">
          <h2>Browse by category</h2>
          {CATEGORIES.map((c) => (
            <button key={c} className="ch" onClick={() => onNavigate(`/jobs?category=${encodeURIComponent(c)}`)}>{c}</button>
          ))}
        </section>

        <section className="w" style={{ marginTop: 28 }}>
          <h2>Featured jobs</h2>
          <div className="box" style={{ padding: "4px 20px" }}>
            {JOBS.slice(3).map((j) => (
              <JobRow key={j.id} job={j} onView={viewJob} saved={saved.includes(j.id)} onToggleSave={toggleSave} />
            ))}
          </div>
        </section>

        <section className="w" style={{ marginTop: 36 }}>
          <h2>How it works</h2>
          <div className="e2">
            {STEPS.map(([heading, steps]) => (
              <div className="box" key={heading}>
                <h3>{heading}</h3>
                {steps.map((s, i) => <div className="step" key={s}><b>{i + 1}</b>{s}</div>)}
              </div>
            ))}
          </div>
        </section>

        <section className="band">
          <div className="w row sp">
            <div style={{ maxWidth: 620 }}>
              <h2>Premium for employers</h2>
              <p>Advanced candidate filters, side-by-side comparison, matching insights and help with bulk hiring. Illustrative prototype price: ₹699/month.</p>
            </div>
            <button className="btn" onClick={() => onNavigate("/pricing")}>See plans</button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}