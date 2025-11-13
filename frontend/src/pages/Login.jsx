import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(true);

  const navigate = useNavigate();

  // Demo credentials 
  const demoCreds = [
    { email: "admin@aroma.com", password: "AromaDemo123!", role: "admin", name: "Admin" },
    { email: "sales@aroma.com", password: "SalesDemo123!", role: "sales", name: "Sales Rep" },
    { email: "tech@aroma.com", password: "TechDemo123!", role: "tech", name: "Field Tech" },
    { email: "ops@aroma.com", password: "OpsDemo123!", role: "ops", name: "Ops Rep" }
  ];

  useEffect(() => {
    // prefill email if remembered
    const remembered = localStorage.getItem("aroma_remember_email");
    if (remembered) setEmail(remembered);
  }, []);

  function readDBUsers() {
    try {
      const raw = localStorage.getItem("aroma_crm_db");
      if (!raw) return null;
      const db = JSON.parse(raw);
      if (!db.users) return null;
      return db.users.map(u => ({ email: u.email, password: u.password, role: u.role, name: u.name || u.email }));
    } catch (e) {
      return null;
    }
  }

  function findUserInSeededDB(emailToFind, passwordToFind) {
    const users = readDBUsers();
    if (!users) return null;
    return users.find(u => u.email === emailToFind && u.password === passwordToFind) || null;
  }

  function findUserInDemo(emailToFind, passwordToFind) {
    return demoCreds.find(u => u.email === emailToFind && u.password === passwordToFind) || null;
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // tiny delay to simulate network
    await new Promise(r => setTimeout(r, 250));

    const normalizedEmail = (email || "").trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError("Please enter both email and password.");
      setLoading(false);
      return;
    }

    // 1) try seeded DB in localStorage
    const seededUser = findUserInSeededDB(normalizedEmail, password);
    let user = null;
    if (seededUser) user = seededUser;

    // 2) fallback to demo credentials
    if (!user) {
      const demoUser = findUserInDemo(normalizedEmail, password);
      if (demoUser) user = demoUser;
    }

    if (!user) {
      setError("Invalid demo credentials. Use the demo creds shown or seed the app DB (see README).");
      setLoading(false);
      return;
    }
    if (user) {
      localStorage.setItem("aroma_user", JSON.stringify(user));
      navigate("/dashboard"); 
    } else {
      setError("Invalid email or password");
    }

    // store current user (prototype - not secure; remove password in production)
    const session = { id: `u_${Date.now()}`, email: user.email, name: user.name, role: user.role };
    localStorage.setItem("aroma_current_user", JSON.stringify(session));

    if (remember) localStorage.setItem("aroma_remember_email", user.email);
    else localStorage.removeItem("aroma_remember_email");

    setLoading(false);
    if (onLogin) onLogin(session);
  }



  return (
  <div className="max-w-5xl w-full flex md:flex-row items-center justify-center gap-8 mx-auto p-20">

    {/* Left: Welcome / Branding */}
    <div className="bg-white rounded-2xl p-8 shadow-lg flex-1 max-w-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-rose-400 to-amber-400 flex items-center justify-center text-white font-bold">A</div>
        <div>
          <h1 className="text-2xl font-semibold">Aroma CRM</h1>
          <p className="text-sm text-gray-500">Scent marketing CRM for hotels & businesses</p>
        </div>
      </div>

      <p className="text-gray-600 mb-6">
        Sign in to manage accounts, trials, installations and orders. 
        This is a demo login — no backend required. Use the demo credentials provided.
      </p>

      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v4a1 1 0 001 1h3m10 0h3a1 1 0 001-1V7M8 21h8M5 7h14" />
          </svg>
          <div>
            <div className="text-xs text-gray-500">Demo Admin</div>
            <div className="text-sm font-medium">admin@aroma.com / AromaDemo123!</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 10-8 0v4M5 11h14l1 9H4l1-9z" />
          </svg>
          <div>
            <div className="text-xs text-gray-500">Sales</div>
            <div className="text-sm font-medium">sales@aroma.com / SalesDemo123!</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M5 7v10a1 1 0 001 1h12a1 1 0 001-1V7" />
          </svg>
          <div>
            <div className="text-xs text-gray-500">Field Tech / Ops</div>
            <div className="text-sm font-medium">tech@aroma.com / TechDemo123!</div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-500">
        Tip: Click role buttons on the right to autofill demo creds.
      </div>
    </div>

    {/* Right: Login form */}
    <div className="bg-white rounded-2xl p-8 shadow-lg flex-1 max-w-md">
      <h2 className="text-xl font-semibold mb-4">Welcome back</h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            placeholder="you@company.com"
            className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-rose-400 focus:ring-1 focus:ring-rose-200 p-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            placeholder="Enter password"
            className="mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-rose-400 focus:ring-1 focus:ring-rose-200 p-3"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={remember} onChange={() => setRemember(!remember)} className="h-4 w-4" />
            Remember me
          </label>
          <button type="button" className="text-sm text-rose-600 hover:underline" onClick={() => { setEmail('admin@aroma.com'); setPassword('AromaDemo123!'); }}>
            Use Admin Demo
          </button>
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading} className="flex-1 py-3 rounded-lg bg-rose-500 text-white font-semibold shadow hover:bg-rose-600 disabled:opacity-60">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>

        <div className="pt-3 text-xs text-gray-400">
          This is a client-side demo login. Do not use for production.
        </div>
      </form>
    </div>
</div>
  );
}
