import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"; // Use fewer imports
import {
  Target as TargetIcon,
  Zap as ZapIcon,
  ShoppingCart as ShoppingCartIcon,
  Briefcase as BriefcaseIcon
} from "lucide-react"; 

// Import components
import KpiCard from "../components/KpiCard";
import SmallList from "../components/SmallList";
import MiniBarChart from "../components/MiniBarChart";

// NOTE: All sidebar, layout, and user-check logic now resides in AppLayout/Sidebar.

export default function Dashboard() {
    const navigate = useNavigate();
    // Removed: user, menuOpen state and their logic (now in AppLayout/Sidebar)
    const [db, setDb] = useState(null);

    const [kpis, setKpis] = useState({
        mrr: "₹1,25,000",
        trials: 7,
        installsDue: 5,
        openTickets: 2
    });
    const [chartData, setChartData] = useState([
        { label: "Jan", value: 5 },
        { label: "Feb", value: 7 },
        { label: "Mar", value: 9 },
        { label: "Apr", value: 11 },
        { label: "May", value: 10 },
        { label: "Jun", value: 8 },
        { label: "Jul", value: 12 },
        { label: "Aug", value: 9 },
        { label: "Sep", value: 15 },
        { label: "Oct", value: 11 },
        { label: "Nov", value: 18 },
        { label: "Dec", value: 14 }
    ]);

    // load DB and derive KPIs on mount (slightly simplified logic)
    useEffect(() => {
        // User check is now in the ProtectedRoute wrapper
        const dbRaw = localStorage.getItem("aroma_crm_db");
        if (dbRaw) {
            try {
                const parsed = JSON.parse(dbRaw);
                setDb(parsed);

                // Update chart data
                if (parsed.revenueByMonth && Array.isArray(parsed.revenueByMonth)) {
                    // Show last 6 months
                    setChartData(parsed.revenueByMonth.slice(-6).map(d => ({
                        label: d.label,
                        value: d.value // Value is numeric
                    })));
                }

                // Calculate MRR
                const mrr = (parsed.contracts || [])
                    .filter((c) => c.status === "active")
                    .reduce((sum, c) => sum + (c.monthlyFee || 0), 0);
                
                // Update KPIs
                setKpis((k) => ({ 
                    ...k, 
                    mrr: mrr ? `₹${mrr.toLocaleString()}` : k.mrr, 
                    trials: (parsed.leads || []).filter((x) => x.type && x.type.includes("trial")).length,
                    installsDue: (parsed.installations || []).filter((x) => x.status === "scheduled").length,
                    openTickets: (parsed.tickets || []).filter((x) => x.status === "open").length,
                }));

            } catch (e) {
                console.warn("Failed to parse aroma_crm_db:", e);
            }
        }
    }, []); // Removed [navigate] dependency as navigation should be handled by the Layout

    // derive recent leads & orders from db using useMemo (logic unchanged)
    const recentLeads = useMemo(() => {
        // ... (existing logic for recentLeads)
        if (!db?.leads) return [
            { id: "l_demo_1", name: "Grand Palms", sub: "Trial Request", time: "2025-11-05" },
            { id: "l_demo_2", name: "BlueSuites", sub: "Trial Request", time: "2025-10-12" }
        ];
        return (db.leads || [])
            .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)) // Sort by newest
            .slice(0, 5).map(l => ({
                id: l.id,
                name: l.accountName || l.contactEmail || "Lead",
                sub: l.type || l.source,
                time: new Date(l.createdAt || Date.now()).toLocaleDateString()
            }));
    }, [db]);

    const recentOrders = useMemo(() => {
        // ... (existing logic for recentOrders)
        if (!db?.orders) return [{ id: "o_demo_1", name: "Order o1", sub: "₹25,000", time: "2025-11-01" }];
        return (db.orders || [])
            .sort((a, b) => (b.placedAt || 0) - (a.placedAt || 0)) // Sort by newest
            .slice(0, 5).map(o => ({
                id: o.id,
                name: `Order #${o.id.slice(2, 6)}`, // More user-friendly ID slice
                sub: `₹${(o.total || 0).toLocaleString()}`,
                time: new Date(o.placedAt || Date.now()).toLocaleDateString()
            }));
    }, [db]);


    return (
        // The main content area: removed min-h-screen bg-gray-50 flex
        <div className="px-4 md:px-6 lg:px-8 py-8 max-w-7xl mx-auto w-full space-y-8">
            
            {/* The Dashboard title for desktop visibility */}
            <h1 className="text-3xl font-bold text-gray-800 hidden md:block">Dashboard Overview</h1>
            
            {/* KPI row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KpiCard title="Monthly Recurring Revenue" value={kpis.mrr} subtitle="Active contracts revenue" />
                <KpiCard title="Trials Running" value={kpis.trials} subtitle="Live trial locations" />
                <KpiCard title="Installs Due" value={kpis.installsDue} subtitle="Scheduled installs" />
                <KpiCard title="Open Tickets" value={kpis.openTickets} subtitle="Customer support" />
            </div>

            {/* Mid row: chart + recent lists */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Revenue Trend (Last 6 Months)</h2>
                    <MiniBarChart data={chartData} />
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <SmallList title="Recent Leads" items={recentLeads} />
                    <SmallList title="Recent Orders" items={recentOrders} />
                </div>
            </div>

            {/* Tasks / Installs / Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Upcoming Installations */}
                <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-lg font-semibold text-gray-800">Upcoming Installations</div>
                        <div className="text-sm font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full">{kpis.installsDue} scheduled</div>
                    </div>

                    <ul className="space-y-4">
                        {(db?.installations || []).filter((x) => x.status === "scheduled").slice(0, 4).map((inst) => (
                            <li key={inst.id} className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="h-10 w-10 min-w-[40px] rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-base font-semibold">{(inst.accountId || "A").charAt(0)}</div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-bold text-gray-800 truncate">{inst.accountId || `Install for Client ${inst.clientId.slice(2,6)}`}</div>
                                    <div className="text-xs text-gray-500">
                                        Scheduled: {inst.scheduledAt ? new Date(inst.scheduledAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric' }) : "TBD"}
                                    </div>
                                </div>
                                <div className={`text-xs font-semibold px-2 py-0.5 rounded-full ${inst.status === 'scheduled' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                                    {inst.status}
                                </div>
                            </li>
                        ))}
                        {kpis.installsDue === 0 && <li className="text-sm text-gray-500 p-2">No installations currently scheduled.</li>}
                    </ul>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                    <div className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</div>
                    <div className="flex flex-col gap-3">
                        {/* Note: You'll need to implement the actual action when these are clicked */}
                        <button onClick={() => navigate('/leads/new')} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors cursor-pointer shadow-md shadow-purple-500/30">
                            <TargetIcon className="w-4 h-4" /> New Lead
                        </button>
                        <button onClick={() => navigate('/clients/new')} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">
                            <BriefcaseIcon className="w-4 h-4 text-gray-600" /> New Client
                        </button>
                        <button onClick={() => navigate('/installations')} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">
                            <ZapIcon className="w-4 h-4 text-gray-600" /> Schedule Install
                        </button>
                        <button onClick={() => navigate('/orders/new')} className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">
                            <ShoppingCartIcon className="w-4 h-4 text-gray-600" /> Create Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}