import { PackageOpen } from "lucide-react";
import Button from "../ui/Button";

const EmptyState = ({
  icon: Icon = PackageOpen,
  title = "Nothing here yet",
  description = "Once you add records, they will appear here.",
  actionLabel,
  onAction,
}) => (
  <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center">
    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-50 text-slate-500 ring-1 ring-slate-200">
      <Icon size={24} />
    </div>
    <h2 className="mt-5 text-xl font-bold tracking-tight text-slate-950">{title}</h2>
    <p className="mt-2 max-w-md text-sm leading-7 text-slate-600">{description}</p>
    {actionLabel && (
      <Button className="mt-6" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
);

export default EmptyState;
