import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";
import { cn } from "../../lib/cn";

const variants = {
  info: {
    icon: Info,
    className: "border-indigo-100 bg-indigo-50 text-indigo-900",
    iconClassName: "text-[#5B4BFF]",
  },
  success: {
    icon: CheckCircle2,
    className: "border-emerald-100 bg-emerald-50 text-emerald-900",
    iconClassName: "text-[#16A34A]",
  },
  warning: {
    icon: TriangleAlert,
    className: "border-amber-100 bg-amber-50 text-amber-900",
    iconClassName: "text-[#F59E0B]",
  },
  danger: {
    icon: AlertCircle,
    className: "border-red-100 bg-red-50 text-red-900",
    iconClassName: "text-[#EF4444]",
  },
};

const Alert = ({ title, children, variant = "info", className = "" }) => {
  const config = variants[variant];
  const Icon = config.icon;

  return (
    <div className={cn("flex gap-3 rounded-2xl border p-4", config.className, className)} role="status">
      <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", config.iconClassName)} />
      <div className="min-w-0">
        {title && <p className="font-bold tracking-tight">{title}</p>}
        {children && <div className="mt-1 text-sm leading-6 opacity-80">{children}</div>}
      </div>
    </div>
  );
};

export default Alert;
