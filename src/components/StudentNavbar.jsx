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
  height: 56px;
  position: sticky;
  top: 0;
  z-index: 5;
  background: #fff;
  border-bottom: 1px solid #e6dcd6;
}
.nv-header-inner {
  height: 55px; max-width: 1160px; margin: 0 auto; padding: 0 24px;
  display: flex; align-items: center; gap: 8px;
}
.nv-logo { font-size: 20px; font-weight: 700; margin-right: 18px; letter-spacing: .2px; }
.nv-logo-dot {
  display: inline-block; width: 8px; height: 8px; border-radius: 50%;
  background: #c99a9a; margin-left: 2px;
}
.nv-nav { display: flex; gap: 4px; flex: 1; flex-wrap: wrap; }
.nv-nav a {
  padding: 8px 10px; border-radius: 6px; color: #7a6b6b;
  text-decoration: none; font-size: 16px;
}
.nv-nav a:hover { color: #231a1a; }
.nv-nav a.active { background: #f6e1de; color: #231a1a; }
.nv-right { display: flex; align-items: center; gap: 30px; }
.nv-role {
  background: #e7efe0; color: #3f5a35; font-weight: 700; font-size: 12.5px;
  padding: 5px 11px; border-radius: 6px;
}
.nv-logout { color: #7a6b6b; text-decoration: none; font-size: 15px; }
@media (max-width: 760px) {
  .nv-header { height: auto; }
  .nv-header-inner { height: auto; min-height: 55px; }
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
