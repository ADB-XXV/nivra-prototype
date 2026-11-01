"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import logo from "../images/logo.png";

// Self-contained: no other files needed. Styles are scoped under .nv so they
// won't clash with the rest of your app.

const EMAIL_RE = /^\S+@\S+\.\S+$/;

// Fields change with mode (login / signup) and role (student / employer).
function fieldsFor(mode, role) {
  const base = [
    { name: "email", label: "Email", type: "email" },
    { name: "password", label: "Password", type: "password", hint: "At least 8 characters" },
  ];
  if (mode === "login") return base;
  const extra =
    role === "employer"
      ? [
          { name: "business", label: "Business name" },
          { name: "city", label: "City", placeholder: "e.g. Kochi" },
        ]
      : [
          { name: "fullName", label: "Full name" },
          { name: "college", label: "College and course", placeholder: "e.g. B.Com, 2nd year" },
        ];
  return [...extra, ...base];
}

function validate(fields, values) {
  const errors = {};
  fields.forEach(({ name }) => {
    const v = (values[name] || "").trim();
    if (!v) errors[name] = "This field is required";
    else if (name === "email" && !EMAIL_RE.test(v)) errors[name] = "Enter a valid email address";
    else if (name === "password" && v.length < 8) errors[name] = "Use at least 8 characters";
  });
  return errors;
}

// onNavigate(path) can be passed by a client-side router; otherwise it reloads the page.
export default function Login({
  initialMode = "login",
  initialRole = "student",
  onNavigate = (p) => window.location.assign(p),
}) {
  const [mode, setMode] = useState(initialMode);
  const [role, setRole] = useState(initialRole);
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fields = fieldsFor(mode, role);
  const isLogin = mode === "login";

  const change = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  };

  
const submit = async (e) => {
  e.preventDefault();

  const found = validate(fields, values);
  setErrors(found);
  setMessage("");

  if (Object.keys(found).length) return;

  setLoading(true);

  try {
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email: values.email.trim(),
        password: values.password,
        options: {
          data: {
            role,
            fullName: values.fullName || null,
            college: values.college || null,
            business: values.business || null,
            city: values.city || null,
          },
        },
      });

      if (error) throw error;

      if (data.session) {
        onNavigate(
          role === "employer"
            ? "/employer/dashboard"
            : "/student/dashboard"
        );
      } else {
        setMessage(
          "Account created! Check your email to confirm your account before logging in."
        );
      }
    } else {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: values.email.trim(),
          password: values.password,
        });

      if (error) throw error;

      const { data: profile, error: profileError } =
        await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

      if (profileError) {
        await supabase.auth.signOut();
        throw new Error("Could not load your profile. Please try again.");
      }

      onNavigate(
        profile.role === "employer"
          ? "/employer/dashboard"
          : "/student/dashboard"
      );
    }
  } catch (error) {
    setMessage(error.message || "Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};


  const switchMode = (m) => { setMode(m); setErrors({}); };
  const switchRole = (r) => { setRole(r); setErrors({}); };

  return (
    <div className="nv">
      <nav className="top" aria-label="Main">
        <a href="/" style={{ textDecoration: "none" }}>
          <div className="w" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img src={logo.src} alt="" style={{ height: 40, width: "auto" }} />
            <span style={{ color: "#593C42", fontWeight: 700, fontSize: "1.4em !important" }}>Nivra</span>
          </div>
        </a>
      </nav>

      <main className="w" style={{ maxWidth: 460, padding: "36px 20px" }}>
        <form className="box" onSubmit={submit} noValidate>
          <div className="row" role="tablist" aria-label="Log in or sign up" style={{ marginBottom: 8 }}>
            {[["login", "Log in"], ["signup", "Sign up"]].map(([m, text]) => (
              <button key={m} type="button" role="tab" aria-selected={mode === m}
                className={`ch ${mode === m ? "on" : ""}`} onClick={() => switchMode(m)}>
                {text}
              </button>
            ))}
          </div>

          <h2>{isLogin ? "Welcome back" : "Create your account"}</h2>

          <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
            <legend style={{ fontWeight: 500, fontSize: ".88rem", padding: 0, margin: "12px 0 4px" }}>I am a</legend>
            <div className="row">
              {[["student", "Student"], ["employer", "Employer"]].map(([r, text]) => (
                <button key={r} type="button" aria-pressed={role === r}
                  className={`ch ${role === r ? "on" : ""}`} onClick={() => switchRole(r)}>
                  {text}
                </button>
              ))}
            </div>
          </fieldset>

          {fields.map((f) => {
            const isPw = f.type === "password";
            const id = `f-${f.name}`;
            const err = errors[f.name];
            return (
              <div key={f.name}>
                <label htmlFor={id}>{f.label}</label>
                <div style={{ position: "relative" }}>
                  <input
                    id={id}
                    name={f.name}
                    type={isPw && showPw ? "text" : f.type || "text"}
                    placeholder={f.placeholder}
                    value={values[f.name] || ""}
                    onChange={(e) => change(f.name, e.target.value)}
                    className={err ? "bad" : ""}
                    aria-invalid={!!err}
                    aria-describedby={err ? `${id}-err` : f.hint ? `${id}-hint` : undefined}
                    autoComplete={isPw ? (isLogin ? "current-password" : "new-password") : f.type === "email" ? "email" : "off"}
                  />
                  {isPw && (
                    <button type="button" className="btn g sm" onClick={() => setShowPw((s) => !s)}
                      aria-label={showPw ? "Hide password" : "Show password"}
                      style={{ position: "absolute", right: 2, top: 3 }}>
                      {showPw ? "Hide" : "Show"}
                    </button>
                  )}
                </div>
                {err ? (
                  <small id={`${id}-err`} className="err" role="alert">{err}</small>
                ) : f.hint ? (
                  <small id={`${id}-hint`} className="hint">{f.hint}</small>
                ) : null}
              </div>
            );
          })}
          {message && (
  <p className="hint" role="status" aria-live="polite">
    {message}
  </p>
)}
         <button
  type="submit"
  className="btn"
  style={{ width: "100%", marginTop: 18 }}
  disabled={loading}
>
  {loading
    ? "Please wait..."
    : isLogin
      ? "Log in"
      : "Create account"}
</button>
        </form>
      </main>
    </div>
  );
}
