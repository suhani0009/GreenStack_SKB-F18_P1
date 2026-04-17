import { useEffect, useState } from "react";

import ScenarioComparisonChart from "../components/charts/ScenarioComparisonChart";
import EmptyState from "../components/ui/EmptyState";
import Panel from "../components/ui/Panel";
import api from "../services/api";

function ScenarioPage() {
  const [inputs, setInputs] = useState({
    renewablePercentage: 25,
    fuelReductionPercentage: 10,
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await api.scenario.simulate(inputs);
        if (active) {
          setResult(data);
          setError("");
        }
      } catch (loadError) {
        if (active) {
          setError(loadError.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [inputs]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Scenario Simulator</p>
        <h1 className="mt-2 text-3xl font-semibold">Test climate transition levers</h1>
        <p className="mt-2 text-sm text-slate-500">Adjust renewable adoption and fuel reduction assumptions to estimate avoided emissions instantly.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
        <Panel title="Scenario Inputs" subtitle="Model your decarbonization assumptions">
          <div className="space-y-6">
            <div>
              <label className="field-label">Renewable %</label>
              <input
                className="field"
                type="range"
                min="0"
                max="100"
                value={inputs.renewablePercentage}
                onChange={(event) => setInputs({ ...inputs, renewablePercentage: Number(event.target.value) })}
              />
              <p className="mt-2 text-sm text-slate-500">{inputs.renewablePercentage}% renewable electricity mix</p>
            </div>
            <div>
              <label className="field-label">Fuel Reduction %</label>
              <input
                className="field"
                type="range"
                min="0"
                max="100"
                value={inputs.fuelReductionPercentage}
                onChange={(event) => setInputs({ ...inputs, fuelReductionPercentage: Number(event.target.value) })}
              />
              <p className="mt-2 text-sm text-slate-500">{inputs.fuelReductionPercentage}% fossil fuel reduction</p>
            </div>
          </div>
        </Panel>

        <Panel title="Scenario Output" subtitle="Backend-calculated current versus simulated emissions">
          {loading ? (
            <p className="text-sm text-slate-500">Simulating scenario...</p>
          ) : error ? (
            <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p>
          ) : result ? (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl bg-mist px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Current</p>
                  <p className="mt-2 text-2xl font-semibold">{result.currentTotal.toFixed(2)} tCO2e</p>
                </div>
                <div className="rounded-2xl bg-mist px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Simulated</p>
                  <p className="mt-2 text-2xl font-semibold">{result.simulatedTotal.toFixed(2)} tCO2e</p>
                </div>
                <div className="rounded-2xl bg-ink px-4 py-4 text-white">
                  <p className="text-xs uppercase tracking-[0.24em] text-lime">Reduction</p>
                  <p className="mt-2 text-2xl font-semibold">{result.reduction.toFixed(2)} tCO2e</p>
                </div>
              </div>
              <ScenarioComparisonChart data={result.comparison} />
            </div>
          ) : (
            <EmptyState title="No simulation available" description="Save some emissions data to generate scenario comparisons." />
          )}
        </Panel>
      </div>
    </div>
  );
}

export default ScenarioPage;
