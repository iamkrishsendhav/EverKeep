import ViewReveal from "./Motion";

const SectionHeader = ({
  eyebrow,
  title,
  description,
  align = "center",
  inverse = false,
}) => {
  const isLeft = align === "left";

  const titleColor = inverse ? "text-white" : "text-slate-950";
  const descriptionColor = inverse ? "text-slate-300" : "text-slate-600";

  return (
    <ViewReveal className="w-full">
      <div
        className={`mx-auto flex max-w-4xl flex-col ${
          isLeft ? "items-start text-left" : "items-center text-center"
        }`}
      >
        {eyebrow && (
          <span
          className={`inline-flex max-w-full items-center rounded-full border px-4 py-1.5 text-center text-xs font-semibold uppercase tracking-[0.22em] ${
              inverse
                ? "border-white/10 bg-white/10 text-blue-200"
                : "border-indigo-100 bg-indigo-50 text-indigo-600"
            }`}
          >
            {eyebrow}
          </span>
        )}

        <h2
          className={`mt-5 max-w-3xl text-[2.1rem] font-bold leading-[1.12] tracking-tight
          sm:text-5xl lg:text-[3rem] ${titleColor}`}
        >
          {title}
        </h2>

        {description && (
          <p
            className={`mt-7 max-w-2xl text-[1.12rem] leading-8 ${descriptionColor}`}
          >
            {description}
          </p>
        )}
      </div>
    </ViewReveal>
  );
};

export default SectionHeader;
