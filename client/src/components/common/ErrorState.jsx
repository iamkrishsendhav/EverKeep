import { AlertTriangle } from "lucide-react";
import Button from "../ui/Button";

const ErrorState = ({
  title = "Something went wrong",
  description = "We could not load this workspace. Please try again.",
  actionLabel = "Retry",
  onAction,
}) => (
  <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-red-100 bg-red-50/60 p-8 text-center">
    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-[#EF4444] ring-1 ring-red-100">
      <AlertTriangle size={24} />
    </div>
    <h2 className="mt-5 text-xl font-bold tracking-tight text-slate-950">{title}</h2>
    <p className="mt-2 max-w-md text-sm leading-7 text-slate-600">{description}</p>
    {onAction && (
      <Button variant="secondary" className="mt-6" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
);

export default ErrorState;
