import CandidateProfile from "../../pages/CandidateProfile";

export default function CandidateProfilePage({ searchParams }) {
  const candidateId = searchParams?.id;
  return (
    <CandidateProfile
      key={candidateId ?? "default"}
      candidateId={candidateId}
    />
  );
}
