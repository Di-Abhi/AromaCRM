export default function LeadsHeader({ query, setQuery, statusFilter, setStatusFilter, ownerFilter, setOwnerFilter, sortBy, setSortBy, setPage, openNewLead }) {
    return (
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
                <h1 className="text-2xl font-semibold">Leads</h1>
                <p className="text-sm text-gray-500">Manage incoming leads, convert to clients, or assign owners.</p>
            </div>


            <div className="flex flex-col sm:flex-row gap-2 items-stretch">
                <div className="flex items-center gap-2">
                    <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search leads by name, company, contact or email" className="border rounded px-3 py-2 w-64" />
                    <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="border rounded px-2 py-2">
                        <option value="all">All statuses</option>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="lost">Lost</option>
                    </select>
                    <select value={ownerFilter} onChange={(e) => { setOwnerFilter(e.target.value); setPage(1); }} className="border rounded px-2 py-2">
                        <option value="all">All owners</option>
                        <option value="Sales Team">Sales Team</option>
                        <option value="Akash">Akash</option>
                        <option value="Priya (internal)">Priya (internal)</option>
                    </select>
                </div>


                <div className="flex items-center gap-2">
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border rounded px-2 py-2">
                        <option value="createdAt">Newest</option>
                        <option value="name">Name</option>
                    </select>


                    <button onClick={openNewLead} className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">New Lead</button>
                </div>
            </div>
        </div>
    );
}