import React from 'react';
import { X, ShoppingCart, Zap, Wrench, Clipboard, Edit2, Trash2 } from 'lucide-react';

export default function ClientDetailsPanel({ client, onClose, openEditClient, deleteClient, quickCreate }) {
    if (!client) return null;
    return (
        <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose}>
            <div 
                className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 overflow-auto transform transition-transform duration-300 ease-in-out"
                onClick={(e) => e.stopPropagation()} 
            >
                <div className="p-5 border-b flex items-center justify-between sticky top-0 bg-white">
                    <div>
                        <div className="text-xl font-bold text-gray-800">{client.name}</div>
                        <div className="text-sm font-medium text-purple-600 capitalize mt-0.5">{client.type} • {client.contact}</div>
                    </div>
                    <div>
                        <button 
                            onClick={onClose} 
                            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                            aria-label="Close details"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="p-5 space-y-5">
                    
                    {/* Contact Info */}
                    <div className="space-y-3">
                        <h3 className="text-base font-semibold text-gray-700 border-b pb-2">Contact Details</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-2">
                                <div className="text-xs text-gray-500">Address</div>
                                <div className="text-sm font-medium text-gray-800 whitespace-pre-wrap">{client.address || 'N/A'}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">Email</div>
                                <div className="text-sm font-medium text-purple-600">{client.email}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500">Phone</div>
                                <div className="text-sm font-medium text-gray-800">{client.phone || 'N/A'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                        <h3 className="text-base font-semibold text-gray-700 border-b pb-2">Notes</h3>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">{client.notes || 'No notes available.'}</p>
                    </div>

                    {/* Quick Actions */}
                    <div className="pt-3 border-t space-y-3">
                        <h3 className="text-base font-semibold text-gray-700">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => quickCreate("order", client)} className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-gray-300 text-sm hover:bg-gray-50 transition-colors">
                                <ShoppingCart className="w-4 h-4 text-gray-600" /> Order
                            </button>
                            <button onClick={() => quickCreate("install", client)} className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-gray-300 text-sm hover:bg-gray-50 transition-colors">
                                <Zap className="w-4 h-4 text-gray-600" /> Install
                            </button>
                            <button onClick={() => quickCreate("ticket", client)} className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-gray-300 text-sm hover:bg-gray-50 transition-colors">
                                <Wrench className="w-4 h-4 text-gray-600" /> Ticket
                            </button>
                            <button 
                                onClick={() => { navigator.clipboard.writeText(client.email); alert("Email copied!"); }} 
                                className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-gray-300 text-sm hover:bg-gray-50 transition-colors"
                            >
                                <Clipboard className="w-4 h-4 text-gray-600" /> Copy Email
                            </button>
                        </div>
                        <div className="flex justify-between pt-3">
                            <button onClick={() => openEditClient(client)} className="flex items-center gap-2 px-3 py-2 text-sm text-purple-600 font-medium hover:text-purple-700">
                                <Edit2 className="w-4 h-4" /> Edit Client
                            </button>
                            <button onClick={() => deleteClient(client.id)} className="flex items-center gap-2 px-3 py-2 text-sm text-rose-500 hover:text-rose-600">
                                <Trash2 className="w-4 h-4" /> Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}