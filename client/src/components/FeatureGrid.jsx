import React from 'react';
import { motion } from 'framer-motion';
import { Video, Home, MessageSquare, Zap, Heart, ShieldCheck } from 'lucide-react';

const features = [
  {
    title: "Virtual Consultation",
    desc: "HD video calls with end-to-end encryption for private health discussions.",
    icon: Video,
    color: "bg-blue-500",
    size: "col-span-1 md:col-span-2",
  },
  {
    title: "Home Visits",
    desc: "Licensed doctors at your door within 30 minutes.",
    icon: Home,
    color: "bg-emerald-500",
    size: "col-span-1",
  },
  {
    title: "AI Symptom Checker",
    desc: "Quick preliminary diagnosis using advanced AI models.",
    icon: Zap,
    color: "bg-amber-500",
    size: "col-span-1",
  },
  {
    title: "24/7 Chat Support",
    desc: "Instant access to medical advisors anytime.",
    icon: MessageSquare,
    color: "bg-purple-500",
    size: "col-span-1 md:col-span-2",
  }
];

const FeatureGrid = () => {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold mb-4 text-slate-900">
            Features that set us <span className="text-primary-600">Apart</span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            We've combined advanced technology with compassionate care to create 
            the most seamless healthcare experience ever.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
              className={`${f.size} card-premium flex flex-col justify-between min-h-[250px] group`}
            >
              <div className="flex items-start justify-between">
                <div className={`p-4 ${f.color} rounded-2xl text-white shadow-lg shadow-inherit/20`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <div className="text-slate-200 group-hover:text-primary-200 transition-colors">
                   <ShieldCheck className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">{f.title}</h3>
                <p className="text-slate-500">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
