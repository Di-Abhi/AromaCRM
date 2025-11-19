import React from 'react';
export default function InstallationDetailsPanel({ item, onClose, openEdit, deleteInstallation, markCompleted, assignTechnician }) {
    if (!item) return null;
    function fmtDate(ts) { if (!ts) return '-'; try { return new Date(ts).toLocaleString(); } catch { return ts; } }


    return (
        <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-lg z-50">
            <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-semibold">Installation details</h3>
                <button onClick={onClose} className="text-gray-600">Close</button>
            </div>


            <div className="p-4 space-y-3">
                <div>
                    <div className="text-sm text-gray-500">Account</div>
                    <div className="font-medium">{item.accountId}</div>
                </div>
                <div>
                    <div className="text-sm text-gray-500">Address</div>
                    <div className="font-medium">{item.address}</div>
                </div>
                <div>
                    <div className="text-sm text-gray-500">Scheduled</div>
                    <div className="font-medium">{fmtDate(item.scheduledAt)}</div>
                </div>
                <div>
                    <div className="text-sm text-gray-500">Technician</div>
                    <div className="font-medium">{item.technician}</div>
                </div>
                <div>
                    <div className="text-sm text-gray-500">Status</div>
                    <div className="font-medium">{item.status}</div>
                </div>
                <div>
                    <div className="text-sm text-gray-500">Notes</div>
                    <div className="whitespace-pre-wrap">{item.notes}</div>
                </div>


                <div className="flex gap-2 pt-2">
                    <button onClick={() => markCompleted(item.id)} className="px-3 py-2 border rounded">Mark Completed</button>
                    <button onClick={() => assignTechnician(item.id)} className="px-3 py-2 border rounded">Assign Tech</button>
                    <button onClick={() => openEdit(item)} className="px-3 py-2 border rounded">Edit</button>
                </div>


                <div className="flex gap-2 justify-end pt-4">
                    <button onClick={() => { if (confirm('Delete installation?')) deleteInstallation(item.id); }} className="px-3 py-2 text-red-600">Delete</button>
                </div>
            </div>
        </div>
    );
}