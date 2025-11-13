import React from 'react';
import { Edit2, Trash2, UserCheck } from 'lucide-react';

export default function ClientTableRow({ 
    client, isSelected, toggleSelect, 
    setDetailClient, openEditClient, deleteClient
}) {
    return (
        <tr 
            className={`border-b border-gray-100 transition-colors cursor-pointer ${isSelected ? 'bg-purple-50 hover:bg-purple-100' : 'hover:bg-gray-50'}`}
            onClick={(e) => {
                // Don't open details if the click was on the checkbox or button
                if (e.target.type !== 'checkbox' && e.target.tagName !== 'BUTTON') {
                    setDetailClient(client);
                }
            }}
        >
            <td className="p-4 w-12 text-center">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(client.id)}
                    className="h-4 w-4 rounded text-purple-600 border-gray-300 focus:ring-purple-500"
                    onClick={(e) => e.stopPropagation()} // Stop propagation to prevent row click handler
                />
            </td>
            <td className="p-4">
                <div className="font-semibold text-gray-800">{client.name}</div>
                <div className="text-xs text-purple-600 font-medium capitalize mt-0.5">{client.type}</div>
                <div className="text-xs text-gray-500">{client.contact}</div>
            </td>
            <td className="p-4 text-sm text-gray-600">{client.email}</td>
            <td className="p-4 hidden lg:table-cell text-sm text-gray-600">{client.phone}</td>
            <td className="p-4 text-xs text-gray-500">{new Date(client.createdAt).toLocaleDateString()}</td>
            <td className="p-4 text-right">
                <div className="flex items-center justify-end gap-2">
                    <button 
                        onClick={(e) => { e.stopPropagation(); openEditClient(client); }} 
                        className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-purple-600 transition-colors"
                        title="Edit Client"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); setDetailClient(client); }} 
                        className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-purple-600 transition-colors"
                        title="View Details"
                    >
                        <UserCheck className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); deleteClient(client.id); }} 
                        className="p-2 rounded-full text-rose-500 hover:bg-rose-50 transition-colors"
                        title="Delete Client"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}