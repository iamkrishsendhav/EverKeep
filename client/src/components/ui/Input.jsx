import { forwardRef } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "../../lib/cn";

const Input = forwardRef(
  (
    {
      label,
      hint,
      error,
      required = false,
      leftIcon,
      rightIcon,
      className,
      id,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const inputId = id || props.name;

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="flex items-center gap-1 text-sm font-semibold tracking-tight text-slate-700"
          >
            {label}

            {required && (
              <span className="text-red-500">*</span>
            )}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={
              hint || error ? `${inputId}-description` : undefined
            }
            className={cn(
              "h-11 w-full rounded-xl border bg-white text-sm font-medium text-slate-900 shadow-sm outline-none transition-all duration-200",

              "placeholder:text-slate-400",

              "focus:border-slate-950",

              "focus:ring-4",

              "focus:ring-slate-950/5",

              disabled &&
                "cursor-not-allowed bg-slate-50 text-slate-400",

              leftIcon && "pl-11",

              rightIcon && "pr-11",

              error
                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                : "border-slate-200",

              className
            )}
            {...props}
          />

          {rightIcon && !error && (
            <div className="absolute inset-y-0 right-4 flex items-center text-slate-400">
              {rightIcon}
            </div>
          )}

          {error && (
            <div className="absolute inset-y-0 right-4 flex items-center text-red-500">
              <AlertCircle size={18} />
            </div>
          )}
        </div>

        {(hint || error) && (
          <p
            id={`${inputId}-description`}
            className={cn(
              "text-xs leading-5",
              error ? "text-red-600" : "text-slate-500"
            )}
          >
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;