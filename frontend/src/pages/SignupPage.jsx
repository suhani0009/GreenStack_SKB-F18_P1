import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signup(form);
      navigate("/dashboard", { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="panel-surface grid w-full max-w-5xl overflow-hidden lg:grid-cols-[1fr,1fr]">
        <div className="px-8 py-12 sm:px-12">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Create Workspace</p>
          <h1 className="mt-4 text-3xl font-semibold">Start your ESG operating system</h1>

          <form className="mt-8 grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
            <div className="sm:col-span-2">
              <label className="field-label">Full Name</label>
              <input
                className="field"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Alex Morgan"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="field-label">Company</label>
              <input
                className="field"
                value={form.company}
                onChange={(event) => setForm({ ...form, company: event.target.value })}
                placeholder="GreenStack Labs"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="field-label">Email</label>
              <input
                className="field"
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                placeholder="alex@company.com"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="field-label">Password</label>
              <input
                className="field"
                type="password"
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                placeholder="Minimum 8 characters"
                required
              />
            </div>

            {error ? <p className="sm:col-span-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p> : null}

            <button className="btn-primary sm:col-span-2" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Signup"}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-500">
            Already have access?{" "}
            <Link className="font-semibold text-moss" to="/login">
              Login here
            </Link>
          </p>
        </div>

        <div className="bg-gradient-to-br from-lime via-[#eefcc4] to-mist px-8 py-12 sm:px-12">
          <p className="text-xs uppercase tracking-[0.3em] text-moss">What You Get</p>
          <div className="mt-6 space-y-4">
            {[
              "Manual and CSV emissions capture",
              "Scope 1, 2, and 3 classification",
              "Supplier risk tracking for Scope 3",
              "Report generation and instant scenario simulations",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-moss/10 bg-white/80 px-5 py-4 text-sm text-slate-700">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
