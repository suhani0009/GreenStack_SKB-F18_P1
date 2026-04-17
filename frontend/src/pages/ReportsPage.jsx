import { useState } from "react";

import EmptyState from "../components/ui/EmptyState";
import Panel from "../components/ui/Panel";
import api from "../services/api";

const initialFilters = {
  startDate: "",
  endDate: "",
  scope: "",
};

function downloadFile(name, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

function exportPdf(report) {
  const printableWindow = window.open("", "_blank");
  if (!printableWindow) {
    return;
  }

  printableWindow.document.write(`
    <html>
      <head><title>GreenStack ESG Report</title></head>
      <body style="font-family: Arial, sans-serif; padding: 32px;">
        <h1>GreenStack ESG Report</h1>
        <p>Generated at: ${report.generatedAt}</p>
        <p>Total emissions: ${report.totalEmissions.toFixed(2)} tCO2e</p>
        <h2>Scope Breakdown</h2>
        <ul>
          ${report.scopeBreakdown.map((item) => `<li>${item.name}: ${Number(item.value).toFixed(2)} tCO2e</li>`).join("")}
        </ul>
      </body>
    </html>
  `);
  printableWindow.document.close();
  printableWindow.focus();
  printableWindow.print();
}

function ReportsPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const cleanFilters = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
      const data = await api.reports.generate(cleanFilters);
      setReport(data);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Reports</p>
        <h1 className="mt-2 text-3xl font-semibold">Generate ESG reports</h1>
        <p className="mt-2 text-sm text-slate-500">Filter by date or scope, then export an Excel-compatible CSV or print-ready PDF.</p>
      </div>

      <Panel
        title="Report Builder"
        subtitle="Build a filtered report from your current emissions data"
        actions={
          report
            ? [
                <button
                  key="excel"
                  className="btn-secondary"
                  onClick={() => downloadFile("greenstack-report.csv", report.csv, "text/csv;charset=utf-8")}
                >
                  Export Excel
                </button>,
                <button key="pdf" className="btn-primary" onClick={() => exportPdf(report)}>
                  Export PDF
                </button>,
              ]
            : null
        }
      >
        <form className="grid gap-4 md:grid-cols-4" onSubmit={handleGenerate}>
          <div>
            <label className="field-label">Start Date</label>
            <input
              className="field"
              type="date"
              value={filters.startDate}
              onChange={(event) => setFilters({ ...filters, startDate: event.target.value })}
            />
          </div>
          <div>
            <label className="field-label">End Date</label>
            <input
              className="field"
              type="date"
              value={filters.endDate}
              onChange={(event) => setFilters({ ...filters, endDate: event.target.value })}
            />
          </div>
          <div>
            <label className="field-label">Scope</label>
            <select className="field" value={filters.scope} onChange={(event) => setFilters({ ...filters, scope: event.target.value })}>
              <option value="">All scopes</option>
              <option value="Scope 1">Scope 1</option>
              <option value="Scope 2">Scope 2</option>
              <option value="Scope 3">Scope 3</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="btn-primary w-full" type="submit" disabled={loading}>
              {loading ? "Generating..." : "Generate Report"}
            </button>
          </div>
        </form>

        {error ? <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p> : null}
      </Panel>

      <Panel title="Generated Report" subtitle="Summary and records from the latest filter">
        {report ? (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-mist px-4 py-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Total Emissions</p>
                <p className="mt-2 text-2xl font-semibold">{report.totalEmissions.toFixed(2)} tCO2e</p>
              </div>
              <div className="rounded-2xl bg-mist px-4 py-4 md:col-span-2">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Scope Breakdown</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {report.scopeBreakdown.map((item) => (
                    <span key={item.name} className="rounded-full bg-white px-4 py-2 text-sm font-medium text-ink">
                      {item.name}: {Number(item.value).toFixed(2)} tCO2e
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {report.records.length ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-slate-200 text-xs uppercase tracking-[0.22em] text-slate-500">
                    <tr>
                      <th className="pb-4 pr-4">Date</th>
                      <th className="pb-4 pr-4">Activity</th>
                      <th className="pb-4 pr-4">Scope</th>
                      <th className="pb-4 pr-4">Value</th>
                      <th className="pb-4">Emission</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.records.map((row) => (
                      <tr key={row.id} className="border-b border-slate-100">
                        <td className="py-4 pr-4">{row.date}</td>
                        <td className="py-4 pr-4">{row.activity_type}</td>
                        <td className="py-4 pr-4">{row.scope}</td>
                        <td className="py-4 pr-4">
                          {row.value} {row.unit}
                        </td>
                        <td className="py-4 font-semibold text-moss">{row.emission} tCO2e</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState title="No rows matched your filter" description="Adjust the report dates or scope and generate again." />
            )}
          </div>
        ) : (
          <EmptyState title="No report generated yet" description="Run the report builder to see emissions data and export options." />
        )}
      </Panel>
    </div>
  );
}

export default ReportsPage;
