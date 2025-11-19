export default function ReportsCards({ metrics }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm text-gray-500">Clients</div>
        <div className="text-2xl font-semibold">{metrics.clientsTotal}</div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm text-gray-500">Leads (period)</div>
        <div className="text-2xl font-semibold">{metrics.leadsRecent}</div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm text-gray-500">Orders (period)</div>
        <div className="text-2xl font-semibold">{metrics.ordersRecent}</div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm text-gray-500">Open tickets</div>
        <div className="text-2xl font-semibold">{metrics.ticketsOpen}</div>
      </div>
    </div>
  );
}
