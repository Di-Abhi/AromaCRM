import React from 'react';
import { ChevronLeft, ChevronRight, ChevronRight as ChevronRightIcon } from 'lucide-react';
import ClientTableRow from './ClientTableRow';

export default function ClientsList({
    visibleClients, selectedIds, toggleSelect, 
    toggleSelectAllVisible, setDetailClient, 
    openEditClient, deleteClient, 
    page, setPage, totalPages, PAGE_SIZE
}) {
    const isAllVisibleSelected = visibleClients.length > 0 && visibleClients.every(c => selectedIds.has(c.id));

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
            
            {/* Desktop Table */}
            <div className="overflow-x-auto hidden md:block">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 w-12">
                                <input 
                                    type="checkbox"
                                    checked={isAllVisibleSelected}
                                    onChange={toggleSelectAllVisible}
                                    className="h-4 w-4 rounded text-purple-600 border-gray-300 focus:ring-purple-500"
                                />
                            </th>
                            <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[200px]">Name & Type</th>
                            <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                            <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">Phone</th>
                            <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">Joined</th>
                            <th className="p-4 w-32"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {visibleClients.length > 0 ? (
                            visibleClients.map((c) => (
                                <ClientTableRow 
                                    key={c.id} 
                                    client={c}
                                    isSelected={selectedIds.has(c.id)}
                                    toggleSelect={toggleSelect}
                                    setDetailClient={setDetailClient}
                                    openEditClient={openEditClient}
                                    deleteClient={deleteClient}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="p-10 text-center text-gray-500 text-sm">
                                    No clients found matching the current search or filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile List (Cards) */}
            <div className="p-4 md:hidden space-y-3">
                {visibleClients.length > 0 ? (
                    visibleClients.map((c) => (
                        <div key={c.id} className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.has(c.id)}
                                        onChange={() => toggleSelect(c.id)}
                                        className="mt-1 h-4 w-4 rounded text-purple-600 border-gray-300 focus:ring-purple-500"
                                    />
                                    <div>
                                        <div className="font-bold text-gray-800">{c.name}</div>
                                        <div className="text-xs text-purple-600 font-medium capitalize mt-0.5">{c.type} • {c.contact}</div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setDetailClient(c)} 
                                    className="ml-4 p-2 rounded-full text-gray-500 hover:bg-gray-100"
                                    title="View Details"
                                >
                                    <ChevronRightIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="text-xs text-gray-500 mt-3 border-t pt-2">
                                <span className="font-semibold text-gray-700">Email:</span> {c.email} 
                                <span className="ml-3 font-semibold text-gray-700">Phone:</span> {c.phone}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-10 text-center text-gray-500 text-sm">
                        No clients found matching the current search or filters.
                    </div>
                )}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t">
                    <div className="text-sm text-gray-600">
                        Showing {PAGE_SIZE * (page - 1) + 1} to {Math.min(PAGE_SIZE * page, visibleClients.length)} of {visibleClients.length} results
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-2 rounded-full text-gray-600 border border-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-sm font-semibold text-gray-800">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="p-2 rounded-full text-gray-600 border border-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}