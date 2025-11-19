import React from 'react';
export default function InstallationsHeader({ query, setQuery, filterStatus, setFilterStatus, sortBy, setSortBy, openNew }) {
  return (
    <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Installations</h1>
        <p className="text-sm text-gray-500">Manage installation schedules, assign technicians, and mark completion.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 items-stretch">
        <div className="flex items-center gap-2">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by account, address or technician" className="border rounded px-3 py-2 w-64" />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border rounded px-2 py-2">
            <option value="all">All statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border rounded px-2 py-2">
            <option value="newest">Nearest first</option>
            <option value="oldest">Earliest first</option>
          </select>
          <button onClick={openNew} className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">New Install</button>
        </div>
      </div>
    </div>
  );
}