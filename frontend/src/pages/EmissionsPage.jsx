import { useEffect, useState } from "react";

import EmptyState from "../components/ui/EmptyState";
import Panel from "../components/ui/Panel";
import api from "../services/api";

const initialForm = {
  activity_type: "electricity",
  value: "",
  unit: "kwh",
  date: new Date().toISOString().slice(0, 10),
};

function parseCsvFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const lines = String(reader.result || "")
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean);

        if (!lines.length) {
          throw new Error("CSV file is empty");
        }

        const [headerLine, ...dataLines] = lines;
        const headers = headerLine
          .split(",")
          .map((item) => item.trim().toLowerCase().replace(/\s+/g, "_"));
        const requiredHeaders = ["activity_type", "value", "unit", "date"];
        const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header));

        if (missingHeaders.length) {
          throw new Error(`CSV is missing required columns: ${missingHeaders.join(", ")}`);
        }

        const records = dataLines
          .map((line) => {
            const values = line.split(",").map((item) => item.trim());
            return headers.reduce((acc, header, index) => {
              acc[header] = values[index];
              return acc;
            }, {});
          })
          .filter((record) => record.activity_type && record.value && record.unit && record.date);

        if (!records.length) {
          throw new Error("CSV has no valid records");
        }

        resolve(records);
      } catch (error) {
        reject(error instanceof Error ? error : new Error("Unable to parse CSV file"));
      }
    };
    reader.onerror = () => reject(new Error("Unable to read CSV file"));
    reader.readAsText(file);
  });
}

function EmissionsPage() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadRecords = async () => {
    try {
      const data = await api.emissions.list();
      setRecords(data);
      setError("");
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setStatus("");

    try {
      const response = await api.emissions.create({
        ...form,
        value: Number(form.value),
      });
      setStatus(response.message);
      setForm(initialForm);
      await loadRecords();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCsvUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setSubmitting(true);
    setError("");
    setStatus("");

    try {
      const parsedRecords = await parseCsvFile(file);
      const response = await api.emissions.create({ records: parsedRecords });
      setStatus(response.message);
      await loadRecords();
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setSubmitting(false);
      event.target.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Emissions</p>
        <h1 className="mt-2 text-3xl font-semibold">Capture activity data</h1>
        <p className="mt-2 text-sm text-slate-500">Submit records manually or import a CSV with activity_type, value, unit, and date columns.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr,1.05fr]">
        <Panel title="Add Emission Record" subtitle="Records are classified into Scope 1, 2, or 3 automatically.">
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleCreate}>
            <div>
              <label className="field-label">Activity Type</label>
              <select
                className="field"
                value={form.activity_type}
                onChange={(event) => setForm({ ...form, activity_type: event.target.value })}
              >
                <option value="electricity">Electricity</option>
                <option value="diesel">Diesel</option>
                <option value="gasoline">Gasoline</option>
                <option value="natural_gas">Natural Gas</option>
                <option value="suppliers">Suppliers</option>
                <option value="shipping">Shipping</option>
                <option value="flights">Flights</option>
              </select>
            </div>
            <div>
              <label className="field-label">Value</label>
              <input
                className="field"
                type="number"
                min="0"
                step="0.01"
                value={form.value}
                onChange={(event) => setForm({ ...form, value: event.target.value })}
                required
              />
            </div>
            <div>
              <label className="field-label">Unit</label>
              <input
                className="field"
                value={form.unit}
                onChange={(event) => setForm({ ...form, unit: event.target.value })}
                required
              />
            </div>
            <div>
              <label className="field-label">Date</label>
              <input
                className="field"
                type="date"
                value={form.date}
                onChange={(event) => setForm({ ...form, date: event.target.value })}
                required
              />
            </div>
            <button className="btn-primary md:col-span-2" type="submit" disabled={submitting}>
              {submitting ? "Saving..." : "Save Emission"}
            </button>
          </form>

          <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-5 py-5">
            <label className="field-label">CSV Upload</label>
            <input className="field" type="file" accept=".csv" onChange={handleCsvUpload} />
          </div>

          {error ? <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p> : null}
          {status ? <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{status}</p> : null}
        </Panel>

        <Panel title="Emission Records" subtitle="Latest uploaded and manual activities">
          {loading ? (
            <p className="text-sm text-slate-500">Loading records...</p>
          ) : records.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-200 text-xs uppercase tracking-[0.22em] text-slate-500">
                  <tr>
                    <th className="pb-4 pr-4">Date</th>
                    <th className="pb-4 pr-4">Activity</th>
                    <th className="pb-4 pr-4">Scope</th>
                    <th className="pb-4 pr-4">Value</th>
                    <th className="pb-4 pr-4">Unit</th>
                    <th className="pb-4">Emission</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id} className="border-b border-slate-100">
                      <td className="py-4 pr-4">{record.date}</td>
                      <td className="py-4 pr-4 capitalize">{record.activity_type.replaceAll("_", " ")}</td>
                      <td className="py-4 pr-4">{record.scope}</td>
                      <td className="py-4 pr-4">{record.value}</td>
                      <td className="py-4 pr-4">{record.unit}</td>
                      <td className="py-4 font-semibold text-moss">{record.emission} tCO2e</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState title="No emissions logged yet" description="Add a manual record or upload a CSV to start calculating emissions." />
          )}
        </Panel>
      </div>
    </div>
  );
}

export default EmissionsPage;
