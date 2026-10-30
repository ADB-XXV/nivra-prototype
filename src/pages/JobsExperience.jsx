
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import BrowseJobs from "./BrowseJobs";
import JobDetails from "./JobDetails";

function convertJob(job) {
  return {
    ...job,
    id: job.id,
    company: job.employer?.business || job.employer?.full_name || "Employer",
    city: job.location,
    when: job.date
      ? new Date(`${job.date}T12:00:00`).toLocaleDateString("en-GB", {
          weekday: "short",
          day: "2-digit",
          month: "short",
        })
      : "Date not set",
    dateLabel: job.date
      ? new Date(`${job.date}T12:00:00`).toLocaleDateString("en-GB", {
          weekday: "short",
          day: "2-digit",
          month: "short",
        })
      : "Date not set",
    time: job.hours || "Hours not specified",
    pay: Number(job.amount),
    about: job.description,
    resp: [job.description],
    skills: job.skills || "Not specified",
    elig: "Check job requirements with the employer",
    workers: Number(job.workers),
    category: job.category,
  };
}

export default function JobsExperience({
  initialJobId = null,
  initialBackPath = "/browsejobs",
}) {
  const router = useRouter();

  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadJobs() {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.replace("/login?mode=login");
        return;
      }

      if (!active) return;

      setUserId(user.id);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Could not load profile:", profileError);
      }

      if (profile?.role === "student") {
        const { data: savedData, error: savedError } = await supabase
          .from("saved_jobs")
          .select("job_id")
          .eq("student_id", user.id);

        if (savedError) {
          console.error("Could not load saved jobs:", savedError);
        } else if (active) {
          setSavedJobs((savedData || []).map((item) => item.job_id));
        }
      }

      const { data, error: jobsError } = await supabase
        .from("jobs")
        .select(`
          *,
          employer:profiles!jobs_employer_id_fkey (
            business,
            full_name
          )
        `)
        .eq("status", "Active")
        .order("created_at", { ascending: false });

      if (!active) return;

      if (jobsError) {
        console.error("Error loading jobs:", jobsError);
        setError("Could not load jobs. Please try again.");
      } else {
        setJobs((data || []).map(convertJob));
      }

      setLoading(false);
    }

    loadJobs();

    return () => {
      active = false;
    };
  }, [router]);

  async function toggleSaved(jobId) {
    if (!userId) return;

    setSaveError("");

    const isSaved = savedJobs.includes(jobId);

    if (isSaved) {
      const { error: deleteError } = await supabase
        .from("saved_jobs")
        .delete()
        .eq("student_id", userId)
        .eq("job_id", jobId);

      if (deleteError) {
        console.error("Could not remove saved job:", deleteError);
        setSaveError("Could not remove this saved job.");
        return;
      }

      setSavedJobs((previous) =>
        previous.filter((id) => id !== jobId)
      );
    } else {
      const { error: insertError } = await supabase
        .from("saved_jobs")
        .insert({
          student_id: userId,
          job_id: jobId,
        });

      if (insertError && insertError.code !== "23505") {
        console.error("Could not save job:", insertError);
        setSaveError("Could not save this job. Please try again.");
        return;
      }

      setSavedJobs((previous) =>
        previous.includes(jobId) ? previous : [...previous, jobId]
      );
    }
  }

  function goBackToJobs() {
    router.push(initialBackPath);
  }

  const selectedJob = initialJobId
    ? jobs.find((job) => String(job.id) === String(initialJobId))
    : null;

  if (loading) {
    return <div className="nv">Loading jobs...</div>;
  }

  if (error) {
    return (
      <div className="nv">
        <p role="alert">{error}</p>
        <button onClick={() => window.location.reload()}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="nv">
      {selectedJob ? (
        <JobDetails
          job={selectedJob}
          onBack={goBackToJobs}
          backHref={initialBackPath}
          savedJobs={savedJobs}
          toggleSaved={toggleSaved}
          appliedJobs={appliedJobs}
          setAppliedJobs={setAppliedJobs}
        />
      ) : (
        <BrowseJobs
          jobs={jobs}
          onView={(job) => router.push(`/jobdetails/${job.id}`)}
          savedJobs={savedJobs}
          toggleSaved={toggleSaved}
          activeTab="Browse jobs"
          saveError={saveError}
        />
      )}
    </div>
  );
}
