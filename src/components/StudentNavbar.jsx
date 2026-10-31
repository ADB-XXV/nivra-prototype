"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../images/logo.png";

const NAV = [
  ["Browse jobs", "/browsejobs"],
  ["Saved", "/saved"],
  ["My applications", "/applications"],
  ["Dashboard", "/student/dashboard"],
  ["Profile", "/student/profile"],
];

export default function StudentNavbar({ active }) {
  const router = useRouter();

  function navigate(event, path) {
    event.preventDefault();
    router.push(path);
  }

  return (
    <>
      <header className="nv-header">
        <div className="nv-header-inner">
          <span className="nv-logo" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <Image
              src={logo}
              alt="Nivra"
              width={72}
              height={40}
              style={{ height: "40px", width: "auto" }}
            />
            <span style={{ color: "#593C42", fontWeight: 700,fontSize: "1.4em !important" }}>Nivra</span>
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
