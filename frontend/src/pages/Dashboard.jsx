import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Added useLocation for active state
import {
  Home as HomeIcon,
  Users as UsersIcon,
  Target as TargetIcon,
  Zap as ZapIcon,
  ShoppingCart as ShoppingCartIcon,
  Wrench as ToolIcon,
  BarChart2 as BarChart2Icon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  X as XIcon,
  LogOut as LogOutIcon,
  Briefcase as BriefcaseIcon // For Accounts
} from "lucide-react"; // Using Lucide icons for a modern feel



import KpiCard from "../components/KpiCard";
import SmallList from "../components/SmallList";
import MiniBarChart from "../components/MiniBarChart";

// Helper function for nav item mapping
const getIcon = (id) => {
    switch (id) {
        case "dash": return <HomeIcon className="w-5 h-5" />;
        case "accounts": return <BriefcaseIcon className="w-5 h-5" />;
        case "leads": return <TargetIcon className="w-5 h-5" />;
        case "installs": return <ZapIcon className="w-5 h-5" />;
        case "orders": return <ShoppingCartIcon className="w-5 h-5" />;
        case "tickets": return <ToolIcon className="w-5 h-5" />;
        case "reports": return <BarChart2Icon className="w-5 h-5" />;
        case "settings": return <SettingsIcon className="w-5 h-5" />;
        default: return null;
    }
}

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation(); // Used to determine active link
  const [user, setUser] = useState(null);
  const [db, setDb] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Added icons and simplified structure for clarity
  const navItems = [
    { id: "dash", label: "Dashboard", to: "/dashboard" },
    { id: "accounts", label: "Accounts", to: "/accounts" },
    { id: "leads", label: "Leads", to: "/leads" },
    { id: "installs", label: "Installations", to: "/installations" },
    { id: "orders", label: "Orders", to: "/orders" },
    { id: "tickets", label: "Tickets", to: "/tickets" },
    { id: "reports", label: "Reports", to: "/reports" },
    { id: "settings", label: "Settings", to: "/settings" }
  ];

  // sample local state for lists/charts (seeded from localStorage db)
  const [kpis, setKpis] = useState({
    mrr: "₹15,000",
    trials: 4,
    installsDue: 2,
    openTickets: 3
  });
  const [chartData, setChartData] = useState([
    { label: "Jun", value: 8 },
    { label: "Jul", value: 12 },
    { label: "Aug", value: 9 },
    { label: "Sep", value: 15 },
    { label: "Oct", value: 11 },
    { label: "Nov", value: 18 }
  ]);

  // load user & DB once on mount (logic unchanged)
  useEffect(() => {
    const raw = localStorage.getItem("aroma_user") || localStorage.getItem("aroma_current_user");
    if (!raw) {
      navigate("/login");
      return;
    }
    try {
      setUser(JSON.parse(raw));
    } catch (e) {
      setUser(null);
    }

    const dbRaw = localStorage.getItem("aroma_crm_db");
    if (dbRaw) {
      try {
        const parsed = JSON.parse(dbRaw);
        setDb(parsed);

        if (parsed.revenueByMonth && Array.isArray(parsed.revenueByMonth)) {
          setChartData(parsed.revenueByMonth.slice(-6));
        }

        const mrr = (parsed.contracts || []).filter((c) => c.status === "active").reduce((sum, c) => sum + (c.monthlyFee || 0), 0);
        setKpis((k) => ({ ...k, mrr: mrr ? `₹${mrr.toLocaleString()}` : k.mrr, trials: (parsed.leads || []).filter((x) => x.type && x.type.includes("trial")).length }));
      } catch (e) {
        console.warn("Failed to parse aroma_crm_db:", e);
      }
    }
  }, [navigate]);

  // derive recent leads & orders from db using useMemo (logic unchanged)
  const recentLeads = useMemo(() => {
    if (!db?.leads) return [
      { id: "l_demo_1", name: "Grand Palms", sub: "Trial Request", time: "2025-11-05" },
      { id: "l_demo_2", name: "BlueSuites", sub: "Trial Request", time: "2025-10-12" }
    ];
    return (db.leads || []).slice(0, 5).map(l => ({
      id: l.id,
      name: l.accountName || l.contactEmail || "Lead",
      sub: l.type || l.source,
      time: new Date(l.createdAt || Date.now()).toLocaleDateString()
    }));
  }, [db]);

  const recentOrders = useMemo(() => {
    if (!db?.orders) return [{ id: "o_demo_1", name: "Order o1", sub: "₹25,000", time: "2025-11-01" }];
    return (db.orders || []).slice(0, 5).map(o => ({
      id: o.id,
      name: `Order ${o.id}`,
      sub: `₹${(o.total || 0).toLocaleString()}`,
      time: new Date(o.placedAt || Date.now()).toLocaleDateString()
    }));
  }, [db]);

  function handleLogout() {
    localStorage.removeItem("aroma_user");
    localStorage.removeItem("aroma_current_user");
    navigate("/login");
  }

  // Closes the menu on route change for mobile
  useEffect(() => {
    if (menuOpen) {
      setMenuOpen(false);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar (desktop visible, mobile slides in) */}
      <div
        className={`fixed z-40 top-0 left-0 h-full w-64 bg-white shadow-xl transition-transform duration-300 ease-in-out
          md:static md:translate-x-0 md:shadow-md
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-5 flex flex-col h-full"> {/* Inner padding and flex column for structure */}
          {/* Logo & Close Button (Mobile) */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-rose-500 flex items-center justify-center text-white font-extrabold text-xl shadow-lg">A</div>
              <div>
                <div className="text-lg font-bold text-gray-800">Aroma CRM</div>
                <div className="text-xs text-gray-500">Scent Marketing</div>
              </div>
            </div>
            <button
              onClick={() => setMenuOpen(false)}
              className="p-1 rounded-md text-gray-600 hover:text-gray-900 md:hidden"
              aria-label="Close menu"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1 text-sm flex-grow">
            {navItems.map((n) => {
              const isActive = location.pathname === n.to;
              return (
                <button
                  key={n.id}
                  className={`text-left flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200
                    ${isActive
                      ? "bg-purple-500 text-white font-semibold shadow-md hover:bg-purple-600"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                    }`}
                  onClick={() => {
                    if (n.to) navigate(n.to);
                  }}
                >
                  {getIcon(n.id)}
                  <span>{n.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer actions inside sidebar (User & Logout) */}
          <div className="mt-6 border-t pt-4">
            <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-gray-50">
              <div className="flex-1 min-w-0">
                <div className="text-xs text-gray-500 truncate">Signed in as</div>
                <div className="text-sm font-bold text-gray-800 truncate">{user?.name || user?.email}</div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-rose-500 rounded-lg hover:bg-rose-100 transition-colors duration-150"
                title="Logout"
              >
                <LogOutIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Backdrop */}
      {menuOpen && <div className="fixed inset-0 bg-black opacity-25 z-30 md:hidden" onClick={() => setMenuOpen(false)} />}


      {/* Page content area */}
      <div className="flex-1 min-h-screen md:ml-0 flex flex-col">

        {/* Top header - Mobile/Tablet (md:hidden) */}
        <header className="bg-white shadow-sm p-4 sticky top-0 z-20 md:hidden border-b border-gray-100">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-150"
              aria-label="Open menu"
            >
              <MenuIcon className="w-6 h-6" />
            </button>

            <div className="text-base font-bold text-gray-800">Dashboard</div>

            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-600">Hi, <span className="font-semibold">{user?.name?.split(' ')[0] || "User"}</span></div>
              <div className="h-8 w-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold">
                {user?.name?.[0] || 'U'}
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="px-4 md:px-6 lg:px-8 py-8 max-w-7xl mx-auto w-full space-y-8">
          
          <h1 className="text-3xl font-bold text-gray-800 hidden md:block">Dashboard</h1>
          
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
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Revenue Trend</h2>
              <MiniBarChart data={chartData} />
            </div>

            <div className="lg:col-span-1 space-y-6">
              <SmallList title="Recent Leads" items={recentLeads} />
              <SmallList title="Recent Orders" items={recentOrders} />
            </div>
          </div>

          {/* Tasks / Installs / Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-semibold text-gray-800">Upcoming Installations</div>
                <div className="text-sm font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full">{kpis.installsDue} scheduled</div>
              </div>

              <ul className="space-y-4">
                {(db?.installations || []).slice(0, 4).map((inst) => (
                  <li key={inst.id} className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="h-10 w-10 min-w-[40px] rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-base font-semibold">{(inst.accountId || "A").charAt(0)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-gray-800 truncate">{inst.accountId || `Install for ${inst.id}`}</div>
                      <div className="text-xs text-gray-500">
                        Scheduled: {inst.scheduledAt ? new Date(inst.scheduledAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric' }) : "TBD"}
                      </div>
                    </div>
                    <div className={`text-xs font-semibold px-2 py-0.5 rounded-full ${inst.status === 'scheduled' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                      {inst.status}
                    </div>
                  </li>
                ))}
                {!db?.installations?.length && <li className="text-sm text-gray-500 p-2">No scheduled installs in demo DB.</li>}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
              <div className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</div>
              <div className="flex flex-col gap-3">
                <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-purple-500 text-white text-sm font-medium hover:bg-purple-600 transition-colors cursor-pointer shadow-sm">
                    <TargetIcon className="w-4 h-4" /> New Lead
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">
                    <BriefcaseIcon className="w-4 h-4 text-gray-600" /> Create Contract
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">
                    <ZapIcon className="w-4 h-4 text-gray-600" /> Schedule Install
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer">
                    <ShoppingCartIcon className="w-4 h-4 text-gray-600" /> Create Order
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// NOTE: You will need to ensure KpiCard, SmallList, and MiniBarChart components 
// also have clean, modern styling (e.g., using rounded corners, shadows, and consistent colors).