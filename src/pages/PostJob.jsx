"use client";

import React, { useState } from "react";
import "../styles/EmployerDashboard.css";


export default function PostJob({ onSubmit, onCancel, employerName }) {
  const [form, setForm] = useState({
    title: "Event Assistant",
    category: "Event assistance",
    workers: "5",
    description: "Welcome guests, help with setup and pack-down.",
    skills: "Communication, punctuality",
    location: "Kozhikode",
    date: "2026-10-24",
    hours: "9:00 am – 5:00 pm",
    amount: "800",
    basis: "Per day",
  });
  const [preview, setPreview] = useState(false);

  function change(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  
async function publish() {
  const workers = Number(form.workers);
  const amount = Number(form.amount);

  if (
    !form.title.trim() ||
    !form.location.trim() ||
    !form.date ||
    !Number.isInteger(workers) ||
    workers < 1 ||
    !Number.isFinite(amount) ||
    amount <= 0
  ) {
    return;
  }

  try {
    await onSubmit?.({
      ...form,
      workers,
      amount,
      applicants: 0,
      status: "Active",
      filled: 0,
      salary: `₹${amount} ${form.basis.toLowerCase()}`,
    });

    setPreview(false);
  } catch (error) {
    console.error("Publishing failed:", error);
  }
}


  function field(label, name, placeholder = "", type = "text") {
    return (
      <label className="field-label" key={name}>
        {label}
        <input
          className="form-input"
          type={type}
          name={name}
          value={form[name]}
          onChange={change}
          placeholder={placeholder}
          min={type === "number" ? 1 : undefined}
          required
        />
      </label>
    );
  }

  return (
    <div className="post-job-page">
      <div className="post-job-heading">
        <h1>Post a job</h1>
        {onCancel && (
          <button type="button" className="button button-secondary" onClick={onCancel}>
            Back to dashboard
          </button>
        )}
      </div>

      <form onSubmit={(event) => { event.preventDefault(); setPreview(true); }}>
        <section className="panel form-section">
          <h2>1. Job basics</h2>
          {field("Job title", "title", "e.g. Event Assistant")}

          <div className="form-row">
            <label className="field-label">
              Category
              <select className="form-input" name="category" value={form.category} onChange={change}>
                <option>Event assistance</option>
                <option>Hospitality</option>
                <option>Retail</option>
                <option>Technology</option>
                <option>Marketing</option>
                <option>Education</option>
                <option>Other</option>
              </select>
            </label>
            {field("Workers needed", "workers", "", "number")}
          </div>

          <label className="field-label">
            Description and responsibilities
            <textarea className="form-input" name="description" rows={4} value={form.description} onChange={change} required />
          </label>

          <label className="field-label">
            Required skills
            <input className="form-input" name="skills" value={form.skills} onChange={change} placeholder="Separate skills with commas" />
            <small className="field-help">Separate with commas</small>
          </label>
        </section>

        <section className="panel form-section">
          <h2>2. Where and when</h2>
          {field("Work location", "location", "Enter location")}
          <div className="form-row">
            {field("Date", "date", "", "date")}
            {field("Working hours", "hours", "e.g. 9 am – 5 pm")}
          </div>
        </section>

        <section className="panel form-section">
          <h2>3. Pay</h2>
          <div className="form-row">
            {field("Amount (₹)", "amount", "", "number")}
            <label className="field-label">
              Payment basis
              <select className="form-input" name="basis" value={form.basis} onChange={change}>
                <option>Per day</option>
                <option>Per hour</option>
                <option>Per month</option>
                <option>Fixed amount</option>
              </select>
            </label>
          </div>
        </section>

        <div className="form-actions">
          <button type="submit" className="button button-secondary">Preview</button>
          <button type="submit" className="button button-primary">Publish job</button>
        </div>
      </form>

      {preview && (
        <div className="preview-overlay" onClick={() => setPreview(false)}>
          <section className="preview-modal reference-preview" role="dialog" aria-modal="true" aria-labelledby="job-preview-title" onClick={(event) => event.stopPropagation()}>
            <h2 id="job-preview-title">Preview</h2>
            <strong className="reference-job-title">{form.title}</strong>
           <p>{employerName || "Your business"} · {form.location}</p>
            <p>
              {new Date(`${form.date}T12:00:00`).toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" })}
              {" · "}{form.hours}{" · ₹"}{form.amount}
              {form.basis === "Per day" ? "/day" : `/${form.basis.toLowerCase()}`}
              {" · "}{form.workers} workers
            </p>
            <div className="reference-preview-actions">
              <button type="button" className="button button-primary" onClick={publish}>Publish</button>
              <button type="button" className="button button-secondary" onClick={() => setPreview(false)}>Edit</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}