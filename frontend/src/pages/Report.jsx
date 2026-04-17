const report = {
  company: 'Demo Corp',
  timeframe: 'Q1 2026',
  totals: {
    'Scope 1': 540,
    'Scope 2': 1120,
    'Scope 3': 2850,
  },
  insights: [
    { title: 'Total emissions', value: 4510, unit: 'tCO₂e' },
    { title: 'Renewable energy usage', value: '38%', unit: '' },
    { title: 'Supplier reduction progress', value: '12%', unit: '' },
  ],
  actionItems: [
    'Increase renewable procurement by 15%',
    'Engage top 3 suppliers on emission targets',
    'Standardize energy reporting across facilities',
  ],
};

const chartData = [
  { label: 'Scope 1', value: 540, color: 'bg-rose-500' },
  { label: 'Scope 2', value: 1120, color: 'bg-blue-500' },
  { label: 'Scope 3', value: 2850, color: 'bg-green-500' },
];

export default function Report() {
  const totalEmissions = Object.values(report.totals).reduce((sum, value) => sum + value, 0);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-700">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-green-600 dark:text-green-400">ESG Reporting</p>
            <h1 className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">Executive sustainability scorecard</h1>
            <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-2xl">
              A snapshot of your emissions performance and priority actions for the upcoming quarter.
            </p>
          </div>
          <div className="rounded-3xl bg-gray-50 p-5 text-right dark:bg-gray-950">
            <p className="text-sm text-gray-500 dark:text-gray-400">Reporting period</p>
            <p className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">{report.timeframe}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {report.insights.map((item) => (
          <div key={item.title} className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">{item.title}</p>
            <p className="mt-4 text-3xl font-semibold text-gray-900 dark:text-white">{item.value} {item.unit}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-700">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Emissions breakdown</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">The chart below shows the contribution of each emissions scope.</p>
            <div className="mt-6 space-y-4">
              {chartData.map((item) => {
                const width = Math.round((item.value / totalEmissions) * 100);
                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
                      <span>{item.label}</span>
                      <span>{item.value} tCO₂e</span>
                    </div>
                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
                      <div className={`${item.color} h-full rounded-full`} style={{ width: `${width}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="rounded-3xl bg-green-50 p-6 dark:bg-green-900/20">
              <p className="text-sm font-semibold text-green-700 dark:text-green-200">Total emissions</p>
              <p className="mt-3 text-4xl font-semibold text-gray-900 dark:text-white">{totalEmissions} tCO₂e</p>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Emission totals are based on current supplier and facility data. Focus on Scope 3 to maximize impact.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-700">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Recommended actions</h2>
        <p className="mt-3 text-gray-600 dark:text-gray-400">Priority initiatives for emissions reduction and supplier engagement.</p>
        <ul className="mt-6 space-y-4">
          {report.actionItems.map((item) => (
            <li key={item} className="rounded-3xl border border-gray-200 bg-gray-50 p-5 text-gray-800 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}