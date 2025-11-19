export default function ReportsHeader({ exportAll, importRef, importAll }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Reports</h1>
        <p className="text-sm text-gray-500">Overview, trends and exports for your CRM data.</p>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={exportAll} className="px-3 py-2 border rounded">Export DB</button>
        <label className="px-3 py-2 border rounded cursor-pointer">Import DB<input ref={importRef} type="file" accept="application/json" onChange={(e)=>importAll && importAll(e.target.files && e.target.files[0])} className="hidden"/></label>
      </div>
    </div>
  );
}