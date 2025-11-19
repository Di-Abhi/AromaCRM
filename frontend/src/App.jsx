import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
// Assuming you have AppLayout and ProtectedRoute defined in your files
import ProtectedRoute from "./components/ProtectedRoute"; 
import AppLayout from "./layouts/AppLayout"; // 👈 Import the Layout component
import Leads from "./pages/Leads";
import Installations from "./pages/Installations";
import Orders from "./pages/Orders";
import Tickets from "./pages/Tickets";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

export default function App() {
    return (
        <Router>
            <Routes>
                {/* 1. Public Route: Login */}
                <Route path="/login" element={<Login />} />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <AppLayout /> 
                        </ProtectedRoute>
                    }
                >
                    {/* Redirect root to Dashboard */}
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/leads" element={<Leads/>}/>
                    <Route path="/installations" element={<Installations/>}/>
                    <Route path="/orders" element={<Orders/>}/>
                    <Route path="/tickets" element={<Tickets/>}/>
                    <Route path="/reports" element={<Reports/>}/>
                    <Route path="/settings" element={<Settings/>}/>
                </Route>

            </Routes>
        </Router>
    );
}