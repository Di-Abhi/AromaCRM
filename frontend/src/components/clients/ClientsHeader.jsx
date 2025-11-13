import React from 'react';
import { Plus, Search } from 'lucide-react';

export default function ClientsHeader({ 
    query, setQuery, filterType, setFilterType, 
    sortBy, setSortBy, setPage, openNewClient 
}) {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-800">Client Accounts</h1>
          <p className="text-sm text-gray-500">Manage partners, hotels, retail clients, and their details.</p>
        </div>

        <button 
          onClick={openNewClient} 
          className="w-full md:w-auto px-4 py-2 rounded-xl bg-purple-600 text-white flex items-center justify-center gap-2 font-semibold hover:bg-purple-700 transition-colors shadow-md shadow-purple-500/30"
        >
          <Plus className="w-5 h-5" /> Add New Client
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        
        {/* Search */}
        <label className="flex items-center flex-1 min-w-0 border border-gray-300 rounded-xl px-3 py-2 bg-white">
          <Search className="w-5 h-5 text-gray-400 mr-2" />
          <input 
            value={query} 
            onChange={(e) => { setQuery(e.target.value); setPage(1); }} 
            placeholder="Search name, contact, or email..." 
            className="w-full outline-none text-sm text-gray-700 placeholder-gray-400" 
          />
        </label>

        {/* Filter Type */}
        <select 
          value={filterType} 
          onChange={(e) => { setFilterType(e.target.value); setPage(1); }} 
          className="w-full lg:w-40 border border-gray-300 rounded-xl px-3 py-2 text-sm appearance-none bg-white focus:border-purple-500 focus:ring-purple-500"
        >
          <option value="all">All Types</option>
          <option value="hotel">Hotel</option>
          <option value="retail">Retail</option>
          <option value="office">Office</option>
          <option value="spa">Spa</option>
          <option value="other">Other</option>
        </select>

        {/* Sort By */}
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)} 
          className="w-full lg:w-40 border border-gray-300 rounded-xl px-3 py-2 text-sm appearance-none bg-white focus:border-purple-500 focus:ring-purple-500"
        >
          <option value="name">Sort: Name (A-Z)</option>
          <option value="newest">Sort: Newest First</option>
        </select>
      </div>
    </div>
  );
}