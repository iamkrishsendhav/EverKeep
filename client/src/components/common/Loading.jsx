import { Loader2 } from "lucide-react";
import { cn } from "../../lib/cn";

const Loading = ({ label = "Loading", className = "" }) => (
  <div className={cn("flex min-h-48 flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-8", className)}>
    <Loader2 className="h-6 w-6 animate-spin text-[#5B4BFF]" />
    <p className="mt-4 text-sm font-semibold text-slate-500">{label}</p>
  </div>
);

export default Loading;
