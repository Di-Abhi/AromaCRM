import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Components (place under src/components/orders/)
import OrdersHeader from "../components/orders/OrdersHeader";
import OrdersActionsBar from "../components/orders/OrdersActionBar";
import OrdersList from "../components/orders/OrdersList";
import OrderForm from "../components/orders/OrdersForm";
import OrderDetailsPanel from "../components/orders/OrderDetailsPanel";

const DB_KEY = "aroma_crm_db";
function uid(prefix = "") { return prefix + Date.now().toString(36) + Math.floor(Math.random() * 1000).toString(36); }
function loadDb() { try { const raw = localStorage.getItem(DB_KEY); if (!raw) return null; return JSON.parse(raw); } catch (e) { console.warn("Failed to parse DB", e); return null; } }
function saveDb(db) { try { localStorage.setItem(DB_KEY, JSON.stringify(db)); } catch (e) { console.error("Failed to save DB", e); } }

export default function Orders() {
  const navigate = useNavigate();
  const [db, setDb] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // pending, processing, shipped, cancelled
  const [sortBy, setSortBy] = useState("newest");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [detailOrder, setDetailOrder] = useState(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;
  const importInputRef = useRef(null);

  useEffect(() => {
    const userRaw = localStorage.getItem("aroma_user") || localStorage.getItem("aroma_current_user");
    if (!userRaw) {
      // navigate('/login');
    }
    const existing = loadDb();
    if (existing) { setDb(existing); setOrders(existing.orders || []); return; }

    const seed = {
      clients: [], leads: [], tickets: [], installations: [],
      orders: [
        { id: uid('o_'), clientName: 'Grand Palms Hotel', items: [{sku:'SMP-01', qty:5}], total: 15000, status: 'pending', placedAt: Date.now() - 1000*60*60*24*2, notes: 'Sample diffusers for conference' },
        { id: uid('o_'), clientName: 'BlueSuites Co-working', items: [{sku:'DIF-20', qty:2}], total: 8000, status: 'shipped', placedAt: Date.now() - 1000*60*60*24*10, shippedAt: Date.now() - 1000*60*60*24*3, notes: 'Monthly refill' }
      ]
    };
    saveDb(seed); setDb(seed); setOrders(seed.orders);
  }, [navigate]);

  useEffect(() => {
    if (!orders) return;
    setDb(prevDb => {
      const current = prevDb || { clients: [], leads: [], tickets: [], installations: [], orders: [] };
      const next = { ...current, orders };
      saveDb(next);
      return next;
    });
  }, [orders]);

  const filtered = useMemo(() => {
    let list = (orders || []).slice();
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(o => (o.clientName || '').toLowerCase().includes(q) || (o.id || '').toLowerCase().includes(q));
    }
    if (statusFilter !== 'all') list = list.filter(o => o.status === statusFilter);
    if (sortBy === 'newest') list.sort((a,b) => (b.placedAt||0) - (a.placedAt||0));
    if (sortBy === 'oldest') list.sort((a,b) => (a.placedAt||0) - (b.placedAt||0));
    return list;
  }, [orders, query, statusFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  useEffect(() => { if (page > totalPages) setPage(totalPages); }, [filtered.length, totalPages, page]);

  function toggleSelect(id) { setSelectedIds(s => { const next = new Set(s); if (next.has(id)) next.delete(id); else next.add(id); return next; }); }
  function toggleSelectAllVisible() { const all = visible.every(o => selectedIds.has(o.id)); setSelectedIds(s => { const next = new Set(s); if (all) visible.forEach(o=>next.delete(o.id)); else visible.forEach(o=>next.add(o.id)); return next; }); }
  function clearSelection() { setSelectedIds(new Set()); }

  function openNewOrder() { setEditing({ id: null, clientName:'', items:[], total:0, status:'pending', notes:'' }); setShowForm(true); }
  function openEditOrder(o) { setEditing({...o}); setShowForm(true); setDetailOrder(null); }

  function saveOrder(payload) {
    if (!payload.clientName) { alert('Client name required'); return; }
    if (!payload.id) {
      const newOrder = { ...payload, id: uid('o_'), placedAt: Date.now() };
      setOrders(prev => [newOrder, ...prev]); setShowForm(false); setEditing(null); setDetailOrder(newOrder);
    } else {
      const updated = { ...payload, updatedAt: Date.now() };
      setOrders(prev => prev.map(p => p.id === payload.id ? updated : p)); setShowForm(false); setEditing(null); setDetailOrder(updated);
    }
  }

  function deleteOrder(id) { if (!confirm('Delete order?')) return; setOrders(prev => prev.filter(o => o.id !== id)); setSelectedIds(s => { const next = new Set(s); next.delete(id); return next; }); if (detailOrder?.id === id) setDetailOrder(null); }
  function bulkDeleteSelected() { if (!selectedIds.size) return; if (!confirm(`Delete ${selectedIds.size} selected orders?`)) return; setOrders(prev => prev.filter(o => !selectedIds.has(o.id))); setSelectedIds(new Set()); setDetailOrder(null); }

  function markShipped(id) { setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'shipped', shippedAt: Date.now() } : o)); }
  function createInvoice(id) { alert('Invoice created for order ' + id + ' (demo)'); }

  function exportJson() { const payload = { orders: filtered, clients: db?.clients || [] }; const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `orders_export_${new Date().toISOString().slice(0,10)}.json`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); }

  function importJson(file) { if (!file) return; const reader = new FileReader(); reader.onload = (e) => { try { const parsed = JSON.parse(e.target.result); if (!Array.isArray(parsed.orders)) throw new Error("Missing 'orders' array"); setOrders(parsed.orders); } catch(err) { alert('Import failed: ' + err.message); } }; reader.readAsText(file); }

  return (
    <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto">
      <OrdersHeader query={query} setQuery={setQuery} statusFilter={statusFilter} setStatusFilter={setStatusFilter} sortBy={sortBy} setSortBy={setSortBy} openNewOrder={openNewOrder} />

      <OrdersActionsBar selectedIds={selectedIds} clearSelection={clearSelection} bulkDeleteSelected={bulkDeleteSelected} exportJson={exportJson} importJson={importJson} importInputRef={importInputRef} />

      <OrdersList visibleOrders={visible} selectedIds={selectedIds} toggleSelect={toggleSelect} toggleSelectAllVisible={toggleSelectAllVisible} setDetailOrder={setDetailOrder} openEditOrder={openEditOrder} deleteOrder={deleteOrder} markShipped={markShipped} createInvoice={createInvoice} page={page} setPage={setPage} totalPages={totalPages} />

      {showForm && <OrderForm value={editing} onCancel={() => setShowForm(false)} onSave={saveOrder} />}

      <OrderDetailsPanel order={detailOrder} onClose={() => setDetailOrder(null)} openEditOrder={openEditOrder} deleteOrder={deleteOrder} markShipped={markShipped} createInvoice={createInvoice} />
    </div>
  );
}