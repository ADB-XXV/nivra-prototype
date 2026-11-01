import JobsExperience from "../../pages/JobsExperience";

export default async function BrowseJobsPage({ searchParams }) {
  const query = await searchParams;

  return (
    <JobsExperience
      publicView={query?.from === "landing"}
      initialSearch={query?.q || query?.category || ""}
      initialLocation={query?.loc || ""}
    />
  );
}
