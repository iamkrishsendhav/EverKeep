import { cn } from "../../lib/cn";

const variants = {
  neutral: "border-slate-200 bg-slate-50 text-slate-600",
  primary: "border-indigo-100 bg-indigo-50 text-[#5B4BFF]",
  success: "border-emerald-100 bg-emerald-50 text-[#16A34A]",
  warning: "border-amber-100 bg-amber-50 text-[#F59E0B]",
  danger: "border-red-100 bg-red-50 text-[#EF4444]",
};

const Badge = ({ children, variant = "neutral", className = "" }) => (
  <span
    className={cn(
      "inline-flex max-w-full items-center rounded-full border px-2.5 py-1 text-xs font-bold leading-none",
      variants[variant],
      className,
    )}
  >
    {children}
  </span>
);

export default Badge;
