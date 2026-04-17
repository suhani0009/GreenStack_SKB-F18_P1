import { useEffect, useState } from "react";

import EmissionsTrendChart from "../components/charts/EmissionsTrendChart";
import ScopePieChart from "../components/charts/ScopePieChart";
import EmptyState from "../components/ui/EmptyState";
import Panel from "../components/ui/Panel";
import StatCard from "../components/ui/StatCard";
import api from "../services/api";

const formatTonnes = (value) => `${Number(value || 0).toFixed(2)} tCO2e`;

function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const data = await api.emissions.summary();
        setSummary(data);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, []);

  if (loading) {
    return <div className="py-10 text-sm text-slate-500">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="rounded-2xl bg-rose-50 px-5 py-4 text-sm text-rose-600">{error}</div>;
  }

  if (!summary) {
    return <EmptyState title="No dashboard data yet" description="Add emission records and suppliers to populate analytics." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold">Carbon performance overview</h1>
        <p className="mt-2 text-sm text-slate-500">A live snapshot across emissions, hotspots, and supplier exposure.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Emissions" value={formatTonnes(summary.totalEmissions)} helper="Across all recorded activities" />
        <StatCard
          label="Suppliers Tracked"
          value={summary.supplierRiskSummary.totalSuppliers}
          helper={`${summary.supplierRiskSummary.highRiskSuppliers} high-risk suppliers`}
        />
        <StatCard
          label="Average Supplier Risk"
          value={`${summary.supplierRiskSummary.averageRisk.toFixed(1)} / 100`}
          helper="Based on current supplier portfolio"
        />
        <StatCard
          label="Supplier Emissions"
          value={formatTonnes(summary.supplierRiskSummary.supplierEmissions)}
          helper="Reported Scope 3 partner impact"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr,1.3fr]">
        <Panel title="Scope Breakdown" subtitle="Scope 1, 2, and 3 split from your latest records">
          {summary.scopeBreakdown.length ? (
            <ScopePieChart data={summary.scopeBreakdown} />
          ) : (
            <EmptyState title="No scope data yet" description="Create your first emissions entries to unlock the pie chart." />
          )}
        </Panel>

        <Panel title="Monthly Trend" subtitle="Emission volume over time">
          {summary.monthlyTrend.length ? (
            <EmissionsTrendChart data={summary.monthlyTrend} />
          ) : (
            <EmptyState title="No trend data yet" description="Trend analytics appear as soon as dated emissions are saved." />
          )}
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <Panel title="Top Facilities" subtitle="Highest-emission activity clusters in the current dataset">
          {summary.topFacilities.length ? (
            <div className="space-y-3">
              {summary.topFacilities.map((facility) => (
                <div key={facility.name} className="flex items-center justify-between rounded-2xl bg-mist px-4 py-4">
                  <span className="font-medium text-ink">{facility.name}</span>
                  <span className="text-sm font-semibold text-moss">{formatTonnes(facility.emissions)}</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No hotspots yet" description="Hotspot rows appear after your first saved activities." />
          )}
        </Panel>

        <Panel title="Supplier Risk Summary" subtitle="Scope 3 supplier exposure at a glance">
          <div className="space-y-4">
            <div className="rounded-3xl bg-ink px-5 py-5 text-white">
              <p className="text-xs uppercase tracking-[0.24em] text-lime">High Risk Suppliers</p>
              <p className="mt-3 text-4xl font-semibold">{summary.supplierRiskSummary.highRiskSuppliers}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-mist px-4 py-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Average Risk</p>
                <p className="mt-2 text-2xl font-semibold">{summary.supplierRiskSummary.averageRisk.toFixed(1)}</p>
              </div>
              <div className="rounded-2xl bg-mist px-4 py-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Supplier Emissions</p>
                <p className="mt-2 text-2xl font-semibold">{formatTonnes(summary.supplierRiskSummary.supplierEmissions)}</p>
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

export default DashboardPage;
