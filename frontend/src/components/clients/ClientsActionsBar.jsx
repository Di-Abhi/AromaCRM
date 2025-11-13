import React from 'react';
import { Trash2, Download, Upload } from 'lucide-react';

export default function ClientsActionsBar({
    selectedIds, clearSelection, bulkDeleteSelected, 
    exportJson, importJson, importInputRef
}) {
    return (
        selectedIds.size > 0 ? (
            <div className="flex items-center gap-3 p-3 mb-4 bg-purple-50 border border-purple-200 rounded-xl transition-all">
                <span className="text-sm font-medium text-purple-700">{selectedIds.size} selected</span>
                <button 
                    onClick={clearSelection} 
                    className="px-3 py-1 rounded-lg border border-purple-300 text-sm text-purple-700 hover:bg-purple-100 transition-colors"
                >
                    Clear Selection
                </button>
                <button 
                    onClick={bulkDeleteSelected} 
                    className="px-3 py-1 rounded-lg bg-rose-500 text-white text-sm hover:bg-rose-600 transition-colors"
                >
                    <Trash2 className="w-4 h-4 inline mr-1" /> Delete Selected
                </button>
            </div>
        ) : (
            <div className="flex items-center justify-end gap-3 mb-4">
                <button onClick={exportJson} className="px-3 py-2 rounded-xl border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" /> Export
                </button>
                <label className="px-3 py-2 rounded-xl border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-2">
                    <Upload className="w-4 h-4" /> Import
                    <input 
                        ref={importInputRef}
                        type="file" 
                        accept="application/json" 
                        onChange={(e) => importJson(e.target.files?.[0])} 
                        className="hidden" 
                    />
                </label>
            </div>
        )
    );
}