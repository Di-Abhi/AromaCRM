import React from 'react';
export default function InstallationsActionsBar({ selectedIds, clearSelection, bulkDelete, exportJson, importJson, importInputRef }) {
  function onFileChange(e) {
    const f = e.target.files && e.target.files[0];
    if (f) importJson(f);
  }

  return (
    <div className="mb-4 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <button onClick={() => exportJson()} className="border px-3 py-1 rounded">Export</button>
        <label className="border px-3 py-1 rounded cursor-pointer">
          Import
          <input ref={importInputRef} onChange={onFileChange} type="file" accept="application/json" className="hidden" />
        </label>
        <button onClick={clearSelection} className="border px-3 py-1 rounded">Clear</button>
        <button onClick={bulkDelete} disabled={!selectedIds.size} className={`px-3 py-1 rounded ${selectedIds.size ? 'bg-red-600 text-white' : 'opacity-50 cursor-not-allowed'}`}>Delete Selected</button>
      </div>

      <div className="text-sm text-gray-600">{selectedIds.size} selected</div>
    </div>
  );
}