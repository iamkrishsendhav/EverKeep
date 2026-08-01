import { cn } from "../../lib/cn";

const Input = ({ label, hint, error, className = "", id, ...props }) => {
  const inputId = id || props.name;

  return (
    <label className="block">
      {label && (
        <span className="mb-2 block text-sm font-bold tracking-tight text-slate-800">
          {label}
        </span>
      )}
      <input
        id={inputId}
        className={cn(
          "h-11 w-full rounded-2xl border bg-white px-4 text-sm font-medium text-slate-900 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#5B4BFF] focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400",
          error ? "border-red-200" : "border-slate-200",
          className,
        )}
        {...props}
      />
      {(hint || error) && <p className={cn("mt-2 text-sm leading-6", error ? "text-red-600" : "text-slate-500")}>{error || hint}</p>}
    </label>
  );
};

export default Input;
