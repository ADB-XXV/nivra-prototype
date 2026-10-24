"use client";

import React, { useState } from "react";
import styles from "./EmployerDashboard.module.css";

export default function PostJob({ onSubmit, onCancel }) {
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
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  function publish(event) {
    event.preventDefault();

    onSubmit?.({
      ...form,
      workers: Number(form.workers),
      applicants: 0,
      status: "Active",
      filled: `0 of ${form.workers}`,
      date: form.date,
      salary: `₹${form.amount} ${form.basis.toLowerCase()}`,
    });
  }

  function field(label, name, placeholder = "", type = "text") {
    return (
      <label className={styles.fieldLabel}>
        {label}
        <input
          className={styles.input}
          type={type}
          name={name}
          value={form[name]}
          onChange={change}
          placeholder={placeholder}
          required
        />
      </label>
    );
  }

  return (
    <div style={{ maxWidth: 620, margin: "0 auto" }}>
      <h2 style={{ fontSize: 21, marginBottom: 8 }}>Post a job</h2>

      <form onSubmit={publish}>
        <section className={styles.card}>
          <h3>1. Job basics</h3>

          {field("Job title", "title", "Enter job title")}

          <div className={styles.formGrid}>
            <label className={styles.fieldLabel}>
              Category
              <select
                className={styles.input}
                name="category"
                value={form.category}
                onChange={change}
              >
                <option>Event assistance</option>
                <option>Hospitality</option>
                <option>Technology</option>
                <option>Marketing</option>
                <option>Retail</option>
                <option>Education</option>
                <option>Other</option>
              </select>
            </label>

            {field("Workers needed", "workers", "", "number")}
          </div>

          <label className={styles.fieldLabel}>
            Description and responsibilities
            <textarea
              className={styles.input}
              name="description"
              value={form.description}
              onChange={change}
              rows={4}
              required
              style={{ resize: "vertical" }}
            />
          </label>

          <label className={styles.fieldLabel}>
            Required skills
            <input
              className={styles.input}
              name="skills"
              value={form.skills}
              onChange={change}
              placeholder="Separate skills with commas"
            />
            <small style={{ color: "#8a7a7d", fontWeight: 400 }}>
              Separate with commas
            </small>
          </label>
        </section>

        <section className={styles.card}>
          <h3>2. Where and when</h3>

          {field("Work location", "location", "Enter location")}

          <div className={styles.formGrid}>
            {field("Date", "date", "", "date")}
            {field("Working hours", "hours", "e.g. 9 am – 5 pm")}
          </div>
        </section>

        <section className={styles.card}>
          <h3>3. Pay</h3>

          <div className={styles.formGrid}>
            {field("Amount (₹)", "amount", "", "number")}

            <label className={styles.fieldLabel}>
              Payment basis
              <select
                className={styles.input}
                name="basis"
                value={form.basis}
                onChange={change}
              >
                <option>Per hour</option>
                <option>Per day</option>
                <option>Per month</option>
                <option>Fixed amount</option>
              </select>
            </label>
          </div>
        </section>

        {preview && (
          <section className={styles.card}>
            <h3>Job preview</h3>
            <h2>{form.title}</h2>
            <p>{form.category} · {form.location}</p>
            <p>{form.description}</p>
            <p>Workers needed: {form.workers}</p>
            <p>Skills: {form.skills}</p>
            <p>{form.date} · {form.hours}</p>
            <p>₹{form.amount} · {form.basis}</p>
          </section>
        )}

        <div className={styles.formActions}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => setPreview(!preview)}
          >
            {preview ? "Hide preview" : "Preview"}
          </button>

          <button type="submit" className={styles.primaryButton}>
            Publish job
          </button>

          {onCancel && (
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}