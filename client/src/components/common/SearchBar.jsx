import { Search } from "lucide-react";
import { cn } from "../../lib/cn";

const SearchBar = ({ className = "", label = "Search", ...props }) => (
  <label className={cn("flex h-11 min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-500 shadow-sm", className)}>
    <Search size={18} />
    <span className="sr-only">{label}</span>
    <input
      type="search"
      className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
      {...props}
    />
  </label>
);

export default SearchBar;
