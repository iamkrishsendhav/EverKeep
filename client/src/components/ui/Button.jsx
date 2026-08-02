import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/cn";

const variants = {
  primary:
    "bg-slate-950 text-white shadow-[0_12px_30px_rgba(15,23,42,0.18)] hover:bg-slate-800 hover:shadow-[0_18px_36px_rgba(15,23,42,0.22)]",

  secondary:
    "border border-slate-200 bg-white text-slate-800 shadow-sm hover:border-slate-300 hover:bg-slate-50",

  outline:
    "border border-slate-300 bg-transparent text-slate-800 hover:bg-slate-100",

  ghost:
    "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-950",

  success:
    "bg-emerald-600 text-white shadow-[0_12px_30px_rgba(5,150,105,0.20)] hover:bg-emerald-700",

  danger:
    "bg-red-600 text-white shadow-[0_12px_30px_rgba(220,38,38,0.18)] hover:bg-red-700",
};

const sizes = {
  xs: "h-8 px-3 text-xs rounded-lg",
  sm: "h-9 px-3.5 text-sm rounded-xl",
  md: "h-11 px-5 text-sm rounded-xl",
  lg: "h-12 px-6 text-base rounded-2xl",
  xl: "h-14 px-7 text-base rounded-2xl",
  icon: "h-11 w-11 rounded-xl p-0",
};

const Button = forwardRef(
  (
    {
      children,

      variant = "primary",

      size = "md",

      type = "button",

      disabled = false,

      loading = false,

      fullWidth = false,

      leftIcon,

      rightIcon,

      className,

      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        aria-busy={loading}
        className={cn(
          "inline-flex shrink-0 items-center justify-center gap-2 font-semibold tracking-tight",
          "transition-all duration-200 ease-out",
          "hover:-translate-y-0.5 active:translate-y-0",
          "focus-visible:outline-none",
          "focus-visible:ring-2",
          "focus-visible:ring-slate-900/20",
          "focus-visible:ring-offset-2",
          "disabled:pointer-events-none",
          "disabled:opacity-60",
          "select-none",

          variants[variant],

          sizes[size],

          fullWidth && "w-full",

          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && (
              <span className="flex items-center">
                {leftIcon}
              </span>
            )}

            {children}

            {rightIcon && (
              <span className="flex items-center">
                {rightIcon}
              </span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;