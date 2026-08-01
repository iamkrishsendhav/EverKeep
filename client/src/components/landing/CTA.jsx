import { ArrowRight, ShieldCheck, Sparkles, Users } from "lucide-react";
import ViewReveal from "./common/Motion";

const CTA = () => {
  return (
    <section className="overflow-hidden bg-white pb-20 sm:pb-24 lg:pb-28">
      <div className="landing-container">
        <ViewReveal className="landing-panel relative flex min-h-[380px] flex-col items-center justify-center overflow-hidden bg-primary-600 px-6 py-20 text-center text-white sm:px-10 lg:min-h-[420px] lg:px-12 lg:py-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.10),transparent_35%)]" />

          <div className="relative mx-auto mb-7 flex h-14 w-14 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
            <Sparkles size={26} />
          </div>

          <h2 className="relative mx-auto max-w-3xl text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Build your personal asset operating system today.
          </h2>

          <p className="relative mx-auto mt-5 max-w-2xl text-lg leading-8 text-primary-50">
            Bring assets, documents, renewals, insurance, subscriptions and family sharing into one intelligent place.
          </p>

          <div className="relative mt-9 flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row">
            <a
              href="/register"
              className="landing-button landing-button-inverse h-14 px-7 text-base"
            >
              Get Started Free
              <ArrowRight size={19} />
            </a>

            <div className="inline-flex h-14 items-center justify-center gap-3 rounded-xl border border-white/20 px-7 text-base font-bold text-white">
              <ShieldCheck size={18} />
              Secure by default
            </div>
          </div>

          <div className="relative mt-8 flex items-center gap-2 text-sm font-medium text-primary-50">
            <Users size={16} />
            Trusted by 25,000+ people managing what matters
          </div>
        </ViewReveal>
      </div>
    </section>
  );
};

export default CTA;
