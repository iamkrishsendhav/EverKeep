import { X } from "lucide-react";
import { SidebarContent } from "./Sidebar";

const MobileSidebar = ({ open, onClose }) => (
  <>
    <div
      className={`fixed inset-0 z-40 bg-slate-950/30 transition-opacity lg:hidden ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      onClick={onClose}
      aria-hidden="true"
    />
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-[18rem] flex-col border-r border-slate-200 bg-white px-4 py-5 transition-transform duration-300 lg:hidden ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
      aria-label="Mobile navigation"
    >
      <button
        type="button"
        className="absolute right-4 top-5 grid h-9 w-9 place-items-center rounded-xl text-slate-500 hover:bg-slate-100"
        onClick={onClose}
        aria-label="Close navigation"
      >
        <X size={18} />
      </button>
      <SidebarContent />
    </aside>
  </>
);

export default MobileSidebar;
