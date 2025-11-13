import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home as HomeIcon,
  Users as UsersIcon,
  Target as TargetIcon,
  Zap as ZapIcon,
  ShoppingCart as ShoppingCartIcon,
  Wrench as ToolIcon,
  BarChart2 as BarChart2Icon,
  Settings as SettingsIcon,
  X as XIcon,
  LogOut as LogOutIcon,
  Briefcase as BriefcaseIcon // For Clients
} from "lucide-react";

// Helper function for nav item mapping (copied from Dashboard)
const getIcon = (id) => {
    switch (id) {
        case "dash": return <HomeIcon className="w-5 h-5" />;
        case "clients": return <BriefcaseIcon className="w-5 h-5" />;
        case "leads": return <TargetIcon className="w-5 h-5" />;
        case "installs": return <ZapIcon className="w-5 h-5" />;
        case "orders": return <ShoppingCartIcon className="w-5 h-5" />;
        case "tickets": return <ToolIcon className="w-5 h-5" />;
        case "reports": return <BarChart2Icon className="w-5 h-5" />;
        case "settings": return <SettingsIcon className="w-5 h-5" />;
        default: return null;
    }
}

// Navigation items definition (copied from Dashboard)
const navItems = [
    { id: "dash", label: "Dashboard", to: "/dashboard" },
    { id: "clients", label: "Clients", to: "/clients" },
    { id: "leads", label: "Leads", to: "/leads" },
    { id: "installs", label: "Installations", to: "/installations" },
    { id: "orders", label: "Orders", to: "/orders" },
    { id: "tickets", label: "Tickets", to: "/tickets" },
    { id: "reports", label: "Reports", to: "/reports" },
    { id: "settings", label: "Settings", to: "/settings" }
];


// Accepts the menuOpen state and setter from the parent Layout component
export default function Sidebar({ menuOpen, setMenuOpen }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);

    // Load user only for display purposes
    useEffect(() => {
        const raw = localStorage.getItem("aroma_user") || localStorage.getItem("aroma_current_user");
        if (raw) {
            try {
                setUser(JSON.parse(raw));
            } catch (e) {
                setUser(null);
            }
        }
    }, []);

    function handleLogout() {
        localStorage.removeItem("aroma_user");
        localStorage.removeItem("aroma_current_user");
        navigate("/login");
    }

    return (
        <>
            {/* Sidebar content */}
            <div
                className={`fixed z-40 top-0 left-0 h-full w-64 bg-white shadow-xl transition-transform duration-300 ease-in-out
                    md:static md:translate-x-0 md:shadow-md
                    ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="p-5 flex flex-col h-full">
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
                            const isActive = location.pathname.startsWith(n.to) && n.to !== "/";
                            // Special case for dashboard root
                            const isDashActive = n.to === "/dashboard" && location.pathname === "/dashboard";

                            return (
                                <button
                                    key={n.id}
                                    className={`text-left flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200
                                        ${(isActive || isDashActive)
                                            ? "bg-purple-500 text-white font-semibold shadow-md hover:bg-purple-600"
                                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                                        }`}
                                    onClick={() => {
                                        if (n.to) {
                                            navigate(n.to);
                                            setMenuOpen(false); // Close on mobile navigation
                                        }
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
        </>
    );
}