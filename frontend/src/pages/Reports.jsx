const DB_KEY = "aroma_crm_db";
function uid(prefix = "") { return prefix + Date.now().toString(36) + Math.floor(Math.random() * 1000).toString(36); }
function loadDb() { try { const raw = localStorage.getItem(DB_KEY); if (!raw) return null; return JSON.parse(raw); } catch (e) { console.warn('Failed to parse DB', e); return null; } }
function saveDb(db) { try { localStorage.setItem(DB_KEY, JSON.stringify(db)); } catch (e) { console.error('Failed to save DB', e); } }

import React, { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReportsHeader from '../components/reports/ReportsHeader';
import ReportsFilters from '../components/reports/ReportsFilters';
import ReportsCards from '../components/reports/ReportsCards';
import ReportsTables from '../components/reports/ReportsTables';

export default function Reports() {
  const navigate = useNavigate();
  const [db, setDb] = useState(() => loadDb());
  const [range, setRange] = useState('30d'); // 7d, 30d, 90d, all
  const [showing, setShowing] = useState('overview'); // overview, orders, installations, leads
  const [query, setQuery] = useState('');

  // load db on mount
  useEffect(() => {
    const existing = loadDb();
    if (existing) setDb(existing);
  }, [navigate]);

  // derived counts and simple metrics
  const metrics = useMemo(() => {
    const d = db || { clients: [], leads: [], orders: [], installations: [], tickets: [] };
    const now = Date.now();
    const rangeMs = range === '7d' ? 1000*60*60*24*7 : range === '30d' ? 1000*60*60*24*30 : range === '90d' ? 1000*60*60*24*90 : Infinity;

    function countRecent(arr, field = 'createdAt') { if (!Array.isArray(arr)) return 0; if (rangeMs === Infinity) return arr.length; return arr.filter(x => (x[field] || 0) >= now - rangeMs).length; }

    return {
      clientsTotal: (d.clients || []).length,
      leadsTotal: (d.leads || []).length,
      leadsRecent: countRecent(d.leads),
      ordersTotal: (d.orders || []).length,
      ordersRecent: countRecent(d.orders, 'placedAt'),
      installsTotal: (d.installations || []).length,
      installsRecent: countRecent(d.installations, 'scheduledAt'),
      ticketsOpen: (d.tickets || []).filter(t => t.status === 'open').length,
    };
  }, [db, range]);

  // quick export for all data
  function exportAll() {
    const payload = loadDb() || { clients: [], leads: [], orders: [], installations: [], tickets: [] };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `aroma_crm_full_export_${new Date().toISOString().slice(0,10)}.json`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  }

  // import and replace DB (confirm)
  const importRef = useRef(null);
  function importAll(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        // basic validation
        if (!parsed || typeof parsed !== 'object') throw new Error('Invalid JSON');
        if (!confirm('Import will replace local DB. Continue?')) return;
        saveDb(parsed);
        setDb(parsed);
        alert('Import complete.');
      } catch (err) { alert('Import failed: ' + err.message); }
    };
    reader.readAsText(file);
  }

  return (
    <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto">
      <ReportsHeader exportAll={exportAll} importRef={importRef} importAll={importAll} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ReportsFilters range={range} setRange={setRange} showing={showing} setShowing={setShowing} query={query} setQuery={setQuery} />

          <div className="mt-4">
            <ReportsCards metrics={metrics} />
          </div>

          <div className="mt-6">
            <ReportsTables db={db} showing={showing} query={query} range={range} />
          </div>
        </div>

        <aside className="space-y-4">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Quick stats</h3>
            <div className="text-sm text-gray-600">Clients: {metrics.clientsTotal}</div>
            <div className="text-sm text-gray-600">Orders (period): {metrics.ordersRecent}</div>
            <div className="text-sm text-gray-600">Leads (period): {metrics.leadsRecent}</div>
            <div className="text-sm text-gray-600">Open tickets: {metrics.ticketsOpen}</div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Actions</h3>
            <div className="flex flex-col gap-2">
              <button onClick={exportAll} className="px-3 py-2 bg-teal-600 text-white rounded">Export DB</button>
              <label className="border rounded px-3 py-2 text-sm cursor-pointer">Import DB<input ref={importRef} onChange={(e)=>importAll(e.target.files && e.target.files[0])} type="file" accept="application/json" className="hidden"/></label>
              <button onClick={()=>{ if (confirm('Clear all local data?')) { saveDb({clients:[],leads:[],orders:[],installations:[],tickets:[]}); setDb({clients:[],leads:[],orders:[],installations:[],tickets:[]}); } }} className="px-3 py-2 border rounded text-red-600">Clear local DB</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}