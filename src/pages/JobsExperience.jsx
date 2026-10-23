"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import JOBS from "../data/jobs";
import BrowseJobs from "./BrowseJobs";
import JobDetails from "./JobDetails";

function JobsExperience({ initialJobId = null }) {
  const router = useRouter();
  const initialJob = JOBS.find((job) => job.id === Number(initialJobId));
  const selectedJob = initialJob || null;
  const [savedJobs, setSavedJobs] = useState([6]);
  const [appliedJobs, setAppliedJobs] = useState([]);

  function toggleSaved(jobId) {
    setSavedJobs((previous) =>
      previous.includes(jobId)
        ? previous.filter((id) => id !== jobId)
        : [...previous, jobId]
    );
  }

  function goBackToJobs() {
    router.push("/jobs");
  }

  return (
    <div className="nv">
      {selectedJob ? (
        <JobDetails
          job={selectedJob}
          onBack={goBackToJobs}
          savedJobs={savedJobs}
          toggleSaved={toggleSaved}
          appliedJobs={appliedJobs}
          setAppliedJobs={setAppliedJobs}
        />
      ) : (
        <BrowseJobs
          jobs={JOBS}
          onView={(job) => router.push(`/jobs/${job.id}`)}
          savedJobs={savedJobs}
          toggleSaved={toggleSaved}
          activeTab="Browse jobs"
        />
      )}
    </div>
  );
}

export default JobsExperience;