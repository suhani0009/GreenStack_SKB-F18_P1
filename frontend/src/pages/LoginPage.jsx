import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(form);
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="panel-surface grid w-full max-w-5xl overflow-hidden lg:grid-cols-[1.05fr,0.95fr]">
        <div className="bg-ink px-8 py-12 text-white sm:px-12">
          <p className="text-xs uppercase tracking-[0.3em] text-lime">GreenStack</p>
          <h1 className="mt-6 text-4xl font-semibold leading-tight">Track carbon performance with one integrated ESG stack.</h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">
            Secure access for sustainability teams to manage Scope 1, 2, and 3 data, supplier risk, reporting, and scenario planning.
          </p>
        </div>

        <div className="px-8 py-12 sm:px-12">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Welcome Back</p>
          <h2 className="mt-4 text-3xl font-semibold">Sign in to your workspace</h2>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="field-label">Email</label>
              <input
                className="field"
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                placeholder="team@company.com"
                required
              />
            </div>
            <div>
              <label className="field-label">Password</label>
              <input
                className="field"
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                placeholder="••••••••"
                required
              />
            </div>

            {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p> : null}

            <button className="btn-primary w-full" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-500">
            New to GreenStack?{" "}
            <Link className="font-semibold text-moss" to="/signup">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
