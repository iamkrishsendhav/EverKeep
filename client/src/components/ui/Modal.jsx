import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "../../lib/cn";
import Button from "./Button";

const Modal = ({ open, onClose, title, description, children, footer, className = "" }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 px-4 py-6 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.section
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? "modal-title" : undefined}
          className={cn("w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.18)]", className)}
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          <header className="flex items-start justify-between gap-4 border-b border-slate-100 p-5 sm:p-6">
            <div className="min-w-0">
              {title && (
                <h2 id="modal-title" className="text-lg font-bold tracking-tight text-slate-950">
                  {title}
                </h2>
              )}
              {description && <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close modal">
              <X size={18} />
            </Button>
          </header>
          <div className="p-5 sm:p-6">{children}</div>
          {footer && <footer className="flex flex-wrap justify-end gap-3 border-t border-slate-100 p-5 sm:p-6">{footer}</footer>}
        </motion.section>
      </motion.div>
    )}
  </AnimatePresence>
);

export default Modal;
