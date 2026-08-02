const WidgetHeader = ({ eyebrow, title, action }) => (
  <div className="flex items-start justify-between gap-4">
    <div className="min-w-0">
      {eyebrow && <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-400">{eyebrow}</p>}
      <h2 className="mt-1 text-[20px] font-semibold tracking-tight text-slate-950">{title}</h2>
    </div>
    {action}
  </div>
);

export default WidgetHeader;
