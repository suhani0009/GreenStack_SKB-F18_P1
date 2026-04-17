import { useEffect, useState } from "react";

import EmptyState from "../components/ui/EmptyState";
import Panel from "../components/ui/Panel";
import api from "../services/api";

const initialForm = {
  supplier_name: "",
  industry: "",
  risk_score: 50,
  emissions: 0,
};

function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadSuppliers = async () => {
    try {
      const data = await api.suppliers.list();
      setSuppliers(data);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setStatus("");

    try {
      await api.suppliers.create({
        ...form,
        risk_score: Number(form.risk_score),
        emissions: Number(form.emissions),
      });
      setStatus("Supplier added successfully");
      setForm(initialForm);
      await loadSuppliers();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequest = async (supplierId) => {
    try {
      const response = await api.suppliers.requestData(supplierId);
      setStatus(response.message);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Suppliers</p>
        <h1 className="mt-2 text-3xl font-semibold">Manage Scope 3 partners</h1>
        <p className="mt-2 text-sm text-slate-500">Track supplier risk, captured emissions, and trigger ESG data requests from one place.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr,1.05fr]">
        <Panel title="Add Supplier" subtitle="Supplier risk scores help prioritize follow-up and reporting.">
          <form className="grid gap-4" onSubmit={handleCreate}>
            <div>
              <label className="field-label">Supplier Name</label>
              <input
                className="field"
                value={form.supplier_name}
                onChange={(event) => setForm({ ...form, supplier_name: event.target.value })}
                required
              />
            </div>
            <div>
              <label className="field-label">Industry</label>
              <input
                className="field"
                value={form.industry}
                onChange={(event) => setForm({ ...form, industry: event.target.value })}
                required
              />
            </div>
            <div>
              <label className="field-label">Risk Score</label>
              <input
                className="field"
                type="number"
                min="0"
                max="100"
                value={form.risk_score}
                onChange={(event) => setForm({ ...form, risk_score: event.target.value })}
                required
              />
            </div>
            <div>
              <label className="field-label">Supplier Emissions</label>
              <input
                className="field"
                type="number"
                min="0"
                step="0.01"
                value={form.emissions}
                onChange={(event) => setForm({ ...form, emissions: event.target.value })}
              />
            </div>
            <button className="btn-primary" type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Add Supplier"}
            </button>
          </form>

          {error ? <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p> : null}
          {status ? <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{status}</p> : null}
        </Panel>

        <Panel title="Supplier Portfolio" subtitle="List, risk score, recorded emissions, and request workflow">
          {loading ? (
            <p className="text-sm text-slate-500">Loading suppliers...</p>
          ) : suppliers.length ? (
            <div className="space-y-4">
              {suppliers.map((supplier) => (
                <div key={supplier.id} className="rounded-3xl border border-slate-200 bg-white px-5 py-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-ink">{supplier.supplier_name}</h3>
                      <p className="text-sm text-slate-500">{supplier.industry}</p>
                    </div>
                    <div className="rounded-2xl bg-mist px-4 py-2 text-sm font-semibold text-moss">
                      Risk {Number(supplier.risk_score).toFixed(0)}
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                    <p className="text-sm text-slate-600">
                      Supplier emissions: <span className="font-semibold text-ink">{supplier.emissions} tCO2e</span>
                    </p>
                    <button className="btn-secondary" onClick={() => handleRequest(supplier.id)}>
                      Send ESG Data Request
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No suppliers yet" description="Create your first supplier entry to start managing Scope 3 exposure." />
          )}
        </Panel>
      </div>
    </div>
  );
}

export default SuppliersPage;
