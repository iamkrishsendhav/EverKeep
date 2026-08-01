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
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-24 bg-gradient-to-r from-primary-100/50 via-white to-primary-50/60 blur-3xl" />

      <div className="landing-container flex h-20 items-center justify-between gap-6">
        <a href="/" className="flex shrink-0 items-center gap-3" aria-label="EverKeep home">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-600 shadow-xl shadow-primary-600/20">
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
              <span className="absolute -bottom-2 left-0 h-0.5 w-0 rounded-full bg-primary-600 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <a
            href="/login"
            className="landing-button landing-button-secondary h-11 px-5"
          >
            Login
          </a>
          <a
            href="/register"
            className="landing-button landing-button-primary h-11 whitespace-nowrap px-5"
          >
            Get Started
          </a>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="shrink-0 rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:shadow-md lg:hidden"
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
            <div className="landing-container space-y-2 py-5">
              {navLinks.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between rounded-xl px-4 py-4 font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  {item.title}
                  {item.dropdown && <ChevronDown size={18} />}
                </a>
              ))}
              <div className="grid gap-3 pt-4">
                <a href="/login" onClick={() => setMobileOpen(false)} className="rounded-xl border border-slate-200 px-5 py-4 text-center font-bold">
                  Login
                </a>
                <a href="/register" onClick={() => setMobileOpen(false)} className="rounded-xl bg-primary-600 px-5 py-4 text-center font-bold text-white">
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
