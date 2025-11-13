import React, { useState, useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { Menu as MenuIcon } from 'lucide-react';
import Sidebar from '../components/Sidebar'; 

// Helper function to derive title for the mobile header
const getPageTitle = (pathname) => {
    // Basic mapping logic
    const path = pathname.split('/')[1];
    if (path) {
        return path.charAt(0).toUpperCase() + path.slice(1);
    }
    return 'Dashboard';
};

export default function AppLayout() {
    const location = useLocation();
    
    // 👈 1. STATE DEFINED HERE (Fixes ReferenceError)
    const [menuOpen, setMenuOpen] = useState(false); 
    const [user, setUser] = useState(null);
    const pageTitle = getPageTitle(location.pathname);

    // Close the menu on route change (for mobile)
    useEffect(() => {
        if (menuOpen) {
            setMenuOpen(false);
        }
    }, [location.pathname]);

    // Load user for header display
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

    return (
        <div className="min-h-screen bg-gray-50 flex">
            
            {/* 2. SIDEBAR RENDERING (Passing State) */}
            <Sidebar 
                menuOpen={menuOpen} 
                setMenuOpen={setMenuOpen} 
            />

            {/* Page content area container */}
            <div className="flex-1 min-h-screen md:ml-0 flex flex-col">
                
                {/* Top header - Mobile/Tablet */}
                <header className="bg-white shadow-sm p-4 sticky top-0 z-20 md:hidden border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <button
                            // 👈 Use setMenuOpen(true) to open the menu
                            onClick={() => setMenuOpen(true)}
                            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-150"
                            aria-label="Open menu"
                        >
                            <MenuIcon className="w-6 h-6" />
                        </button>

                        <div className="text-base font-bold text-gray-800">{pageTitle}</div>

                        <div className="flex items-center gap-2">
                            <div className="text-sm text-gray-600 hidden xs:block">Hi, <span className="font-semibold">{user?.name?.split(' ')[0] || "User"}</span></div>
                            <div className="h-8 w-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold">
                                {user?.name?.[0] || 'U'}
                            </div>
                        </div>
                    </div>
                </header>
                
                {/* 3. MAIN CONTENT AREA */}
                <main className="flex-1">
                    {/* 👈 RENDER NESTED ROUTE CONTENT HERE */}
                    <Outlet /> 
                </main>
            </div>
        </div>
    );
}