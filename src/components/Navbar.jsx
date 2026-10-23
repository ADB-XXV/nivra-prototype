// src/app/components/Navbar.jsx
// One navbar for every page. `role` picks which links to show, so students
// never see employer links and the other way round.
//
//   <Navbar role="public" onNavigate={navigate} />
//   <Navbar role="student" active="/saved" onNavigate={navigate} />
//   <Navbar role="employer" active="/employer/dashboard" onNavigate={navigate} />
//
// Must be rendered inside <div className="nv"> (see globals.css).

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
    { label: "Staffing", path: "/employer/staffing" },
    { label: "Plans", path: "/pricing" },
    { label: "Profile", path: "/employer/profile" },
  ],
};

export default function Navbar({
  role = "public",
  active = "",
  onNavigate = (p) => window.location.assign(p),
}) {
  const links = LINKS[role] || LINKS.public;

  return (
    <nav className="top" aria-label="Main">
      <div className="w">
        <button className="logo" onClick={() => onNavigate("/")}>
          Nivra<i />
        </button>

        <div className="links">
          {links.map((l) => (
            <a
              key={l.path}
              className={active === l.path ? "on" : ""}
              aria-current={active === l.path ? "page" : undefined}
              onClick={() => onNavigate(l.path)}
            >
              {l.label}
            </a>
          ))}
        </div>

        {role === "public" ? (
          <>
            <button className="btn s sm" onClick={() => onNavigate("/login?mode=login")}>Log in</button>
            <button className="btn sm" onClick={() => onNavigate("/login?mode=signup")}>Sign up</button>
          </>
        ) : (
          <>
            <span className="tag">{role === "student" ? "Student" : "Employer"}</span>
            <button className="btn g sm" onClick={() => onNavigate("/")}>Log out</button>
          </>
        )}
      </div>
    </nav>
  );
}