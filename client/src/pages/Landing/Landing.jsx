import Navbar from "../../components/landing/Navbar";
import Hero from "../../components/landing/Hero";
import Trusted from "../../components/landing/Trusted";
import Features from "../../components/landing/Features";
import HowItWorks from "../../components/landing/HowItWorks";
import AISection from "../../components/landing/AISection";
import Testimonials from "../../components/landing/Testimonials";
import Pricing from "../../components/landing/Pricing";
import FAQ from "../../components/landing/FAQ";
import CTA from "../../components/landing/CTA";
import Footer from "../../components/landing/Footer";

const Landing = () => {
  return (
    <main className="landing-page h-screen overflow-y-auto overflow-x-hidden bg-white text-slate-950">
      <Navbar />

      <Hero />
      <div>
        <Trusted />
        <Features />
        <HowItWorks />
        <AISection />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
        <Footer />
      </div>
    </main>
  );
};

export default Landing;
