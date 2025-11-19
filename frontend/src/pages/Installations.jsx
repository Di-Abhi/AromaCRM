// Installations.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import InstallationsHeader from "../components/installations/InstallationsHeader";
import InstallationsActionsBar from "../components/installations/InstallationsActionsBar";
import InstallationsList from "../components/installations/InstallationsList";
import InstallationForm from "../components/installations/InstallationsForm";
import InstallationDetailsPanel from "../components/installations/InstallationDetailsPanel";

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

export default function Installations() {
  const navigate = useNavigate();
  const [db, setDb] = useState(null);
  const [installations, setInstallations] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [detailItem, setDetailItem] = useState(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  const importInputRef = useRef(null);

  useEffect(() => {
    const existing = loadDb();
    if (existing) {
      setDb(existing);
      setInstallations(existing.installations || []);
      return;
    }

    const seed = {
      clients: [], leads: [], tickets: [], orders: [],
      installations: [
        { id: uid("i_"), accountId: "Grand Palms Hotel", clientId: "", address: "Mumbai", scheduledAt: Date.now() + 86400000, status: "scheduled", notes: "Initial setup" },
        { id: uid("i_"), accountId: "BlueSuites Co-working", clientId: "", address: "Bengaluru", scheduledAt: Date.now() - 86400000 * 3, status: "completed", notes: "Completed successfully" }
      ]
    };

    saveDb(seed);
    setDb(seed);
    setInstallations(seed.installations);
  }, [navigate]);

  useEffect(() => {
    if (!installations) return;

    setDb(prev => {
      const curr = prev || { clients: [], leads: [], tickets: [], orders: [], installations: [] };
      const next = { ...curr, installations };
      saveDb(next);
      return next;
    });
  }, [installations]);

  const filtered = useMemo(() => {
    let list = installations.slice();

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (i) => (i.accountId || "").toLowerCase().includes(q) ||
               (i.address || "").toLowerCase().includes(q)
      );
    }

    if (filterStatus !== "all") list = list.filter((i) => i.status === filterStatus);

    if (sortBy === "newest") list.sort((a, b) => (b.scheduledAt || 0) - (a.scheduledAt || 0));
    if (sortBy === "oldest") list.sort((a, b) => (a.scheduledAt || 0) - (b.scheduledAt || 0));

    return list;
  }, [installations, query, filterStatus, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [filtered.length, totalPages, page]);

  function toggleSelect(id) {
    setSelectedIds((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAllVisible() {
    const allSelected = visible.every((i) => selectedIds.has(i.id));
    setSelectedIds((s) => {
      const next = new Set(s);
      if (allSelected) visible.forEach((i) => next.delete(i.id));
      else visible.forEach((i) => next.add(i.id));
      return next;
    });
  }

  function clearSelection() { setSelectedIds(new Set()); }

  function openNew() {
    setEditing({ id: null, accountId: "", address: "", scheduledAt: Date.now(), status: "scheduled", notes: "" });
    setShowForm(true);
  }

  function openEdit(item) {
    setEditing({ ...item });
    setShowForm(true);
    setDetailItem(null);
  }

  function saveInstallation(payload) {
    if (!payload.accountId) return alert("Account name required");

    if (!payload.id) {
      const newItem = { ...payload, id: uid("i_"), createdAt: Date.now() };
      setInstallations((prev) => [newItem, ...prev]);
      setDetailItem(newItem);
    } else {
      const updated = { ...payload, updatedAt: Date.now() };
      setInstallations((prev) => prev.map((i) => (i.id === payload.id ? updated : i)));
      setDetailItem(updated);
    }

    setShowForm(false);
    setEditing(null);
  }

  function deleteInstallation(id) {
    if (!confirm("Delete installation?")) return;
    setInstallations((prev) => prev.filter((i) => i.id !== id));
    if (detailItem?.id === id) setDetailItem(null);
  }

  function bulkDelete() {
    if (!selectedIds.size) return;
    if (!confirm("Delete selected installations?")) return;
    setInstallations((prev) => prev.filter((i) => !selectedIds.has(i.id)));
    clearSelection();
    setDetailItem(null);
  }

  function exportJson() {
    const payload = { installations: filtered };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `installations_export_${new Date().toISOString().slice(0, 10)}.json`;
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
        if (!Array.isArray(parsed.installations)) throw new Error("Missing 'installations'");
        setInstallations(parsed.installations);
      } catch (err) {
        alert("Import failed: " + err.message);
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto">
      <InstallationsHeader
        query={query}
        setQuery={setQuery}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        sortBy={sortBy}
        setSortBy={setSortBy}
        openNew={openNew}
      />

      <InstallationsActionsBar
        selectedIds={selectedIds}
        clearSelection={clearSelection}
        bulkDelete={bulkDelete}
        exportJson={exportJson}
        importJson={importJson}
        importInputRef={importInputRef}
      />

      <InstallationsList
        visible={visible}
        selectedIds={selectedIds}
        toggleSelect={toggleSelect}
        toggleSelectAll={toggleSelectAllVisible}
        openEdit={openEdit}
        deleteInstallation={deleteInstallation}
        setDetailItem={setDetailItem}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
      />

      {showForm && (
        <InstallationForm
          value={editing}
          onCancel={() => setShowForm(false)}
          onSave={saveInstallation}
        />
      )}

      <InstallationDetailsPanel
        item={detailItem}
        onClose={() => setDetailItem(null)}
        openEdit={openEdit}
        deleteInstallation={deleteInstallation}
      />
    </div>
  );
}