import { cn } from "../../lib/cn";

const Card = ({ children, className = "", as: Component = "section" }) => {
  return (
    <Component
      className={cn(
        "rounded-3xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.055)]",
        className,
      )}
    >
      {children}
    </Component>
  );
};

export const CardHeader = ({ children, className = "" }) => (
  <div className={cn("border-b border-slate-100 p-5 sm:p-6", className)}>{children}</div>
);

export const CardContent = ({ children, className = "" }) => (
  <div className={cn("p-5 sm:p-6", className)}>{children}</div>
);

export const CardTitle = ({ children, className = "" }) => (
  <h2 className={cn("text-lg font-bold tracking-tight text-slate-950", className)}>{children}</h2>
);

export const CardDescription = ({ children, className = "" }) => (
  <p className={cn("mt-1 text-sm leading-6 text-slate-600", className)}>{children}</p>
);

export default Card;
