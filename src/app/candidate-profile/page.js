
import CandidateProfile from "../../pages/CandidateProfile";

export default function CandidateProfilePage({ searchParams }) {
  const candidateId = searchParams?.id;
  const applicationId = searchParams?.applicationId;

  return (
    <CandidateProfile
      key={applicationId ?? "default"}
      candidateId={candidateId}
      applicationId={applicationId}
    />
  );
}
