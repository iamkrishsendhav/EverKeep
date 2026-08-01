const WidgetHeader = ({ eyebrow, title, action }) => (
  <div className="flex items-start justify-between gap-4">
    <div className="min-w-0">
      {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{eyebrow}</p>}
      <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-950">{title}</h2>
    </div>
    {action}
  </div>
);

export default WidgetHeader;
