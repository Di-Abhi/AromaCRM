export default function ReportsFilters({ range, setRange, showing, setShowing, query, setQuery }) {
  return (
    <div className="bg-white p-4 rounded shadow flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div className="flex items-center gap-2">
        <select value={range} onChange={(e)=>setRange(e.target.value)} className="border rounded px-2 py-2">
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="all">All time</option>
        </select>

        <select value={showing} onChange={(e)=>setShowing(e.target.value)} className="border rounded px-2 py-2">
          <option value="overview">Overview</option>
          <option value="orders">Orders</option>
          <option value="installations">Installations</option>
          <option value="leads">Leads</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Filter table..." className="border rounded px-3 py-2" />
      </div>
    </div>
  );
}