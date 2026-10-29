// src/app/components/Navbar.jsx
// One navbar for every page. `role` picks which links to show, so students
// never see employer links and the other way round.
//
//   <Navbar role="public" onNavigate={navigate} />
//   <Navbar role="student" active="/saved" onNavigate={navigate} />
//   <Navbar role="employer" active="/employer/dashboard" onNavigate={navigate} />
//
// Must be rendered inside <div className="nv"> (see globals.css).

import Link from "next/link";

const LINKS = {
  public: [
    { label: "Find jobs", path: "/browsejobs" },
    { label: "For employers", path: "/login?role=employer&mode=signup" },
  ],
  student: [
    { label: "Browse jobs", path: "/browsejobs" },
    { label: "Saved", path: "/saved" },
    { label: "My applications", path: "/applications" },
    { label: "Dashboard", path: "/student/dashboard" },
    { label: "Profile", path: "/student/profile" },
  ],
  employer: [
    { label: "Dashboard", path: "/employer/dashboard" },
    { label: "Post a job", path: "/employer/post-job" },
    { label: "Applicants", path: "/employer/applicants" },
    { label: "Matching", path: "/employer/matching" },
    { label: "Plans", path: "/pricing" },
    { label: "Profile", path: "/employer/profile" },
  ],
};

export default function Navbar({
  role = "public",
  active = "",
  onNavigate,
}) {
  const links = LINKS[role] || LINKS.public;

  function handleNavigation(event, path) {
    if (onNavigate) {
      event.preventDefault();
      onNavigate(path);
    }
  }

  return (
    <nav className="top" aria-label="Main">
      <div className="w">
        <Link
          className="logo"
          href="/"
          onClick={(event) => handleNavigation(event, "/")}
        >
          Nivra<i />
        </Link>

        <div className="links">
          {links.map((l) => (
            <Link
              key={l.path}
              href={l.path}
              className={active === l.path ? "on" : ""}
              aria-current={active === l.path ? "page" : undefined}
              onClick={(event) => handleNavigation(event, l.path)}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {role === "public" ? (
          <>
            <Link
              className="btn s sm"
              href="/login?mode=login"
              onClick={(event) => handleNavigation(event, "/login?mode=login")}
            >
              Log in
            </Link>
            <Link
              className="btn sm"
              href="/login?mode=signup"
              onClick={(event) => handleNavigation(event, "/login?mode=signup")}
            >
              Sign up
            </Link>
          </>
        ) : (
          <>
            <span className="tag">{role === "student" ? "Student" : "Employer"}</span>
            <Link
              className="btn g sm"
              href="/"
              onClick={(event) => handleNavigation(event, "/")}
            >
              Log out
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
