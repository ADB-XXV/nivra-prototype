import { notFound } from "next/navigation";
import JOBS from "../../../data/jobs";
import JobsExperience from "../../../pages/JobsExperience";

export default function JobDetailsPage({ params, searchParams }) {
  const job = JOBS.find((item) => item.id === Number(params.id));
  const initialBackPath = searchParams.returnTo === "applications" ? "/applications" : "/browsejobs";

  if (!job) {
    notFound();
  }

  return <JobsExperience initialJobId={job.id} initialBackPath={initialBackPath} />;
}
