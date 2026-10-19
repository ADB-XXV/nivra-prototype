"use client";

import { useState } from "react";

// Self-contained: no other files needed. Styles are scoped under .nv so they
// won't clash with the rest of your app.

const EMAIL_RE = /^\S+@\S+\.\S+$/;

const css = `
.nv{--bg:#FAF5F0;--sf:#fff;--ln:#e7ddd3;--tx:#2d2124;--mu:#7b6b6e;--sd:#56694b;--tl:#f4e3e1;--btn:#593C42;--btx:#fff;--ter:#D6A5A5;--sec:#A8B89A;--er:#a23b3b;
  background:var(--bg);color:var(--tx);min-height:100vh;font:15px/1.5 'DM Sans',system-ui,sans-serif}
@media(prefers-color-scheme:dark){.nv{--bg:#1d1517;--sf:#2a2023;--ln:#43353a;--tx:#f3ebe6;--mu:#b5a5a8;--sd:#b9c9ab;--tl:#3b2a2e;--btn:#D6A5A5;--btx:#2d2124;--er:#e58b8b}}
.nv *{box-sizing:border-box}
.nv h2{margin:0 0 .5rem;line-height:1.2;font-size:1.35rem}.nv p{margin:0 0 .75rem}
.nv .w{max-width:1080px;margin:0 auto;padding:0 20px}.nv .mu{color:var(--mu)}
.nv .row{display:flex;gap:12px;align-items:center;flex-wrap:wrap}
.nv .top{background:var(--sf);border-bottom:1px solid var(--ln);position:sticky;top:0;z-index:5}
.nv .top .w{display:flex;align-items:center;gap:20px;height:56px}
.nv .logo{font-weight:700;font-size:1.25rem;color:var(--btn);background:none;border:0;font-family:inherit;padding:0;cursor:pointer;letter-spacing:-.02em}
.nv .logo i{display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--ter);margin-left:2px}
.nv .links{display:flex;gap:2px;flex:1;overflow-x:auto}
.nv .links a{padding:6px 10px;border-radius:6px;color:var(--mu);font-weight:500;cursor:pointer;white-space:nowrap}
.nv .btn{background:var(--btn);color:var(--btx);border:1px solid var(--btn);padding:9px 16px;border-radius:6px;font:inherit;font-weight:500;cursor:pointer;display:inline-block}
.nv .btn.s{background:transparent;color:var(--tx);border-color:var(--ln)}.nv .btn.g{background:none;border-color:transparent;color:var(--sd);padding:6px 8px}.nv .btn.sm{padding:5px 10px;font-size:.85rem}
.nv .btn:focus-visible,.nv input:focus-visible{outline:2px solid var(--sec);outline-offset:2px}
.nv input{width:100%;padding:9px 11px;border:1px solid var(--ln);border-radius:6px;background:var(--sf);color:var(--tx);font:inherit}
.nv input.bad{border-color:var(--er)}
.nv label{display:block;font-weight:500;font-size:.88rem;margin:12px 0 4px}
.nv .err{color:var(--er);display:block;margin-top:3px;font-size:.85rem}.nv .hint{color:var(--mu);font-size:.85rem}
.nv .box{background:var(--sf);border:1px solid var(--ln);border-radius:8px;padding:20px}
.nv .ch{display:inline-block;padding:3px 10px;border:1px solid var(--ln);border-radius:5px;margin:0 6px 6px 0;font:inherit;font-size:.85rem;background:var(--sf);color:var(--tx);cursor:pointer}
.nv .ch.on{background:var(--tl);border-color:var(--ter)}
.nv .foot{border-top:1px solid var(--ln);padding:22px 0;font-size:.85rem;color:var(--mu);margin-top:40px}
@media(max-width:760px){.nv .top .w{gap:10px}}
`;

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

  const fields = fieldsFor(mode, role);
  const isLogin = mode === "login";

  const change = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const submit = (e) => {
    e.preventDefault();
    const found = validate(fields, values);
    setErrors(found);
    if (Object.keys(found).length) return;
    // Prototype only: no backend yet. Replace with a real auth call later.
    onNavigate(role === "employer" ? "/employer/dashboard" : "/jobs");
  };

  const switchMode = (m) => { setMode(m); setErrors({}); };
  const switchRole = (r) => { setRole(r); setErrors({}); };

  return (
    <div className="nv">
      <style>{css}</style>

      <nav className="top" aria-label="Main">
        <div className="w">
          <button className="logo" onClick={() => onNavigate("/")}>Nivra<i /></button>
          <div className="links">
            <a onClick={() => onNavigate("/jobs")}>Find jobs</a>
            <a onClick={() => { setRole("employer"); setMode("signup"); setErrors({}); }}>For employers</a>
          </div>
        </div>
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

          <button type="submit" className="btn" style={{ width: "100%", marginTop: 18 }}>
            {isLogin ? "Log in" : "Create account"}
          </button>
        </form>
      </main>

      <footer className="foot">
        <div className="w">
          <p><b>Nivra</b> · Find work for a day. Build experience for tomorrow.</p>
          <p>Prototype with sample data. Employers, jobs and students are fictional.</p>
        </div>
      </footer>
    </div>
  );
}