const PageTitle = ({ eyebrow, title, description }) => (
  <div className="min-w-0">
    {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{eyebrow}</p>}
    <h1 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-slate-950 sm:text-3xl">{title}</h1>
    {description && <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">{description}</p>}
  </div>
);

export default PageTitle;
