import { motion } from "framer-motion";
import SectionHeader from "./common/SectionHeader";
import { fadeUp, staggerContainer } from "./common/animation";

const testimonials = [
  {
    name: "Maya Chen",
    company: "Founder, Northstar Labs",
    avatar: "MC",
    review: "EverKeep replaced a messy mix of folders, spreadsheets and calendar alerts. Our household records finally feel trustworthy.",
  },
  {
    name: "Arjun Mehta",
    company: "Product Lead, Finora",
    avatar: "AM",
    review: "The AI insights are the difference. It does not just store documents; it tells me what is missing before it becomes expensive.",
  },
  {
    name: "Sophia Reyes",
    company: "Operations, Cloudline",
    avatar: "SR",
    review: "It has the polish of a work app and the usefulness of a family system. Insurance, warranties and renewals are no longer scattered.",
  },
];

const Testimonials = () => {
  return (
    <section className="overflow-hidden bg-white px-6 py-24 sm:px-8 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Loved by early users" title="Premium clarity for real-life complexity." />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
          className="mt-16 grid items-stretch gap-8 md:grid-cols-3"
        >
          {testimonials.map((testimonial) => (
            <motion.article
              key={testimonial.name}
              variants={fadeUp}
              whileHover={{ y: -7 }}
              className="flex h-full min-w-0 flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_18px_60px_rgba(15,23,42,0.07)]"
            >
              <p className="break-words text-lg leading-8 text-slate-700">"{testimonial.review}"</p>
              <div className="mt-auto flex items-center gap-4 pt-8">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-sm font-black text-white">
                  {testimonial.avatar}
                </div>
                <div className="min-w-0">
                  <p className="font-black text-slate-950">{testimonial.name}</p>
                  <p className="mt-1 text-sm font-medium text-slate-500">{testimonial.company}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
