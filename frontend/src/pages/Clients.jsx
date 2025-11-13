import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Calendar,
  X, 
  ChevronLeft,
  ChevronRight,
  Clipboard,
  ShoppingCart,
  Zap,
  Wrench,
  Download,
  Upload,
  UserCheck
} from "lucide-react";

const DB_KEY = "aroma_crm_db";

function uid(prefix = "") {
  return prefix + Date.now().toString(36) + Math.floor(Math.random() * 1000).toString(36);
}

// Demo localStorage helpers
function loadDb() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to parse localStorage data", e);
    return null;
  }
}

function saveDb(db) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch (e) {
    console.error("Failed to save to localStorage", e);
  }
}

/* ==================== MAIN COMPONENT ==================== */
export default function Clients() {
  const navigate = useNavigate();
  const [db, setDb] = useState(null);
  const [clients, setClients] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [detailClient, setDetailClient] = useState(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  const importInputRef = useRef(null);

  /* ---------- Initialize localStorage on mount ---------- */
  useEffect(() => {
    const existing = loadDb();
    if (existing) {
      setDb(existing);
      setClients(existing.clients || []);
      return;
    }

    // Demo seed data if no localStorage exists
    const seed = {
      clients: [
        {
          id: uid("c_"),
          name: "Grand Palms Hotel",
          type: "hotel",
          contact: "Anita Sharma",
          email: "anita@grandpalms.example",
          phone: "+91 98765 43210",
          address: "Marine Drive, Mumbai",
          notes: "Prefers woody floral blends. Trial 2/2025.",
          createdAt: Date.now()
        },
        {
          id: uid("c_"),
          name: "BlueSuites Co-working",
          type: "office",
          contact: "Rohan Mehta",
          email: "rohan@bluesuites.example",
          phone: "+91 91234 56789",
          address: "Koramangala, Bengaluru",
          notes: "Testing citrus diffuser in common area.",
          createdAt: Date.now() - 1000 * 60 * 60 * 24 * 40
        },
        {
          id: uid("c_"),
          name: "Zen Spa & Wellness",
          type: "spa",
          contact: "Priya Singh",
          email: "priya@zenspa.example",
          phone: "+91 90000 11111",
          address: "DLF Phase 4, Gurugram",
          notes: "Requires calming lavender and eucalyptus scents.",
          createdAt: Date.now() - 1000 * 60 * 60 * 24 * 90
        }
      ].sort((a, b) => b.createdAt - a.createdAt),
      orders: [],
      installations: [],
      leads: [],
      tickets: []
    };
    saveDb(seed);
    setDb(seed);
    setClients(seed.clients);
  }, [navigate]);

  /* ---------- Sync clients to localStorage whenever they change ---------- */
  useEffect(() => {
    if (!db) return;
    const next = { ...db, clients };
    setDb(next);
    saveDb(next);
  }, [clients]);

  /* ---------- Filtered & sorted client list ---------- */
  const filtered = useMemo(() => {
    let list = (clients || []).slice();

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) =>
          (c.name || "").toLowerCase().includes(q) ||
          (c.contact || "").toLowerCase().includes(q) ||
          (c.email || "").toLowerCase().includes(q)
      );
    }

    if (filterType !== "all") {
      list = list.filter((c) => c.type === filterType);
    }

    if (sortBy === "name") {
      list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortBy === "newest") {
      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }

    return list;
  }, [clients, query, filterType, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [filtered.length, totalPages, page]);

  /* ---------- Selection helpers ---------- */
  function toggleSelect(id) {
    setSelectedIds((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAllVisible() {
    const allVisibleSelected = visible.every(c => selectedIds.has(c.id));
    setSelectedIds((s) => {
      const next = new Set(s);
      if (allVisibleSelected) {
        visible.forEach((c) => next.delete(c.id));
      } else {
        visible.forEach((c) => next.add(c.id));
      }
      return next;
    });
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  /* ---------- CRUD Operations (all local) ---------- */
  function openNewClient() {
    setEditing({
      id: null,
      name: "",
      type: "hotel",
      contact: "",
      email: "",
      phone: "",
      address: "",
      notes: ""
    });
    setShowForm(true);
  }

  function openEditClient(c) {
    setEditing({ ...c });
    setShowForm(true);
    setDetailClient(null);
  }

  function saveClient(payload) {
    if (!payload.name || !payload.email) {
      alert("Please add at least a business name and email.");
      return;
    }
    if (!payload.id) {
      // Create new client (local only)
      const newClient = { ...payload, id: uid("c_"), createdAt: Date.now() };
      setClients((prev) => [newClient, ...prev]);
      setShowForm(false);
      setEditing(null);
      setDetailClient(newClient);
    } else {
      // Update existing client (local only)
      const updatedClient = { ...payload, updatedAt: Date.now() };
      setClients((prev) => prev.map((c) => (c.id === payload.id ? updatedClient : c)));
      setShowForm(false);
      setEditing(null);
      setDetailClient(updatedClient);
    }
  }

  function deleteClient(id) {
    if (!confirm("Are you sure you want to delete this client? This action cannot be undone.")) return;
    setClients((prev) => prev.filter((c) => c.id !== id));
    setSelectedIds((s) => {
      const next = new Set(s);
      next.delete(id);
      return next;
    });
    if (detailClient?.id === id) setDetailClient(null);
  }

  function bulkDeleteSelected() {
    if (!selectedIds.size) return;
    if (!confirm(`Delete ${selectedIds.size} selected clients?`)) return;
    setClients((prev) => prev.filter((c) => !selectedIds.has(c.id)));
    setSelectedIds(new Set());
    setDetailClient(null);
  }

  /* ---------- Demo Quick Actions (no backend) ---------- */
  function quickCreate(type, client) {
    // These are demo actions - in production, these would call backend APIs
    if (!db) return;
    const next = loadDb();
    if (!next) return;

    if (type === "order") {
      const order = { id: uid("o_"), clientId: client.id, total: 25000, placedAt: Date.now(), note: "Quick order (demo)" };
      next.orders = [order, ...(next.orders || [])];
      saveDb(next);
      setDb(next);
      alert(`[DEMO] Order ${order.id} created for ${client.name}.`);
      return;
    }

    if (type === "install") {
      const inst = { id: uid("i_"), clientId: client.id, accountId: client.name, scheduledAt: Date.now() + 1000 * 60 * 60 * 24 * 7, status: "scheduled" };
      next.installations = [inst, ...(next.installations || [])];
      saveDb(next);
      setDb(next);
      alert(`[DEMO] Installation scheduled for ${client.name}.`);
      return;
    }

    if (type === "ticket") {
      const ticket = { id: uid("t_"), clientId: client.id, status: "open", createdAt: Date.now(), subject: "Support request (demo)" };
      next.tickets = [ticket, ...(next.tickets || [])];
      saveDb(next);
      setDb(next);
      alert(`[DEMO] Support ticket ${ticket.id} created for ${client.name}.`);
      return;
    }
  }

  /* ---------- Import/Export (localStorage only) ---------- */
  function exportJson() {
    const payload = { 
      clients: filtered,
      orders: db?.orders || [], 
      installations: db?.installations || [], 
      leads: db?.leads || [],
      tickets: db?.tickets || []
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aroma_clients_export_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function importJson(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (!Array.isArray(parsed.clients)) throw new Error("Missing or invalid 'clients' array in file.");
        
        const clientMap = new Map(clients.map(c => [c.id, c]));
        let newCount = 0;
        let updateCount = 0;

        parsed.clients.forEach(importedClient => {
          if (importedClient.id && clientMap.has(importedClient.id)) {
            clientMap.set(importedClient.id, { ...clientMap.get(importedClient.id), ...importedClient, updatedAt: Date.now() });
            updateCount++;
          } else {
            const newId = uid("c_");
            clientMap.set(newId, { ...importedClient, id: newId, createdAt: importedClient.createdAt || Date.now() });
            newCount++;
          }
        });
        
        setClients(Array.from(clientMap.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
        alert(`Import successful! ${newCount} new clients added, ${updateCount} clients updated.`);

        if (importInputRef.current) {
          importInputRef.current.value = '';
        }
      } catch (err) {
        alert("Failed to import JSON data. Error: " + err.message);
      }
    };
    reader.readAsText(file);
  }

  /* ---------- UI Components ---------- */
  function ClientRow({ c }) {
    const isSelected = selectedIds.has(c.id);
    return (
      <tr 
        className={`border-b border-gray-100 transition-colors cursor-pointer ${isSelected ? 'bg-purple-50 hover:bg-purple-100' : 'hover:bg-gray-50'}`}
        onClick={(e) => {
          if (e.target.type !== 'checkbox' && e.target.tagName !== 'BUTTON') {
            setDetailClient(c);
          }
        }}
      >
        <td className="p-4 w-12 text-center">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => toggleSelect(c.id)}
            className="h-4 w-4 rounded text-purple-600 border-gray-300 focus:ring-purple-500"
            onClick={(e) => e.stopPropagation()}
          />
        </td>
        <td className="p-4">
          <div className="font-semibold text-gray-800">{c.name}</div>
          <div className="text-xs text-purple-600 font-medium capitalize mt-0.5">{c.type}</div>
          <div className="text-xs text-gray-500">{c.contact}</div>
        </td>
        <td className="p-4 text-sm text-gray-600">{c.email}</td>
        <td className="p-4 hidden lg:table-cell text-sm text-gray-600">{c.phone}</td>
        <td className="p-4 text-xs text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</td>
        <td className="p-4 text-right">
          <div className="flex items-center justify-end gap-2">
            <button 
              onClick={(e) => { e.stopPropagation(); openEditClient(c); }} 
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-purple-600 transition-colors"
              title="Edit Client"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setDetailClient(c); }} 
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-purple-600 transition-colors"
              title="View Details"
            >
              <UserCheck className="w-4 h-4" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); deleteClient(c.id); }} 
              className="p-2 rounded-full text-rose-500 hover:bg-rose-50 transition-colors"
              title="Delete Client"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  function ClientForm({ value, onCancel, onSave }) {
    const [local, setLocal] = useState({ ...(value || {}) });

    useEffect(() => setLocal({ ...(value || {}) }), [value]);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <div className="bg-white rounded-2xl w-full max-w-3xl p-6 shadow-2xl relative">
          <div className="flex items-center justify-between mb-6 border-b pb-3">
            <h2 className="text-xl font-bold text-gray-800">{local.id ? "Edit Client" : "Add New Client"}</h2>
            <button 
              onClick={onCancel} 
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <label className="block">
              <div className="text-xs font-medium text-gray-600 mb-1">Business Name <span className="text-rose-500">*</span></div>
              <input value={local.name || ""} onChange={(e) => setLocal((s) => ({ ...s, name: e.target.value }))} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-purple-500 focus:ring-purple-500 outline-none" placeholder="e.g., Grand Palms Hotel" />
            </label>

            <label className="block">
              <div className="text-xs font-medium text-gray-600 mb-1">Type</div>
              <select value={local.type || "hotel"} onChange={(e) => setLocal((s) => ({ ...s, type: e.target.value }))} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm appearance-none bg-white focus:border-purple-500 focus:ring-purple-500 outline-none">
                <option value="hotel">Hotel</option>
                <option value="retail">Retail</option>
                <option value="office">Office</option>
                <option value="spa">Spa</option>
                <option value="other">Other</option>
              </select>
            </label>

            <label className="block">
              <div className="text-xs font-medium text-gray-600 mb-1">Primary Contact</div>
              <input value={local.contact || ""} onChange={(e) => setLocal((s) => ({ ...s, contact: e.target.value }))} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-purple-500 focus:ring-purple-500 outline-none" placeholder="Contact Person" />
            </label>

            <label className="block">
              <div className="text-xs font-medium text-gray-600 mb-1">Email <span className="text-rose-500">*</span></div>
              <input type="email" value={local.email || ""} onChange={(e) => setLocal((s) => ({ ...s, email: e.target.value }))} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-purple-500 focus:ring-purple-500 outline-none" placeholder="Email Address" />
            </label>

            <label className="block">
              <div className="text-xs font-medium text-gray-600 mb-1">Phone</div>
              <input type="tel" value={local.phone || ""} onChange={(e) => setLocal((s) => ({ ...s, phone: e.target.value }))} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-purple-500 focus:ring-purple-500 outline-none" placeholder="Phone Number" />
            </label>
            
            <label className="block col-span-1 md:col-span-2">
              <div className="text-xs font-medium text-gray-600 mb-1">Address</div>
              <input value={local.address || ""} onChange={(e) => setLocal((s) => ({ ...s, address: e.target.value }))} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-purple-500 focus:ring-purple-500 outline-none" placeholder="Street Address, City, State/Province" />
            </label>

            <label className="block col-span-1 md:col-span-2">
              <div className="text-xs font-medium text-gray-600 mb-1">Notes</div>
              <textarea value={local.notes || ""} onChange={(e) => setLocal((s) => ({ ...s, notes: e.target.value }))} rows={3} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-purple-500 focus:ring-purple-500 outline-none" placeholder="Client preferences, trial results, special instructions..." />
            </label>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 border-t pt-4">
            <button onClick={onCancel} className="px-4 py-2 rounded-xl text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors">Cancel</button>
            <button onClick={() => onSave(local)} className="px-4 py-2 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/30">
              Save Client
            </button>
          </div>
        </div>
      </div>
    );
  }

  function DetailsPanel({ client, onClose }) {
    if (!client) return null;
    return (
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose}>
        <div 
          className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 overflow-auto transform transition-transform duration-300 ease-in-out"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-5 border-b flex items-center justify-between sticky top-0 bg-white">
            <div>
              <div className="text-xl font-bold text-gray-800">{client.name}</div>
              <div className="text-sm font-medium text-purple-600 capitalize mt-0.5">{client.type} • {client.contact}</div>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Close details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 space-y-5">
            
            {/* Contact Info */}
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-gray-700 border-b pb-2">Contact Details</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <div className="text-xs text-gray-500">Address</div>
                  <div className="text-sm font-medium text-gray-800 whitespace-pre-wrap">{client.address || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Email</div>
                  <div className="text-sm font-medium text-purple-600">{client.email}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Phone</div>
                  <div className="text-sm font-medium text-gray-800">{client.phone || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-gray-700 border-b pb-2">Notes</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">{client.notes || 'No notes available.'}</p>
            </div>

            {/* Quick Actions (Demo) */}
            <div className="pt-3 border-t space-y-3">
              <h3 className="text-base font-semibold text-gray-700">Quick Actions (Demo)</h3>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => quickCreate("order", client)} className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-gray-300 text-sm hover:bg-gray-50 transition-colors">
                  <ShoppingCart className="w-4 h-4 text-gray-600" /> Order
                </button>
                <button onClick={() => quickCreate("install", client)} className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-gray-300 text-sm hover:bg-gray-50 transition-colors">
                  <Zap className="w-4 h-4 text-gray-600" /> Install
                </button>
                <button onClick={() => quickCreate("ticket", client)} className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-gray-300 text-sm hover:bg-gray-50 transition-colors">
                  <Wrench className="w-4 h-4 text-gray-600" /> Ticket
                </button>
                <button 
                  onClick={() => { navigator.clipboard.writeText(client.email); alert("Email copied!"); }} 
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-gray-300 text-sm hover:bg-gray-50 transition-colors"
                >
                  <Clipboard className="w-4 h-4 text-gray-600" /> Copy Email
                </button>
              </div>
              <div className="flex justify-between pt-3">
                <button onClick={() => openEditClient(client)} className="flex items-center gap-2 px-3 py-2 text-sm text-purple-600 font-medium hover:text-purple-700">
                  <Edit2 className="w-4 h-4" /> Edit Client
                </button>
                <button onClick={() => deleteClient(client.id)} className="flex items-center gap-2 px-3 py-2 text-sm text-rose-500 hover:text-rose-600">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ==================== RENDER ==================== */
  return (
    <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto">
      
      {/* Header & Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-gray-800">Client Accounts</h1>
            <p className="text-sm text-gray-500">Manage partners, hotels, retail clients, and their details.</p>
          </div>

          <button 
            onClick={openNewClient} 
            className="w-full md:w-auto px-4 py-2 rounded-xl bg-purple-600 text-white flex items-center justify-center gap-2 font-semibold hover:bg-purple-700 transition-colors shadow-md shadow-purple-500/30"
          >
            <Plus className="w-5 h-5" /> Add New Client
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <label className="flex items-center flex-1 min-w-0 border border-gray-300 rounded-xl px-3 py-2 bg-white">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input 
              value={query} 
              onChange={(e) => { setQuery(e.target.value); setPage(1); }} 
              placeholder="Search name, contact, or email..." 
              className="w-full outline-none text-sm text-gray-700 placeholder-gray-400" 
            />
          </label>

          <select 
            value={filterType} 
            onChange={(e) => { setFilterType(e.target.value); setPage(1); }} 
            className="w-full lg:w-40 border border-gray-300 rounded-xl px-3 py-2 text-sm appearance-none bg-white focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="all">All Types</option>
            <option value="hotel">Hotel</option>
            <option value="retail">Retail</option>
            <option value="office">Office</option>
            <option value="spa">Spa</option>
            <option value="other">Other</option>
          </select>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)} 
            className="w-full lg:w-40 border border-gray-300 rounded-xl px-3 py-2 text-sm appearance-none bg-white focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="name">Sort: Name (A-Z)</option>
            <option value="newest">Sort: Newest First</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions and Import/Export */}
      {selectedIds.size > 0 ? (
        <div className="flex items-center gap-3 p-3 mb-4 bg-purple-50 border border-purple-200 rounded-xl transition-all">
          <span className="text-sm font-medium text-purple-700">{selectedIds.size} selected</span>
          <button 
            onClick={clearSelection} 
            className="px-3 py-1 rounded-lg border border-purple-300 text-sm text-purple-700 hover:bg-purple-100 transition-colors"
          >
            Clear Selection
          </button>
          <button 
            onClick={bulkDeleteSelected} 
            className="px-3 py-1 rounded-lg bg-rose-500 text-white text-sm hover:bg-rose-600 transition-colors"
          >
            <Trash2 className="w-4 h-4 inline mr-1" /> Delete Selected
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-end gap-3 mb-4">
          <button onClick={exportJson} className="px-3 py-2 rounded-xl border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
          <label className="px-3 py-2 rounded-xl border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-2">
            <Upload className="w-4 h-4" /> Import
            <input 
              ref={importInputRef}
              type="file" 
              accept="application/json" 
              onChange={(e) => importJson(e.target.files?.[0])} 
              className="hidden" 
            />
          </label>
        </div>
      )}

      {/* Table Container */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-x-auto">
        
        {/* Desktop Table */}
        <table className="min-w-full divide-y divide-gray-200 hidden md:table">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 w-12">
                <input 
                  type="checkbox"
                  checked={visible.length > 0 && visible.every(c => selectedIds.has(c.id))}
                  onChange={toggleSelectAllVisible}
                  className="h-4 w-4 rounded text-purple-600 border-gray-300 focus:ring-purple-500"
                />
              </th>
              <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[200px]">Name & Type</th>
              <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
              <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">Phone</th>
              <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">Joined</th>
              <th className="p-4 w-32"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {visible.length > 0 ? (
              visible.map((c) => <ClientRow key={c.id} c={c} />)
            ) : (
              <tr>
                <td colSpan="6" className="p-10 text-center text-gray-500 text-sm">
                  No clients found matching the current search or filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Mobile Cards */}
        <div className="p-4 md:hidden space-y-3">
          {visible.length > 0 ? (
            visible.map((c) => (
              <div key={c.id} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(c.id)}
                      onChange={() => toggleSelect(c.id)}
                      className="mt-1 h-4 w-4 rounded text-purple-600 border-gray-300 focus:ring-purple-500"
                    />
                    <div>
                      <div className="font-bold text-gray-800">{c.name}</div>
                      <div className="text-xs text-purple-600 font-medium capitalize mt-0.5">{c.type} • {c.contact}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setDetailClient(c)} 
                    className="ml-4 p-2 rounded-full text-gray-500 hover:bg-gray-100"
                    title="View Details"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-xs text-gray-500 mt-3 border-t pt-2">
                  <span className="font-semibold text-gray-700">Email:</span> {c.email} 
                  <span className="ml-3 font-semibold text-gray-700">Phone:</span> {c.phone}
                </div>
              </div>
            ))
          ) : (
            <div className="p-10 text-center text-gray-500 text-sm">
              No clients found matching the current search or filters.
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white">
          <div className="text-sm text-gray-600">
            Showing {(page - 1) * PAGE_SIZE + 1} - {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} total clients.
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setPage((p) => Math.max(1, p - 1))} 
              disabled={page === 1}
              className="px-3 py-1 rounded-xl border border-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Prev
            </button>
            <div className="px-4 py-1 font-semibold text-sm bg-purple-100 text-purple-700 rounded-xl">{page} / {totalPages}</div>
            <button 
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))} 
              disabled={page === totalPages}
              className="px-3 py-1 rounded-xl border border-gray-300 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 flex items-center"
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showForm && <ClientForm value={editing} onCancel={() => { setShowForm(false); setEditing(null); }} onSave={saveClient} />}
      {detailClient && <DetailsPanel client={detailClient} onClose={() => setDetailClient(null)} />}
    </div>
  );
}