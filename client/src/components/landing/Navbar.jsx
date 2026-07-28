import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, ShieldCheck, X } from "lucide-react";

const navLinks = [
  { title: "Features", href: "#features" },
  { title: "How It Works", href: "#how-it-works" },
  { title: "Pricing", href: "#pricing" },
  { title: "Resources", href: "#faq", dropdown: true },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-[100] transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-200/80 bg-white/85 shadow-sm backdrop-blur-2xl"
          : "border-b border-transparent bg-white/70 backdrop-blur-xl"
      }`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-24 bg-gradient-to-r from-blue-100/50 via-white to-violet-100/50 blur-3xl" />

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-6 sm:px-8 lg:px-10">
        <a href="/" className="flex shrink-0 items-center gap-3" aria-label="EverKeep home">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-xl shadow-blue-600/20">
            <ShieldCheck size={21} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
            EverKeep
          </span>
        </a>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-7 xl:gap-9 lg:flex">
          {navLinks.map((item) => (
            <a
              key={item.title}
              href={item.href}
              className="group relative flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-slate-600 transition hover:text-slate-950"
            >
              {item.title}
              {item.dropdown && (
                <ChevronDown size={15} className="transition-transform duration-300 group-hover:rotate-180" />
              )}
              <span className="absolute -bottom-2 left-0 h-0.5 w-0 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <a
            href="/login"
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white/70 px-5 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:text-slate-950 hover:shadow-md"
          >
            Login
          </a>
          <a
            href="/register"
            className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-blue-600/30"
          >
            Get Started
          </a>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="shrink-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:shadow-md lg:hidden"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="border-t border-slate-200 bg-white/95 shadow-xl backdrop-blur-2xl lg:hidden"
          >
            <div className="mx-auto max-w-7xl space-y-2 px-6 py-5 sm:px-8">
              {navLinks.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between rounded-2xl px-4 py-4 font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  {item.title}
                  {item.dropdown && <ChevronDown size={18} />}
                </a>
              ))}
              <div className="grid gap-3 pt-4">
                <a href="/login" onClick={() => setMobileOpen(false)} className="rounded-2xl border border-slate-200 px-5 py-4 text-center font-bold">
                  Login
                </a>
                <a href="/register" onClick={() => setMobileOpen(false)} className="rounded-2xl bg-blue-600 px-5 py-4 text-center font-bold text-white">
                  Get Started
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
