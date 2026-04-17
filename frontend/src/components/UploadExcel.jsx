import { useState } from 'react';

const recentFiles = [
  { id: 1, name: 'Supplier_Emission_Q1.xlsx', uploaded: 'Apr 10, 2026', status: 'Processed', details: 'Emissions data from largest tier 1 suppliers.' },
  { id: 2, name: 'Scope3_Data_March.csv', uploaded: 'Apr 07, 2026', status: 'Pending', details: 'A draft file for scope 3 upstream transportation.' },
  { id: 3, name: 'Energy_Report_2025.xlsx', uploaded: 'Mar 28, 2026', status: 'Processed', details: 'Annual energy consumption dataset for facilities.' },
];

export default function UploadExcel() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const formattedSize = selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : '';

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] bg-white p-8 shadow-xl ring-1 ring-gray-200 dark:bg-slate-950 dark:ring-slate-700">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200">
              Upload insights
            </span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">
              Centralized ESG file uploads
            </h1>
            <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Import supplier emissions, energy usage, or sustainability score data with confidence. We support CSV and XLSX uploads for quick processing and analysis.
            </p>
          </div>

          <div className="rounded-[28px] bg-slate-50 p-6 text-right dark:bg-slate-900">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">File type</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">CSV / XLSX</p>
            <p className="mt-4 text-sm font-semibold text-slate-900 dark:text-slate-200">Max size</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">10 MB per file</p>
          </div>
        </div>

        <div className="mt-10 rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-900">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-[24px] bg-white text-4xl shadow-sm dark:bg-slate-950">
            📤
          </div>
          <div className="mt-8 space-y-3">
            <p className="text-xl font-semibold text-slate-950 dark:text-white">Drag &amp; drop files here</p>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
              Upload supplier-ledger files, energy statements, or carbon inventory spreadsheets to keep reporting current.
            </p>
          </div>

          <label className="mt-8 inline-flex cursor-pointer items-center justify-center rounded-full bg-emerald-600 px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">
            Select a file
            <input type="file" accept=".csv,.xlsx" className="sr-only" onChange={handleFileChange} />
          </label>

          {selectedFile ? (
            <div className="mx-auto mt-8 max-w-2xl rounded-3xl bg-white p-6 text-left shadow-sm dark:bg-slate-950">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-base font-semibold text-slate-950 dark:text-white">{selectedFile.name}</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{formattedSize}</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200">
                  Ready to upload
                </span>
              </div>
            </div>
          ) : (
            <p className="mt-8 text-sm text-slate-500 dark:text-slate-400">No file selected yet.</p>
          )}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[32px] bg-white p-8 shadow-xl ring-1 ring-gray-200 dark:bg-slate-950 dark:ring-slate-700">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Upload history</h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                Recent uploads and processing status for your team.
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {recentFiles.map((file) => (
              <div key={file.id} className="rounded-[28px] border border-slate-200 p-5 dark:border-slate-700 dark:bg-slate-900">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-slate-950 dark:text-white">{file.name}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{file.details}</p>
                  </div>
                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${file.status === 'Processed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200'}`}>
                      {file.status}
                    </span>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{file.uploaded}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] bg-slate-900 p-8 text-white shadow-xl">
          <h3 className="text-xl font-semibold">Upload best practices</h3>
          <div className="mt-6 space-y-5 text-sm leading-6 text-slate-300">
            <div>
              <p className="font-semibold text-white">Use structured headers</p>
              <p>Headers should match the expected supplier, activity, and emissions fields for fast ingestion.</p>
            </div>
            <div>
              <p className="font-semibold text-white">Keep values consistent</p>
              <p>Use standardized units and date formats across all supplier data files.</p>
            </div>
            <div>
              <p className="font-semibold text-white">Validate before upload</p>
              <p>Review totals and key fields for accuracy before submitting to reduce processing delays.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
