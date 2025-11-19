// src/pages/Leads.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Components (create these under components/leads/... similar to clients counterparts)
import LeadsHeader from "../components/leads/LeadsHeader";
import LeadsActionsBar from "../components/leads/LeadsActionBar";
import LeadsList from "../components/leads/LeadsList";
import LeadForm from "../components/leads/LeadForm";
import LeadDetailsPanel from "../components/leads/LeadDetailsPanel";

const DB_KEY = "aroma_crm_db";

function uid(prefix = "") {
  return prefix + Date.now().toString(36) + Math.floor(Math.random() * 1000).toString(36);
}

function loadDb() {
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
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch (e) {
    console.error("Failed to save DB", e);
  }
}

export default function Leads() {
  const navigate = useNavigate();
  const [db, setDb] = useState(null);
  const [leads, setLeads] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // e.g. all, new, contacted, qualified, lost
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [detailLead, setDetailLead] = useState(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  const importInputRef = useRef(null);

  useEffect(() => {
    const userRaw = localStorage.getItem("aroma_user") || localStorage.getItem("aroma_current_user");
    if (!userRaw) {
      // If you want an auth guard, uncomment below. For demo, we just continue.
      // navigate('/login');
    }

    const existing = loadDb();
    if (existing) {
      setDb(existing);
      setLeads(existing.leads || []);
      return;
    }

    // seed demo DB if none
    const seed = {
      clients: [],
      orders: [],
      installations: [],
      leads: [
        { id: uid("l_"), name: "Grand Palms - Event Inquiry", company: "Grand Palms Hotel", contact: "Anita Sharma", email: "anita@grandpalms.example", phone: "+91 98765 43210", status: "new", owner: "Sales Team", source: "website", notes: "Interested for conference fragrance solution. Follow-up in 3 days.", createdAt: Date.now() },
        { id: uid("l_"), name: "Corporate Gifting - BlueSuites", company: "BlueSuites Co-working", contact: "Rohan Mehta", email: "rohan@bluesuites.example", phone: "+91 91234 56789", status: "contacted", owner: "Akash", source: "referral", notes: "Asked for quote. Wants sample pack.", createdAt: Date.now() - 1000 * 60 * 60 * 24 * 20 },
        { id: uid("l_"), name: "Spa Diffuser Program", company: "Zen Spa & Wellness", contact: "Priya Singh", email: "priya@zenspa.example", phone: "+91 90000 11111", status: "qualified", owner: "Priya (internal)", source: "trade_show", notes: "Budget approved, needs installation quote.", createdAt: Date.now() - 1000 * 60 * 60 * 24 * 60 }
      ],
      tickets: []
    };

    saveDb(seed);
    setDb(seed);
    setLeads(seed.leads);
  }, [navigate]);

  // keep db in sync whenever leads change
  useEffect(() => {
    if (!leads) return;
    setDb(prevDb => {
      const currentDb = prevDb || { clients: [], orders: [], installations: [], leads: [], tickets: [] };
      const next = { ...currentDb, leads };
      saveDb(next);
      return next;
    });
  }, [leads]);

  // derived list
  const filtered = useMemo(() => {
    let list = (leads || []).slice();
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(l =>
        (l.name || "").toLowerCase().includes(q) ||
        (l.company || "").toLowerCase().includes(q) ||
        (l.contact || "").toLowerCase().includes(q) ||
        (l.email || "").toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") {
      list = list.filter(l => l.status === statusFilter);
    }
    if (ownerFilter !== "all") {
      list = list.filter(l => (l.owner || "") === ownerFilter);
    }

    if (sortBy === "name") {
      list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortBy === "createdAt") {
      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }

    return list;
  }, [leads, query, statusFilter, ownerFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [filtered.length, totalPages, page]);

  // Selection helpers
  function toggleSelect(id) {
    setSelectedIds(s => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAllVisible() {
    const allVisibleSelected = visible.every(l => selectedIds.has(l.id));
    setSelectedIds(s => {
      const next = new Set(s);
      if (allVisibleSelected) {
        visible.forEach(l => next.delete(l.id));
      } else {
        visible.forEach(l => next.add(l.id));
      }
      return next;
    });
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  function openNewLead() {
    setEditing({ id: null, name: "", company: "", contact: "", email: "", phone: "", status: "new", owner: "", source: "", notes: "" });
    setShowForm(true);
  }

  function openEditLead(l) {
    setEditing({ ...l });
    setShowForm(true);
    setDetailLead(null);
  }

  function saveLead(payload) {
    if (!payload.name || !payload.email) {
      alert("Please add at least a lead name and email.");
      return;
    }
    if (!payload.id) {
      const newLead = { ...payload, id: uid("l_"), createdAt: Date.now() };
      setLeads(prev => [newLead, ...prev]);
      setShowForm(false);
      setEditing(null);
      setDetailLead(newLead);
    } else {
      const updated = { ...payload, updatedAt: Date.now() };
      setLeads(prev => prev.map(p => (p.id === payload.id ? updated : p)));
      setShowForm(false);
      setEditing(null);
      setDetailLead(updated);
    }
  }

  function deleteLead(id) {
    if (!confirm("Are you sure you want to delete this lead? This action cannot be undone.")) return;
    setLeads(prev => prev.filter(l => l.id !== id));
    setSelectedIds(s => {
      const next = new Set(s);
      next.delete(id);
      return next;
    });
    if (detailLead?.id === id) setDetailLead(null);
  }

  function bulkDeleteSelected() {
    if (!selectedIds.size) return;
    if (!confirm(`Delete ${selectedIds.size} selected leads?`)) return;
    setLeads(prev => prev.filter(l => !selectedIds.has(l.id)));
    setSelectedIds(new Set());
    setDetailLead(null);
  }

  // Quick actions: convert to client, create ticket, assign owner
  function quickAction(type, lead) {
    const next = loadDb();
    if (!next) return;

    if (type === "convert") {
      const client = {
        id: uid("c_"),
        name: lead.company || lead.name,
        type: "lead-converted",
        contact: lead.contact,
        email: lead.email,
        phone: lead.phone,
        address: lead.address || "",
        notes: `Converted from lead ${lead.id}`,
        createdAt: Date.now()
      };
      next.clients = [client, ...(next.clients || [])];
      // remove the lead after conversion
      next.leads = (next.leads || []).filter(l => l.id !== lead.id);
      saveDb(next); setDb(next);
      setLeads(next.leads);
      alert(`Lead ${lead.name} converted to client ${client.name}.`);
      return;
    }

    if (type === "ticket") {
      const ticket = { id: uid("t_"), leadId: lead.id, status: "open", createdAt: Date.now(), subject: `Follow up: ${lead.name}` };
      next.tickets = [ticket, ...(next.tickets || [])];
      saveDb(next); setDb(next);
      alert(`Ticket ${ticket.id} created for lead ${lead.name}.`);
      return;
    }

    if (type === "assign") {
      const owner = prompt("Assign owner (name):", lead.owner || "");
      if (!owner) return;
      next.leads = (next.leads || []).map(l => (l.id === lead.id ? { ...l, owner, updatedAt: Date.now() } : l));
      saveDb(next); setDb(next);
      setLeads(next.leads);
      alert(`Lead assigned to ${owner}.`);
      return;
    }
  }

  // Import / Export
  function exportJson() {
    const payload = { leads: filtered, clients: db?.clients || [], orders: db?.orders || [], installations: db?.installations || [], tickets: db?.tickets || [] };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aroma_leads_export_${new Date().toISOString().slice(0, 10)}.json`;
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
        if (!Array.isArray(parsed.leads)) throw new Error("Missing or invalid 'leads' array in file.");

        const leadMap = new Map(leads.map(l => [l.id, l]));
        let newCount = 0; let updateCount = 0;

        parsed.leads.forEach(imported => {
          if (imported.id && leadMap.has(imported.id)) {
            leadMap.set(imported.id, { ...leadMap.get(imported.id), ...imported, updatedAt: Date.now() });
            updateCount++;
          } else {
            const newId = uid("l_");
            leadMap.set(newId, { ...imported, id: newId, createdAt: imported.createdAt || Date.now() });
            newCount++;
          }
        });

        const nextLeads = Array.from(leadMap.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setLeads(nextLeads);
        alert(`Import successful! ${newCount} new leads added, ${updateCount} leads updated.`);

        if (importInputRef.current) importInputRef.current.value = '';
      } catch (err) {
        alert("Failed to import JSON data. Error: " + err.message);
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto">
      <LeadsHeader
        query={query}
        setQuery={setQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        ownerFilter={ownerFilter}
        setOwnerFilter={setOwnerFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        setPage={setPage}
        openNewLead={openNewLead}
      />

      <LeadsActionsBar
        selectedIds={selectedIds}
        clearSelection={clearSelection}
        bulkDeleteSelected={bulkDeleteSelected}
        exportJson={exportJson}
        importJson={importJson}
        importInputRef={importInputRef}
      />

      <LeadsList
        visibleLeads={visible}
        selectedIds={selectedIds}
        toggleSelect={toggleSelect}
        toggleSelectAllVisible={toggleSelectAllVisible}
        setDetailLead={setDetailLead}
        openEditLead={openEditLead}
        deleteLead={deleteLead}
        quickAction={quickAction}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />

      {showForm && (
        <LeadForm
          value={editing}
          onCancel={() => setShowForm(false)}
          onSave={saveLead}
        />
      )}

      <LeadDetailsPanel
        lead={detailLead}
        onClose={() => setDetailLead(null)}
        openEditLead={openEditLead}
        deleteLead={deleteLead}
        quickAction={quickAction}
      />
    </div>
  );
}
