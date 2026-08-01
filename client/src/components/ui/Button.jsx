import { Loader2 } from "lucide-react";
import { cn } from "../../lib/cn";

const variants = {
  primary:
    "bg-[#5B4BFF] text-white shadow-[0_14px_30px_rgba(91,75,255,0.24)] hover:bg-[#4A3AF5] hover:shadow-[0_18px_38px_rgba(91,75,255,0.28)]",
  secondary:
    "border border-slate-200 bg-white text-slate-800 shadow-sm hover:border-slate-300 hover:bg-slate-50",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-950",
  danger:
    "bg-[#EF4444] text-white shadow-[0_14px_30px_rgba(239,68,68,0.18)] hover:bg-red-600",
};

const sizes = {
  sm: "h-9 gap-2 rounded-xl px-3 text-sm",
  md: "h-11 gap-2.5 rounded-2xl px-4 text-sm",
  lg: "h-12 gap-3 rounded-2xl px-5 text-base",
  icon: "h-11 w-11 rounded-2xl p-0",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  disabled = false,
  loading = false,
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        "inline-flex shrink-0 items-center justify-center font-bold tracking-tight outline-none transition-all duration-200 ease-out hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#5B4BFF] focus-visible:ring-offset-2 active:translate-y-0 disabled:pointer-events-none disabled:opacity-60",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
