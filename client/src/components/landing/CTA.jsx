import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import ViewReveal from "./common/Motion";

const CTA = () => {
  return (
    <section className="overflow-hidden bg-white px-6 pb-24 sm:px-8 lg:px-10 lg:pb-28">
      <ViewReveal className="mx-auto flex min-h-[360px] max-w-7xl flex-col items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-600 to-violet-600 px-6 py-20 text-center text-white shadow-[0_30px_120px_rgba(37,99,235,0.3)] sm:px-10 lg:min-h-[420px] lg:px-12 lg:py-24">
        <div className="mx-auto mb-7 flex h-14 w-14 items-center justify-center rounded-3xl bg-white/15 backdrop-blur">
          <Sparkles size={26} />
        </div>
        <h2 className="mx-auto max-w-3xl text-balance text-4xl font-black tracking-tight sm:text-5xl">
          Build your personal asset operating system today.
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-50">
          Bring assets, documents, renewals, insurance, subscriptions and family sharing into one intelligent place.
        </p>
        <div className="mt-9 flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row">
          <a
            href="/register"
            className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-white px-7 text-base font-black text-blue-600 shadow-xl transition hover:-translate-y-1"
          >
            Get Started Free
            <ArrowRight size={19} />
          </a>
          <div className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl border border-white/20 px-7 text-base font-bold text-white">
            <ShieldCheck size={18} />
            Secure by default
          </div>
        </div>
      </ViewReveal>
    </section>
  );
};

export default CTA;
