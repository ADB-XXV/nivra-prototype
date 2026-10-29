import PostJob from "../../../pages/PostJob";
import EmployerNavbar from "../../../components/EmployerNavbar";

export default function EmployerPostJobPage() {
  return (
    <div className="employer-page">
      <EmployerNavbar active="/employer/post-job" />
      <main className="employer-main">
        <div className="form-page">
          <PostJob />
        </div>
      </main>
    </div>
  );
}
