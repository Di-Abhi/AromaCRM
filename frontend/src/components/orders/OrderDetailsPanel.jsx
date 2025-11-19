export default function OrderDetailsPanel({ order, onClose, openEditOrder, deleteOrder, markShipped, createInvoice }) {
  if (!order) return null;
  function fmtDate(ts){ if(!ts) return '-'; try{ return new Date(ts).toLocaleString(); }catch{return ts;} }
  return (
    <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-lg z-50">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold">Order details</h3>
        <button onClick={onClose} className="text-gray-600">Close</button>
      </div>
      <div className="p-4 space-y-3">
        <div><div className="text-sm text-gray-500">Order ID</div><div className="font-medium">{order.id}</div></div>
        <div><div className="text-sm text-gray-500">Client</div><div className="font-medium">{order.clientName}</div></div>
        <div><div className="text-sm text-gray-500">Placed</div><div className="font-medium">{fmtDate(order.placedAt)}</div></div>
        <div><div className="text-sm text-gray-500">Items</div><div className="font-medium whitespace-pre-wrap">{(order.items||[]).map(it=>`${it.sku} x${it.qty}`).join('\n')}</div></div>
        <div><div className="text-sm text-gray-500">Total</div><div className="font-medium">₹{order.total}</div></div>
        <div><div className="text-sm text-gray-500">Status</div><div className="font-medium">{order.status}</div></div>
        <div><div className="text-sm text-gray-500">Notes</div><div className="whitespace-pre-wrap">{order.notes}</div></div>

        <div className="flex gap-2 pt-2">
          <button onClick={()=>markShipped(order.id)} className="px-3 py-2 border rounded">Mark Shipped</button>
          <button onClick={()=>createInvoice(order.id)} className="px-3 py-2 border rounded">Create Invoice</button>
          <button onClick={()=>openEditOrder(order)} className="px-3 py-2 border rounded">Edit</button>
        </div>

        <div className="flex gap-2 justify-end pt-4">
          <button onClick={()=>{ if (confirm('Delete order?')) deleteOrder(order.id); }} className="px-3 py-2 text-red-600">Delete</button>
        </div>
      </div>
    </div>
  );
}
