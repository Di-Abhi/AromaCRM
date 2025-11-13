const KpiCard = (props) => {
    const title = props.title
    const value = props.value
    const subtitle=props.subtitle
    return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-semibold text-gray-800 mt-2">{value}</div>
      {subtitle && <div className="text-xs text-gray-400 mt-2">{subtitle}</div>}
    </div>
  );
}

export default KpiCard
