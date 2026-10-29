"use client";

import { useRouter } from "next/navigation";

const NAV = [
  ["Browse jobs", "/browsejobs"],
  ["Saved", "/saved"],
  ["My applications", "/applications"],
  ["Dashboard", "/student/dashboard"],
  ["Profile", "/student/profile"],
];

const CSS = `
.nv-header {
  width: 100%;
  height: 56px;
  position: sticky;
  top: 0;
  z-index: 5;
  background: #fff;
  border-bottom: 1px solid #e6dcd6;
  font-family: "DM Sans", system-ui, sans-serif;
}
.nv-header-inner {
  height: 56px; max-width: 1080px; margin: 0 auto; padding: 0 20px;
  display: flex; align-items: center; gap: 20px;
}
.nv-logo { font-size: 1.25rem; font-weight: 700; margin-right: 0; letter-spacing: -.02em; }
.nv-logo-dot {
  display: inline-block; width: 8px; height: 8px; border-radius: 50%;
  background: #c99a9a; margin-left: 2px;
}
.nv-nav { display: flex; gap: 2px; flex: 1; overflow-x: auto; flex-wrap: nowrap; }
.nv-nav a {
  padding: 6px 10px; border-radius: 6px; color: #7b6b6e;
  text-decoration: none; font-size: 15px; font-weight: 500; white-space: nowrap;
}
.nv-nav a.active { background: #f4e3e1; color: #2d2124; }
.nv-right { display: flex; align-items: center; gap: 8px; }
.nv-role {
  background: #e9efe3; color: #56694b; font-weight: 700; font-size: .72rem;
  padding: 2px 8px; border-radius: 4px; white-space: nowrap;
}
.nv-logout { padding: 5px 10px; border-radius: 6px; color: #2d2124; text-decoration: none; font-size: .85rem; }
@media (max-width: 760px) {
  .nv-header { height: auto; }
  .nv-header-inner { height: auto; min-height: 56px; gap: 10px; }
  .nv-header-inner { flex-wrap: wrap; }
  .nv-nav { order: 3; width: 100%; flex-basis: 100%; }
}
`;

export default function StudentNavbar({ active }) {
  const router = useRouter();

  function navigate(event, path) {
    event.preventDefault();
    router.push(path);
  }

  return (
    <>
      <style>{CSS}</style>
      <header className="nv-header">
        <div className="nv-header-inner">
          <span className="nv-logo">
            Nivra<span className="nv-logo-dot" />
          </span>
          <nav className="nv-nav" aria-label="Main">
            {NAV.map(([item, path]) => (
              <a
                key={path}
                href={path}
                className={path === active ? "active" : ""}
                aria-current={path === active ? "page" : undefined}
                onClick={(event) => navigate(event, path)}
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="nv-right">
            <span className="nv-role">Student</span>
            <a href="/" className="nv-logout" onClick={(event) => navigate(event, "/")}>
              Log out
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
