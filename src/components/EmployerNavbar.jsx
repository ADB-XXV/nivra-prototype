"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "../images/logo.png";

const LINKS = [
  { label: "Dashboard", path: "/employer/dashboard" },
  { label: "Post a job", path: "/employer/post-job" },
  { label: "Applicants", path: "/employer/applicants" },
  { label: "Matching", path: "/employer/matching" },
  { label: "Plans", path: "/pricing" },
  { label: "Transactions", path: "/employer/transactions" },
  { label: "Profile", path: "/employer/profile" },
];

export default function EmployerNavbar({ active = "" }) {
   return (
  <>
    <nav className="employer-nav" aria-label="Main employer navigation">
      <div className="employer-nav-inner">
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <Image
            className="employer-nav-logo"
            src={logo}
            alt="Nivra"
            width={72}
            height={40}
            style={{ height: "40px", width: "auto" }}
          />
          <span style={{ color: "#593C42", fontWeight: 700,fontSize: "1.4em !important" }}>Nivra</span>
        </span>
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
