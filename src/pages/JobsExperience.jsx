"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import JOBS from "../data/jobs";
import BrowseJobs from "./BrowseJobs";
import JobDetails from "./JobDetails";

function JobsExperience({ initialJobId = null }) {
  const router = useRouter();
  const initialJob = JOBS.find((job) => job.id === Number(initialJobId));
  const [selectedJob, setSelectedJob] = useState(initialJob || null);
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
    if (initialJob) {
      router.push("/jobs");
      return;
    }

    setSelectedJob(null);
  }

  return (
    <div className="nv">
      <Navbar role="public" active="/jobs" />
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
          onView={setSelectedJob}
          savedJobs={savedJobs}
          toggleSaved={toggleSaved}
          activeTab="Browse jobs"
        />
      )}
      <Footer />
    </div>
  );
}

export default JobsExperience;