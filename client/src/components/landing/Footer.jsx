import { Code2, MessageCircle, ShieldCheck, Users } from "lucide-react";

const columns = [
  { title: "Product", links: ["Asset Management", "Document Vault", "AI Insights", "Family Sharing"] },
  { title: "Resources", links: ["Guides", "Templates", "Security", "Changelog"] },
  { title: "Company", links: ["About", "Careers", "Contact", "Partners"] },
  { title: "Legal", links: ["Privacy", "Terms", "DPA", "Cookies"] },
];

const Footer = () => {
  return (
    <footer className="overflow-hidden border-t border-slate-200 bg-slate-950 px-6 py-16 text-white sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,2fr)]">
        <div className="min-w-0">
          <a href="/" className="flex items-center gap-3" aria-label="EverKeep home">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500">
              <ShieldCheck size={22} />
            </div>
            <span className="text-2xl font-black">EverKeep</span>
          </a>
          <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
            AI powered personal asset lifecycle management for the things, documents and decisions that matter.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {[MessageCircle, Users, Code2].map((Icon, index) => (
              <a
                key={index}
                href="#"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 text-slate-300 transition hover:bg-white/10 hover:text-white"
                aria-label="Social link"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div className="grid min-w-0 grid-cols-2 gap-8 sm:grid-cols-4 lg:gap-10">
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-black text-white">{column.title}</h3>
              <div className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <a key={link} href="#" className="block text-sm font-medium text-slate-400 transition hover:text-white">
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-7xl flex-col gap-4 border-t border-white/10 pt-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>(c) 2026 EverKeep. All rights reserved.</p>
        <p>Built for secure asset clarity.</p>
      </div>
    </footer>
  );
};

export default Footer;
