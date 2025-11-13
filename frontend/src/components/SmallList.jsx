const SmallList = ({title,items=[]}) => {

    return (
        // Enhanced styling: Larger container padding and border/shadow
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
            {/* Header: Bolder title and clean count */}
            <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-semibold text-gray-800">{title}</div>
                <div className="text-sm text-gray-500">{items.length} items</div>
            </div>
            
            <ul className="space-y-3">
                {items.map((it) => (
                    // List Item: Added padding and hover effect
                    <li key={it.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        
                        {/* Avatar: Rounded-full and using the purple accent color */}
                        <div className="h-10 w-10 min-w-[40px] rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-base font-semibold">
                            {(it.name || "").charAt(0)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            {/* Name: Truncate long names, stronger font */}
                            <div className="text-sm font-semibold text-gray-800 truncate">{it.name}</div>
                            
                            {/* Subtitle: Slightly better contrast */}
                            <div className="text-xs text-gray-500">{it.sub}</div>
                        </div>
                        
                        {/* Time/Date: Right-aligned, subtle */}
                        <div className="text-xs text-gray-500 min-w-max">{it.time}</div>
                    </li>
                ))}
                {items.length === 0 && (
                    <li className="text-sm text-gray-500 p-2">No recent items to display.</li>
                )}
            </ul>
        </div>
    );
}

export default SmallList