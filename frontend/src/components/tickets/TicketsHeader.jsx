export default function TicketsHeader({ query, setQuery, statusFilter, setStatusFilter, priorityFilter, setPriorityFilter, sortBy, setSortBy, openNewTicket }) {
  return (
    <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Support Tickets</h1>
        <p className="text-sm text-gray-500">Track and resolve customer issues — assign, escalate, and close.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 items-stretch">
        <div className="flex items-center gap-2">
          <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search by subject, client or id" className="border rounded px-3 py-2 w-64" />
          <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)} className="border rounded px-2 py-2">
            <option value="all">All statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select value={priorityFilter} onChange={(e)=>setPriorityFilter(e.target.value)} className="border rounded px-2 py-2">
            <option value="all">All priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <select value={sortBy} onChange={(e)=>setSortBy(e.target.value)} className="border rounded px-2 py-2">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
          <button onClick={openNewTicket} className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">New Ticket</button>
        </div>
      </div>
    </div>
  );
}