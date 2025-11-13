const MiniBarChart = ({data}) => {

    const max = data && data.length ? Math.max(...data.map((d) => d.value || 0), 1) : 1;
    // Format numbers with commas (e.g., 12000 -> 12,000) for title
    const formatValue = (value) => value ? value.toLocaleString() : 0;

    return (
        // NOTE: The main Dashboard component now provides the title and p-6 padding/shadow.
        // This component focuses purely on the chart visualization.
        
        <div className="h-48 flex flex-col justify-end pt-4"> {/* Increased height to h-48 for better visualization */}
            
            {/* Chart Area: Flex container */}
            <div className="flex items-end gap-5 h-full border-b border-gray-200 pb-2">
                {data.map((d, i) => {
                    // percentage height of the colored bar
                    const pct = Math.round(((d.value || 0) / max) * 100);
                    return (
                        <div 
                            key={i} 
                            className="flex flex-col items-center gap-2 h-full justify-end flex-1"
                        >
                            {/* Value tooltip label (optional) */}
                            <div className="text-xs font-medium text-gray-700 absolute mb-36">
                                {d.value > 0 ? formatValue(d.value) : ''}
                            </div>
                            
                            {/* Bar wrapper and bar itself */}
                            <div
                                className="w-full max-w-[30px] rounded-t-lg bg-purple-500 transition-all duration-300 ease-out hover:bg-purple-600 cursor-pointer"
                                style={{ height: `${pct}%`, minHeight: pct === 0 ? 4 : undefined }}
                                title={`${d.label}: ${formatValue(d.value)}`}
                            />
                            
                            {/* Label */}
                            <div className="text-xs font-medium text-gray-600 mt-1">{d.label}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default MiniBarChart