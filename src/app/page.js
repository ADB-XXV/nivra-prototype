"use client";

import { useState } from "react";
import MyApplications from "../pages/MyApplications";
import SavedJobs from "../pages/SavedJobs";

export default function Page() {
  const [view, setView] = useState("My applications");

  // Nav clicks from either page land here. Only these two pages exist so far;
  // other tabs (Browse jobs, Dashboard, Profile) are ignored until you build them.
  const handleNavigate = (item) => {
    if (item === "Saved" || item === "My applications") setView(item);
  };

  return view === "Saved" ? (
    <SavedJobs onNavigate={handleNavigate} />
  ) : (
    <MyApplications onNavigate={handleNavigate} />
  );
}