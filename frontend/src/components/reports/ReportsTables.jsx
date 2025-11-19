export default function ReportsTables({ db, showing, query, range }) {
  const data = db || { clients:[], leads:[], orders:[], installations:[], tickets:[] };
  function quickFilter(arr, keys=['name']){
    const q = (query||'').toLowerCase().trim();
    if(!q) return arr;
    return arr.filter(item => keys.some(k => (''+(item[k]||'')).toLowerCase().includes(q)));
  }

  if (showing === 'orders') {
    const items = quickFilter(data.orders || [], ['id','clientName','notes']);
    return (
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Orders</h3>
        <table className="min-w-full table-auto text-sm">
          <thead><tr className="bg-gray-50"><th className="p-2 text-left">ID</th><th className="p-2 text-left">Client</th><th className="p-2">Total</th><th className="p-2">Placed</th><th className="p-2">Status</th></tr></thead>
          <tbody>
            {(items||[]).map(o => (
              <tr key={o.id} className="border-t"><td className="p-2">{o.id}</td><td className="p-2">{o.clientName}</td><td className="p-2">₹{o.total}</td><td className="p-2">{o.placedAt?new Date(o.placedAt).toLocaleDateString():'-'}</td><td className="p-2">{o.status}</td></tr>
            ))}
            {(!items||items.length===0) && <tr><td colSpan={5} className="p-4 text-center text-gray-500">No orders</td></tr>}
          </tbody>
        </table>
      </div>
    );
  }

  if (showing === 'installations') {
    const items = quickFilter(data.installations || [], ['accountId','address','technician']);
    return (
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-3">Installations</h3>
        <table className="min-w-full table-auto text-sm">
          <thead><tr className="bg-gray-50"><th className="p-2 text-left">Account</th><th className="p-2">Scheduled</th><th className="p-2">Tech</th><th className="p-2">Status</th></tr></thead>
          <tbody>
            {items.map(i => (<tr key={i.id} className="border-t"><td className="p-2">{i.accountId}</td><td className="p-2">{i.scheduledAt?new Date(i.scheduledAt).toLocaleDateString():'-'}</td><td className="p-2">{i.technician}</td><td className="p-2">{i.status}</td></tr>))}
            {(!items||items.length===0) && <tr><td colSpan={4} className="p-4 text-center text-gray-500">No installations</td></tr>}
          </tbody>
        </table>
      </div>
    );
  }
   const recentLeads = (data.leads||[]).slice(0,10);
    const recentOrders = (data.orders||[]).slice(0,10);
  
    return (
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-3">Recent Leads</h3>
          <ul className="text-sm space-y-2">{recentLeads.map(l => <li key={l.id} className="flex justify-between"><div>{l.name} — {l.company}</div><div className="text-gray-500">{l.status}</div></li>)}</ul>
          {(!recentLeads || recentLeads.length===0) && <div className="text-gray-500">No leads</div>}
        </div>
  
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-3">Recent Orders</h3>
          <ul className="text-sm space-y-2">{recentOrders.map(o => <li key={o.id} className="flex justify-between"><div>{o.clientName}</div><div className="text-gray-500">₹{o.total}</div></li>)}</ul>
          {(!recentOrders||recentOrders.length===0) && <div className="text-gray-500">No orders</div>}
        </div>
      </div>
    );
  }