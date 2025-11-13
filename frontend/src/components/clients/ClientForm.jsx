import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function ClientForm({ value, onCancel, onSave }) {
    const [local, setLocal] = useState({ ...(value || {}) });

    useEffect(() => setLocal({ ...(value || {}) }), [value]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-3xl p-6 shadow-2xl relative">
                <div className="flex items-center justify-between mb-6 border-b pb-3">
                    <h2 className="text-xl font-bold text-gray-800">{local.id ? "Edit Client" : "Add New Client"}</h2>
                    <button 
                        onClick={onCancel} 
                        className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    
                    <label className="block">
                        <div className="text-xs font-medium text-gray-600 mb-1">Business Name <span className="text-rose-500">*</span></div>
                        <input value={local.name || ""} onChange={(e) => setLocal((s) => ({ ...s, name: e.target.value }))} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-purple-500 focus:ring-purple-500 outline-none" placeholder="e.g., Grand Palms Hotel" />
                    </label>

                    <label className="block">
                        <div className="text-xs font-medium text-gray-600 mb-1">Type</div>
                        <select value={local.type || "hotel"} onChange={(e) => setLocal((s) => ({ ...s, type: e.target.value }))} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm appearance-none bg-white focus:border-purple-500 focus:ring-purple-500 outline-none">
                            <option value="hotel">Hotel</option>
                            <option value="retail">Retail</option>
                            <option value="office">Office</option>
                            <option value="spa">Spa</option>
                            <option value="other">Other</option>
                        </select>
                    </label>

                    <label className="block">
                        <div className="text-xs font-medium text-gray-600 mb-1">Primary Contact</div>
                        <input value={local.contact || ""} onChange={(e) => setLocal((s) => ({ ...s, contact: e.target.value }))} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-purple-500 focus:ring-purple-500 outline-none" placeholder="Contact Person" />
                    </label>

                    <label className="block">
                        <div className="text-xs font-medium text-gray-600 mb-1">Email <span className="text-rose-500">*</span></div>
                        <input type="email" value={local.email || ""} onChange={(e) => setLocal((s) => ({ ...s, email: e.target.value }))} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-purple-500 focus:ring-purple-500 outline-none" placeholder="Email Address" />
                    </label>

                    <label className="block">
                        <div className="text-xs font-medium text-gray-600 mb-1">Phone</div>
                        <input type="tel" value={local.phone || ""} onChange={(e) => setLocal((s) => ({ ...s, phone: e.target.value }))} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-purple-500 focus:ring-purple-500 outline-none" placeholder="Phone Number" />
                    </label>
                    
                    <label className="block col-span-1 md:col-span-2">
                        <div className="text-xs font-medium text-gray-600 mb-1">Address</div>
                        <input value={local.address || ""} onChange={(e) => setLocal((s) => ({ ...s, address: e.target.value }))} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-purple-500 focus:ring-purple-500 outline-none" placeholder="Street Address, City, State/Province" />
                    </label>

                    <label className="block col-span-1 md:col-span-2">
                        <div className="text-xs font-medium text-gray-600 mb-1">Notes</div>
                        <textarea value={local.notes || ""} onChange={(e) => setLocal((s) => ({ ...s, notes: e.target.value }))} rows={3} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:border-purple-500 focus:ring-purple-500 outline-none" placeholder="Client preferences, trial results, special instructions..." />
                    </label>
                </div>

                <div className="mt-6 flex items-center justify-end gap-3 border-t pt-4">
                    <button onClick={onCancel} className="px-4 py-2 rounded-xl text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors">Cancel</button>
                    <button onClick={() => onSave(local)} className="px-4 py-2 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/30">
                        Save Client
                    </button>
                </div>
            </div>
        </div>
    );
}