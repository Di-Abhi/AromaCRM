  export default function OrdersList({ visibleOrders, selectedIds, toggleSelect, toggleSelectAllVisible, setDetailOrder, openEditOrder, deleteOrder, markShipped, createInvoice, page, setPage, totalPages }) {
    function fmtDate(ts){ if(!ts) return '-'; try{ return new Date(ts).toLocaleString(); }catch{return ts; } }
  
    return (
      <div className="bg-white shadow rounded">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3"><input type="checkbox" onChange={toggleSelectAllVisible} checked={visibleOrders.length>0 && visibleOrders.every(o=>selectedIds.has(o.id))} /></th>
              <th className="p-3 text-left">Order</th>
              <th className="p-3 text-left">Client</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Placed</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleOrders.map(o=> (
              <tr key={o.id} className="border-t hover:bg-gray-50">
                <td className="p-3"><input type="checkbox" checked={selectedIds.has(o.id)} onChange={()=>toggleSelect(o.id)} /></td>
                <td className="p-3 cursor-pointer" onClick={()=>setDetailOrder(o)}>
                  <div className="font-medium">{o.id}</div>
                  <div className="text-sm text-gray-500">{o.notes}</div>
                </td>
                <td className="p-3">{o.clientName}</td>
                <td className="p-3">₹{o.total}</td>
                <td className="p-3">{fmtDate(o.placedAt)}</td>
                <td className="p-3"><span className="px-2 py-1 rounded text-sm border">{o.status}</span></td>
                <td className="p-3 flex gap-2">
                  <button onClick={()=>markShipped(o.id)} className="text-sm border px-2 py-1 rounded">Mark Shipped</button>
                  <button onClick={()=>createInvoice(o.id)} className="text-sm border px-2 py-1 rounded">Invoice</button>
                  <button onClick={()=>openEditOrder(o)} className="text-sm border px-2 py-1 rounded">Edit</button>
                  <button onClick={()=>deleteOrder(o.id)} className="text-sm text-red-600">Delete</button>
                </td>
              </tr>
            ))}
            {visibleOrders.length===0 && (<tr><td colSpan={7} className="p-6 text-center text-gray-500">No orders found.</td></tr>)}
          </tbody>
        </table>
  
        <div className="p-3 flex items-center justify-between">
          <div className="text-sm text-gray-600">Showing {visibleOrders.length} orders</div>
          <div className="flex items-center gap-2">
            <button onClick={()=>setPage(Math.max(1,page-1))} className="px-3 py-1 border rounded">Prev</button>
            <div className="px-3">{page} / {totalPages}</div>
            <button onClick={()=>setPage(Math.min(totalPages,page+1))} className="px-3 py-1 border rounded">Next</button>
          </div>
        </div>
      </div>
    );
  }