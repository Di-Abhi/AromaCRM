import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
// Assuming you have AppLayout and ProtectedRoute defined in your files
import ProtectedRoute from "./components/ProtectedRoute"; 
import AppLayout from "./layouts/AppLayout"; // 👈 Import the Layout component

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
                    
                    {/* Add other protected routes here: */}
                    {/* <Route path="/orders" element={<Orders />} /> */}
                    {/* <Route path="/settings" element={<Settings />} /> */}
                    
                </Route>
                
                {/* Optional: 404 Route */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </Router>
    );
}