import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Components (place under src/components/tickets/)
import TicketsHeader from "../components/tickets/TicketsHeader";
import TicketsActionsBar from "../components/tickets/TicketsActionsBar";
import TicketsList from "../components/tickets/TicketsList";
import TicketForm from "../components/tickets//TicketsForm";
import TicketDetailsPanel from "../components/tickets/TicketDetailsPanel";

const DB_KEY = "aroma_crm_db";
function uid(prefix = "") { return prefix + Date.now().toString(36) + Math.floor(Math.random() * 1000).toString(36); }
function loadDb() { try { const raw = localStorage.getItem(DB_KEY); if (!raw) return null; return JSON.parse(raw); } catch (e) { console.warn("Failed to parse DB", e); return null; } }
function saveDb(db) { try { localStorage.setItem(DB_KEY, JSON.stringify(db)); } catch (e) { console.error("Failed to save DB", e); } }

export default function Tickets() {
  const navigate = useNavigate();
  const [db, setDb] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // open, in_progress, resolved, closed
  const [priorityFilter, setPriorityFilter] = useState("all"); // low, medium, high
  const [sortBy, setSortBy] = useState("newest");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [detailTicket, setDetailTicket] = useState(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;
  const importInputRef = useRef(null);

  useEffect(() => {
    const userRaw = localStorage.getItem("aroma_user") || localStorage.getItem("aroma_current_user");
    if (!userRaw) {
      // navigate('/login');
    }

    const existing = loadDb();
    if (existing) { setDb(existing); setTickets(existing.tickets || []); return; }

    const seed = {
      clients: [], leads: [], orders: [], installations: [],
      tickets: [
        { id: uid('t_'), subject: 'Diffuser stopped working', client: 'Grand Palms Hotel', createdAt: Date.now() - 1000*60*60*24*4, status: 'open', priority: 'high', assignee: 'Ravi', messages: ['Reported machine not reaching target RPM.'], notes: 'Urgent on-site visit recommended.' },
        { id: uid('t_'), subject: 'Invoice discrepancy', client: 'BlueSuites Co-working', createdAt: Date.now() - 1000*60*60*24*10, status: 'resolved', priority: 'medium', assignee: 'Akash', messages: ['Adjusted invoice to include discount.'], notes: 'Follow-up with accounts.' }
      ]
    };

    saveDb(seed); setDb(seed); setTickets(seed.tickets);
  }, [navigate]);

  useEffect(() => { if (!tickets) return; setDb(prev => { const curr = prev || { clients: [], leads: [], orders: [], installations: [], tickets: [] }; const next = { ...curr, tickets }; saveDb(next); return next; }); }, [tickets]);

  const filtered = useMemo(() => {
    let list = (tickets || []).slice();
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(t => (t.subject||'').toLowerCase().includes(q) || (t.client||'').toLowerCase().includes(q) || (t.id||'').toLowerCase().includes(q));
    }
    if (statusFilter !== 'all') list = list.filter(t => t.status === statusFilter);
    if (priorityFilter !== 'all') list = list.filter(t => t.priority === priorityFilter);
    if (sortBy === 'newest') list.sort((a,b) => (b.createdAt||0) - (a.createdAt||0));
    if (sortBy === 'oldest') list.sort((a,b) => (a.createdAt||0) - (b.createdAt||0));
    return list;
  }, [tickets, query, statusFilter, priorityFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
  useEffect(()=>{ if (page > totalPages) setPage(totalPages); }, [filtered.length, totalPages, page]);

  function toggleSelect(id) { setSelectedIds(s=>{ const next = new Set(s); if (next.has(id)) next.delete(id); else next.add(id); return next; }); }
  function toggleSelectAllVisible() { const all = visible.every(t => selectedIds.has(t.id)); setSelectedIds(s=>{ const next = new Set(s); if (all) visible.forEach(v=>next.delete(v.id)); else visible.forEach(v=>next.add(v.id)); return next; }); }
  function clearSelection() { setSelectedIds(new Set()); }

  function openNewTicket() { setEditing({ id: null, subject:'', client:'', priority:'medium', status:'open', assignee:'', messages:[], notes:'' }); setShowForm(true); }
  function openEditTicket(t) { setEditing({...t}); setShowForm(true); setDetailTicket(null); }

  function saveTicket(payload) {
    if (!payload.subject || !payload.client) { alert('Subject and client required'); return; }
    if (!payload.id) { const newTicket = { ...payload, id: uid('t_'), createdAt: Date.now() }; setTickets(prev => [newTicket, ...prev]); setDetailTicket(newTicket); }
    else { const updated = { ...payload, updatedAt: Date.now() }; setTickets(prev => prev.map(p => p.id === payload.id ? updated : p)); setDetailTicket(updated); }
    setShowForm(false); setEditing(null);
  }

  function deleteTicket(id) { if (!confirm('Delete ticket?')) return; setTickets(prev => prev.filter(t => t.id !== id)); setSelectedIds(s=>{ const next = new Set(s); next.delete(id); return next; }); if (detailTicket?.id === id) setDetailTicket(null); }
  function bulkDeleteSelected() { if (!selectedIds.size) return; if (!confirm(`Delete ${selectedIds.size} selected tickets?`)) return; setTickets(prev => prev.filter(t => !selectedIds.has(t.id))); setSelectedIds(new Set()); setDetailTicket(null); }

  function assignTicket(id) { const assignee = prompt('Assign to:'); if (!assignee) return; setTickets(prev => prev.map(t => t.id === id ? { ...t, assignee, updatedAt: Date.now() } : t)); }
  function escalateTicket(id) { setTickets(prev => prev.map(t => t.id === id ? { ...t, priority: 'high', updatedAt: Date.now() } : t)); }
  function closeTicket(id) { setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'closed', closedAt: Date.now() } : t)); }

  function exportJson() { const payload = { tickets: filtered, clients: db?.clients || [] }; const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `tickets_export_${new Date().toISOString().slice(0,10)}.json`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); }
  function importJson(file) { if (!file) return; const reader = new FileReader(); reader.onload = (e)=>{ try { const parsed = JSON.parse(e.target.result); if (!Array.isArray(parsed.tickets)) throw new Error("Missing 'tickets' array"); setTickets(parsed.tickets); } catch(err){ alert('Import failed: ' + err.message); } }; reader.readAsText(file); }

  return (
    <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto">
      <TicketsHeader query={query} setQuery={setQuery} statusFilter={statusFilter} setStatusFilter={setStatusFilter} priorityFilter={priorityFilter} setPriorityFilter={setPriorityFilter} sortBy={sortBy} setSortBy={setSortBy} openNewTicket={openNewTicket} />

      <TicketsActionsBar selectedIds={selectedIds} clearSelection={clearSelection} bulkDeleteSelected={bulkDeleteSelected} exportJson={exportJson} importJson={importJson} importInputRef={importInputRef} />

      <TicketsList visibleTickets={visible} selectedIds={selectedIds} toggleSelect={toggleSelect} toggleSelectAllVisible={toggleSelectAllVisible} setDetailTicket={setDetailTicket} openEditTicket={openEditTicket} deleteTicket={deleteTicket} assignTicket={assignTicket} escalateTicket={escalateTicket} closeTicket={closeTicket} page={page} setPage={setPage} totalPages={totalPages} />

      {showForm && <TicketForm value={editing} onCancel={() => setShowForm(false)} onSave={saveTicket} />}

      <TicketDetailsPanel ticket={detailTicket} onClose={() => setDetailTicket(null)} openEditTicket={openEditTicket} deleteTicket={deleteTicket} assignTicket={assignTicket} escalateTicket={escalateTicket} closeTicket={closeTicket} />
    </div>
  );
}