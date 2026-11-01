
import JobsExperience from "../../../pages/JobsExperience";

export default async function JobDetailsPage({ params, searchParams }) {
  const { id } = await params;
  const query = await searchParams;

  const initialBackPath =
    query?.returnTo === "applications"
      ? "/applications"
      : query?.from === "landing"
        ? "/"
      : "/browsejobs";

  return (
    <JobsExperience
      initialJobId={id}
      initialBackPath={initialBackPath}
      publicView={query?.from === "landing"}
    />
  );
}
