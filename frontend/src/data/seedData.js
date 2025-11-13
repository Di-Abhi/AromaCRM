// src/data/seedData.js
// Demo seed data for AromaArt CRM prototype.
// NOTE: Plain-text passwords for prototype only. Do NOT use in production.

const today = () => new Date().toISOString().slice(0, 10);

export const demoUsers = {
  byId: {
    u_admin: { id: "u_admin", name: "Admin User", email: "admin@aroma-art.com", role: "admin", username: "admin", password: "admin123", permissions: ["*"] },
    u_sales: { id: "u_sales", name: "Sales Rep", email: "sales@aroma-art.com", role: "sales", username: "sales", password: "sales123", permissions: ["manage-contacts","manage-opportunities","create-subscriptions"] },
    u_ops: { id: "u_ops", name: "Operations", email: "ops@aroma-art.com", role: "ops", username: "ops", password: "ops123", permissions: ["manage-activities","manage-subscriptions"] }
  },
  allIds: ["u_admin","u_sales","u_ops"],
  currentUser: { id: "u_admin", name: "Admin User", email: "admin@aroma-art.com", role: "admin", username: "admin" } // default logged-in user for demo
};

// Products
export const demoProducts = {
  byId: {
    p1: { id: "p1", sku: "A24-DF-01", name: "Aroma Diffuser - Mini", price: 4999, category: "Diffuser", stock: 50, attributes: { scentProfile: "neutral" } },
    p2: { id: "p2", sku: "A24-OIL-LAV-100", name: "Lavender Oil 100ml", price: 699, category: "Oil", stock: 200, attributes: { scentProfile: "floral" } },
    p3: { id: "p3", sku: "A24-RD-ROSE", name: "Reed Diffuser - Rose", price: 999, category: "Reed Diffuser", stock: 120, attributes: { scentProfile: "rose" } }
  },
  allIds: ["p1","p2","p3"]
};

// Accounts (companies)
export const demoAccounts = {
  byId: {
    a1: { id: "a1", name: "Cafe Bloom", industry: "Hospitality", address: { city: "Bengaluru", country: "India" }, contacts: ["c1"], subscriptions: ["s1"], opportunities: ["o1"], notes: [], createdAt: today() },
    a2: { id: "a2", name: "Zen Spa", industry: "Wellness", address: { city: "Mumbai", country: "India" }, contacts: ["c2"], subscriptions: ["s2"], opportunities: [], notes: [], createdAt: today() },
    a3: { id: "a3", name: "Green Boutique", industry: "Retail", address: { city: "Delhi", country: "India" }, contacts: ["c3"], subscriptions: [], opportunities: [], notes: [], createdAt: today() }
  },
  allIds: ["a1","a2","a3"]
};

// Contacts
export const demoContacts = {
  byId: {
    c1: { id: "c1", name: "Riya Sharma", email: "riya@cafebloom.in", phone: "+91 98765 43210", role: "Manager", accountId: "a1", tags: ["Prospect","Hospitality"], notes: ["n1"], createdAt: today(), lastContactedAt: today() },
    c2: { id: "c2", name: "Amit Verma", email: "amit@zenspa.in", phone: "+91 91234 56789", role: "Owner", accountId: "a2", tags: ["Client","Wellness"], notes: ["n2"], createdAt: today(), lastContactedAt: today() },
    c3: { id: "c3", name: "Sonal Gupta", email: "sonal@green.in", phone: "+91 99887 77665", role: "Proprietor", accountId: "a3", tags: ["Lead","Retail"], notes: [], createdAt: today(), lastContactedAt: null }
  },
  allIds: ["c1","c2","c3"]
};

// Subscriptions
export const demoSubscriptions = {
  byId: {
    s1: { id: "s1", accountId: "a1", productId: "p2", quantity: 2, cadence: "monthly", startDate: today(), nextDelivery: today(), status: "active", billingAmount: 699, lastDeliveryAt: null, createdAt: today() },
    s2: { id: "s2", accountId: "a2", productId: "p1", quantity: 1, cadence: "quarterly", startDate: today(), nextDelivery: today(), status: "active", billingAmount: 4999, lastDeliveryAt: null, createdAt: today() }
  },
  allIds: ["s1","s2"]
};

// Opportunities
export const demoOpportunities = {
  byId: {
    o1: { id: "o1", accountId: "a1", title: "Diffuser + 6-mo oil subscription", stage: "proposal", value: 15000, ownerId: "u_sales", expectedCloseDate: today(), activities: [], probability: 0.6, createdAt: today() }
  },
  allIds: ["o1"]
};

// Activities / Tasks / Notes
export const demoActivities = {
  byId: {
    a_delivery1: { id: "a_delivery1", type: "task", accountId: "a1", contactId: "c1", userId: "u_ops", subject: "Install diffuser (Cafe Bloom)", notes: "Install on ground floor near entrance", dueDate: today(), completed: false, createdAt: today(), result: "" },
    a_note1: { id: "a_note1", type: "note", accountId: "a1", contactId: "c1", userId: "u_sales", subject: "Client preference", notes: "Prefers lavender and light intensity", dueDate: null, completed: true, createdAt: today(), result: "" }
  },
  allIds: ["a_delivery1","a_note1"]
};

// Simple notes referenced by contact
export const demoNotes = {
  byId: {
    n1: { id: "n1", accountId: "a1", contactId: "c1", text: "Visited on 2025-11-01. Likes lavender." },
    n2: { id: "n2", accountId: "a2", contactId: "c2", text: "Quarterly maintenance included in subscription." }
  },
  allIds: ["n1","n2"]
};

// Assembled demo store (normalized)
export const demoStore = {
  users: { byId: demoUsers.byId, allIds: demoUsers.allIds, currentUser: demoUsers.currentUser },
  products: { byId: demoProducts.byId, allIds: demoProducts.allIds },
  accounts: { byId: demoAccounts.byId, allIds: demoAccounts.allIds },
  contacts: { byId: demoContacts.byId, allIds: demoContacts.allIds },
  subscriptions: { byId: demoSubscriptions.byId, allIds: demoSubscriptions.allIds },
  opportunities: { byId: demoOpportunities.byId, allIds: demoOpportunities.allIds },
  activities: { byId: demoActivities.byId, allIds: demoActivities.allIds },
  notes: { byId: demoNotes.byId, allIds: demoNotes.allIds },
  ui: { selectedContact: null, selectedAccount: null, nav: "dashboard" },
  meta: { seededAt: today() }
};

/**
 * Helper - write demoStore to localStorage under the key used by your StoreProvider.
 * Default key used in earlier examples: 'aroma-crm-store'
 *
 * Usage:
 * - Import this file in the browser devtools or call seedToLocalStorage() from your app startup (dev only).
 *
 * Example: in StoreProvider initialiser, if no existing state found, call seedToLocalStorage()
 */
export function seedToLocalStorage(key = "aroma-crm-store") {
  try {
    localStorage.setItem(key, JSON.stringify(demoStore));
    console.info("Demo store seeded to localStorage key:", key);
    return true;
  } catch (e) {
    console.error("Failed to seed demo store:", e);
    return false;
  }
}

/**
 * Quick login helper (client-side prototype only)
 * Checks username/password against demoUsers and returns user object or null.
 *
 * Example usage (in your login form handler):
 *   import { checkDemoLogin } from './data/seedData';
 *   const user = checkDemoLogin(username, password);
 *   if (user) { dispatch({type:'HYDRATE', payload: { users: demoUsers, ... } }) ... }
 */
export function checkDemoLogin(username, password) {
  const users = demoUsers.byId;
  for (const id of demoUsers.allIds) {
    const u = users[id];
    if (u.username === username && u.password === password) {
      // return a shallow copy without password
      const { password: _, ...safe } = u;
      return safe;
    }
  }
  return null;
}

// Demo credentials (for your convenience)
export const demoCredentials = [
  { username: "admin", password: "admin123", role: "admin", note: "Full access" },
  { username: "sales", password: "sales123", role: "sales", note: "Sales permissions" },
  { username: "ops", password: "ops123", role: "ops", note: "Operations / field tech" }
];

export default demoStore;
