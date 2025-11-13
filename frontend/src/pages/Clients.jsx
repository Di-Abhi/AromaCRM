// src/pages/Clients.jsx (The new main component)
import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Import the new components
import ClientsHeader from "../components/clients/ClientsHeader";
import ClientsActionsBar from "../components/clients/ClientsActionsBar";
import ClientsList from "../components/clients/ClientsList";
import ClientForm from "../components/clients/ClientForm";
import ClientDetailsPanel from "../components/clients/ClientDetailsPanel";

const DB_KEY = "aroma_crm_db";

function uid(prefix = "") {
  return prefix + Date.now().toString(36) + Math.floor(Math.random() * 1000).toString(36);
}

function loadDb() {
  // ... (Keep existing loadDb function)
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to parse DB", e);
    return null;
  }
}

function saveDb(db) {
  // ... (Keep existing saveDb function)
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch (e) {
    console.error("Failed to save DB", e);
  }
}

/* -------------------- Main Component: Clients -------------------- */
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

  /* ---------- load DB on mount (UNCHANGED) ---------- */
  useEffect(() => {
    // ... (Keep existing load logic, including seeding)
    const userRaw = localStorage.getItem("aroma_user") || localStorage.getItem("aroma_current_user");
    if (!userRaw) {
        // Auth guard logic...
    }

    const existing = loadDb();
    if (existing) {
      setDb(existing);
      setClients(existing.clients || []);
      return;
    }

    // seed demo DB if none
    const seed = {
      clients: [
        { id: uid("c_"), name: "Grand Palms Hotel", type: "hotel", contact: "Anita Sharma", email: "anita@grandpalms.example", phone: "+91 98765 43210", address: "Marine Drive, Mumbai", notes: "Prefers woody floral blends. Trial 2/2025.", createdAt: Date.now() },
        { id: uid("c_"), name: "BlueSuites Co-working", type: "office", contact: "Rohan Mehta", email: "rohan@bluesuites.example", phone: "+91 91234 56789", address: "Koramangala, Bengaluru", notes: "Testing citrus diffuser in common area.", createdAt: Date.now() - 1000 * 60 * 60 * 24 * 40 },
        { id: uid("c_"), name: "Zen Spa & Wellness", type: "spa", contact: "Priya Singh", email: "priya@zenspa.example", phone: "+91 90000 11111", address: "DLF Phase 4, Gurugram", notes: "Requires calming lavender and eucalyptus scents.", createdAt: Date.now() - 1000 * 60 * 60 * 24 * 90 }
      ].sort((a, b) => b.createdAt - a.createdAt),
      orders: [], installations: [], leads: [], tickets: []
    };
    saveDb(seed);
    setDb(seed);
    setClients(seed.clients);
  }, [navigate]);

  /* ---------- sync clients -> db (FIXED) ---------- */
  useEffect(() => {
    if (!clients) return;

    // Use functional update to avoid circular dependency
    setDb(prevDb => {
        const currentDb = prevDb || { clients: [], orders: [], installations: [], leads: [], tickets: [] };
        const next = { ...currentDb, clients };
        saveDb(next);
        return next;
    });
  }, [clients]);

  /* ---------- derived & filtered list (UNCHANGED) ---------- */
  const filtered = useMemo(() => {
    let list = (clients || []).slice();
    // ... (Keep filtering and sorting logic)
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

  // Auto-correct page number
  useEffect(() => {
    if (page > totalPages) {
        setPage(totalPages);
    }
  }, [filtered.length, totalPages, page]);


  /* ---------- CRUD & QUICK ACTIONS (UNCHANGED) ---------- */
  function toggleSelect(id) {
    // ...
    setSelectedIds((s) => {
        const next = new Set(s);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
    });
  }

  function toggleSelectAllVisible() {
    // ...
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

  function openNewClient() {
    setEditing({ id: null, name: "", type: "hotel", contact: "", email: "", phone: "", address: "", notes: "" });
    setShowForm(true);
  }

  function openEditClient(c) {
    setEditing({ ...c });
    setShowForm(true);
    setDetailClient(null); 
  }

  function saveClient(payload) {
    // ... (Keep existing saveClient logic)
    if (!payload.name || !payload.email) {
        alert("Please add at least a business name and email.");
        return;
    }
    if (!payload.id) {
        const newClient = { ...payload, id: uid("c_"), createdAt: Date.now() };
        setClients((prev) => [newClient, ...prev]);
        setShowForm(false);
        setEditing(null);
        setDetailClient(newClient);
    } else {
        const updatedClient = { ...payload, updatedAt: Date.now() };
        setClients((prev) => prev.map((c) => (c.id === payload.id ? updatedClient : c)));
        setShowForm(false);
        setEditing(null);
        setDetailClient(updatedClient);
    }
  }

  function deleteClient(id) {
    // ... (Keep existing deleteClient logic)
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
    // ... (Keep existing bulkDeleteSelected logic)
    if (!selectedIds.size) return;
    if (!confirm(`Delete ${selectedIds.size} selected clients?`)) return;
    setClients((prev) => prev.filter((c) => !selectedIds.has(c.id)));
    setSelectedIds(new Set());
    setDetailClient(null);
  }

  function quickCreate(type, client) {
    // ... (Keep existing quickCreate logic)
    const next = loadDb(); 
    if (!next) return;

    if (type === "order") {
        const order = { id: uid("o_"), clientId: client.id, total: 25000, placedAt: Date.now(), note: "Quick order (demo)" };
        next.orders = [order, ...(next.orders || [])];
        saveDb(next); setDb(next);
        alert(`Order ${order.id} created for ${client.name}.`); return;
    }
    if (type === "install") {
        const inst = { id: uid("i_"), clientId: client.id, accountId: client.name, scheduledAt: Date.now() + 1000 * 60 * 60 * 24 * 7, status: "scheduled" };
        next.installations = [inst, ...(next.installations || [])];
        saveDb(next); setDb(next);
        alert(`Installation scheduled for ${client.name}.`); return;
    }
    if (type === "ticket") {
        const ticket = { id: uid("t_"), clientId: client.id, status: "open", createdAt: Date.now(), subject: "Support request (demo)" };
        next.tickets = [ticket, ...(next.tickets || [])];
        saveDb(next); setDb(next);
        alert(`Support ticket ${ticket.id} created for ${client.name}.`); return;
    }
  }
  
  // Import/Export functions (kept here as they use component state/refs)
  function exportJson() {
    const payload = { 
        clients: filtered, orders: db?.orders || [], 
        installations: db?.installations || [], 
        leads: db?.leads || [], tickets: db?.tickets || []
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


  /* -------------------- Render Composition -------------------- */
  return (
    <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto">
      
      {/* 1. Header (Title, Add Button, Search, Filters) */}
      <ClientsHeader
        query={query}
        setQuery={setQuery}
        filterType={filterType}
        setFilterType={setFilterType}
        sortBy={sortBy}
        setSortBy={setSortBy}
        setPage={setPage}
        openNewClient={openNewClient}
      />

      {/* 2. Bulk Actions / Import/Export Bar */}
      <ClientsActionsBar
        selectedIds={selectedIds}
        clearSelection={clearSelection}
        bulkDeleteSelected={bulkDeleteSelected}
        exportJson={exportJson}
        importJson={importJson}
        importInputRef={importInputRef}
      />

      {/* 3. Client List (Table/Cards) */}
      <ClientsList
        visibleClients={visible}
        selectedIds={selectedIds}
        toggleSelect={toggleSelect}
        toggleSelectAllVisible={toggleSelectAllVisible}
        setDetailClient={setDetailClient}
        openEditClient={openEditClient}
        deleteClient={deleteClient}
        // Pagination props
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />
      
      {/* 4. Client Form Modal (Conditional) */}
      {showForm && (
        <ClientForm
          value={editing}
          onCancel={() => setShowForm(false)}
          onSave={saveClient}
        />
      )}
      
      {/* 5. Client Details Panel (Conditional) */}
      <ClientDetailsPanel
        client={detailClient}
        onClose={() => setDetailClient(null)}
        openEditClient={openEditClient}
        deleteClient={deleteClient}
        quickCreate={quickCreate}
      />
    </div>
  );
}
