import Login from "../../pages/Login";

export default function LoginPage({ searchParams }) {
  return (
    <Login
      initialMode={searchParams?.mode === "signup" ? "signup" : "login"}
      initialRole={searchParams?.role === "employer" ? "employer" : "student"}
    />
  );
}
