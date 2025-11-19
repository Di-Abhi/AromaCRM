export default function OrdersHeader({ query, setQuery, statusFilter, setStatusFilter, sortBy, setSortBy, openNewOrder }) {
  return (
    <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Orders</h1>
        <p className="text-sm text-gray-500">View and manage orders, shipments and invoices.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 items-stretch">
        <div className="flex items-center gap-2">
          <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search by client or order id" className="border rounded px-3 py-2 w-64" />
          <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)} className="border rounded px-2 py-2">
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <select value={sortBy} onChange={(e)=>setSortBy(e.target.value)} className="border rounded px-2 py-2">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
          <button onClick={openNewOrder} className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">New Order</button>
        </div>
      </div>
    </div>
  );
}

