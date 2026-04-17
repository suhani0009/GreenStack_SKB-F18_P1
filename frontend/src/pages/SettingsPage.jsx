import { useEffect, useState } from "react";

import Panel from "../components/ui/Panel";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function SettingsPage() {
  const { setCompany, setUser } = useAuth();
  const [form, setForm] = useState({
    companyName: "",
    industry: "",
    emissionRegion: "",
    userName: "",
    email: "",
  });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await api.settings.get();
        setForm({
          companyName: data.company?.name || "",
          industry: data.company?.industry || "",
          emissionRegion: data.company?.emission_region || "",
          userName: data.user?.name || "",
          email: data.user?.email || "",
        });
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setStatus("");
    setError("");

    try {
      const data = await api.settings.update(form);
      setCompany(data.company);
      setUser(data.user);
      localStorage.setItem("greenstack_company", JSON.stringify(data.company));
      localStorage.setItem("greenstack_user", JSON.stringify(data.user));
      setStatus("Settings saved successfully");
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Settings</p>
        <h1 className="mt-2 text-3xl font-semibold">Workspace and profile settings</h1>
        <p className="mt-2 text-sm text-slate-500">Maintain company information, industry context, emission region, and user details.</p>
      </div>

      <Panel title="Company & Profile" subtitle="Update information used throughout GreenStack">
        {loading ? (
          <p className="text-sm text-slate-500">Loading settings...</p>
        ) : (
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <div>
              <label className="field-label">Company Info</label>
              <input
                className="field"
                value={form.companyName}
                onChange={(event) => setForm({ ...form, companyName: event.target.value })}
              />
            </div>
            <div>
              <label className="field-label">Industry</label>
              <input className="field" value={form.industry} onChange={(event) => setForm({ ...form, industry: event.target.value })} />
            </div>
            <div>
              <label className="field-label">Emission Region</label>
              <input
                className="field"
                value={form.emissionRegion}
                onChange={(event) => setForm({ ...form, emissionRegion: event.target.value })}
              />
            </div>
            <div>
              <label className="field-label">User Profile</label>
              <input className="field" value={form.userName} onChange={(event) => setForm({ ...form, userName: event.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className="field-label">Email</label>
              <input className="field" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            </div>

            {error ? <p className="md:col-span-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p> : null}
            {status ? <p className="md:col-span-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{status}</p> : null}

            <button className="btn-primary md:col-span-2" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </form>
        )}
      </Panel>
    </div>
  );
}

export default SettingsPage;
