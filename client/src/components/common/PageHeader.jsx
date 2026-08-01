const PageHeader = ({ eyebrow, title, description, actions }) => (
  <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
    <div className="min-w-0">
      {eyebrow && <p className="text-sm font-semibold text-[#5B4BFF]">{eyebrow}</p>}
      <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
      {description && <p className="mt-3 max-w-2xl text-base leading-8 text-slate-600">{description}</p>}
    </div>
    {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
  </header>
);

export default PageHeader;
