const suppliersData = [
  { id: 1, name: 'Green Solutions Ltd.', category: 'Electronics', location: 'Nagpur', emissions: 420, change: -12 },
  { id: 2, name: 'Eco Freight Partners', category: 'Logistics', location: 'Pune', emissions: 810, change: 4 },
  { id: 3, name: 'SolarWorks Inc.', category: 'Energy', location: 'Mumbai', emissions: 295, change: -23 },
  { id: 4, name: 'Packaging Plus', category: 'Materials', location: 'Jammu', emissions: 560, change: 8 },
];

const totalEmissions = suppliersData.reduce((sum, item) => sum + item.emissions, 0);

export default function Suppliers() {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-700">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-green-600 dark:text-green-400">Supplier Insights</p>
            <h1 className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">Supplier emissions portfolio</h1>
            <p className="mt-3 text-gray-600 dark:text-gray-400 max-w-2xl">
              Review supplier emissions and identify high-risk partners for targeted engagement.
            </p>
          </div>
          <div className="rounded-3xl bg-gray-50 p-4 text-right dark:bg-gray-950">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total supplier emissions</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{totalEmissions} tCO₂e</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-700 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-950">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Supplier</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Category</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Location</th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Emissions</th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-950">
            {suppliersData.map((supplier) => (
              <tr key={supplier.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/60">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{supplier.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{supplier.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{supplier.location}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">{supplier.emissions} tCO₂e</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${supplier.change <= 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-200'}`}>
                    {supplier.change > 0 ? `+${supplier.change}%` : `${supplier.change}%`}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}