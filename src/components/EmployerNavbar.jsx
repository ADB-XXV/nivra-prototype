"use client";

import Link from "next/link";

const LINKS = [
  { label: "Dashboard", path: "/employer/dashboard" },
  { label: "Post a job", path: "/employer/post-job" },
  { label: "Applicants", path: "/employer/applicants" },
  { label: "Matching", path: "/employer/matching" },
  { label: "Plans", path: "/pricing" },
  { label: "Profile", path: "/employer/profile" },
];

const CSS = `
.employer-nav {
  width: 100%;
  height: 56px;
  background: #fff;
  border-bottom: 1px solid #e7ddd3;
  position: sticky;
  top: 0;
  z-index: 5;
  font-family: "DM Sans", system-ui, sans-serif;
}
.employer-nav-inner {
  max-width: 1080px;
  height: 56px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 20px;
}
.employer-nav-logo {
  font-weight: 700;
  font-size: 1.25rem;
  color: #593c42;
  text-decoration: none;
  letter-spacing: -.02em;
}
.employer-nav-logo i {
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-left: 2px;
  border-radius: 50%;
  background: #d6a5a5;
}
.employer-nav-links {
  display: flex;
  flex: 1;
  gap: 2px;
  overflow-x: auto;
}
.employer-nav-links a {
  padding: 6px 10px;
  border-radius: 6px;
  color: #7b6b6e;
  font-weight: 500;
  white-space: nowrap;
  text-decoration: none;
}
.employer-nav-links a.on {
  background: #f4e3e1;
  color: #2d2124;
}
.employer-nav-role {
  padding: 2px 8px;
  border-radius: 4px;
  background: #e9efe3;
  color: #56694b;
  font-size: .72rem;
  font-weight: 700;
  white-space: nowrap;
}
.employer-nav-logout {
  padding: 5px 10px;
  border-radius: 6px;
  background: transparent;
  color: #2d2124;
  font-size: .85rem;
  text-decoration: none;
}
@media (max-width: 760px) {
  .employer-nav-inner { gap: 10px; }
}
`;

export default function EmployerNavbar({ active = "" }) {
  return (
    <>
      <style>{CSS}</style>
      <nav className="employer-nav" aria-label="Main employer navigation">
      <div className="employer-nav-inner">
        <Link className="employer-nav-logo" href="/">
          Nivra<i />
        </Link>
        <div className="employer-nav-links">
          {LINKS.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={active === link.path ? "on" : ""}
              aria-current={active === link.path ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <span className="employer-nav-role">Employer</span>
        <Link className="employer-nav-logout" href="/">
          Log out
        </Link>
      </div>
    </nav>
    </>
  );
}
