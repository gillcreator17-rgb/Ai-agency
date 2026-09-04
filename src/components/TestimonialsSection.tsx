import React from 'react';
import { Star, ShieldCheck, Zap, Bot, CheckCircle } from 'lucide-react';
import { TESTIMONIALS } from '../data/agencyData';

export const TestimonialsSection: React.FC = () => {
  return (
    <div id="testimonials-section" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
          <Star className="w-3.5 h-3.5 fill-emerald-400" />
          <span>Proven Agency Track Record</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Trusted by Scaling AI Ventures & Global Brands
        </h2>
        <p className="mt-2 text-slate-400 text-sm">
          Hear how our pre-trained chatbot models and digital web engineering create immediate business impact.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between space-y-4 backdrop-blur-sm"
          >
            <div>
              <div className="flex items-center space-x-1 mb-3">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-300 italic leading-relaxed">
                "{t.quote}"
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <div className="text-xs font-bold text-white">{t.author}</div>
              <div className="text-[11px] text-slate-400">{t.role}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Enterprise Guarantees */}
      <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900/60 to-cyan-950/40 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
        <div className="flex items-center space-x-3 justify-center sm:justify-start">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">99.9% Uptime SLA</div>
            <div className="text-[11px] text-slate-400">Enterprise cloud hosting & monitoring</div>
          </div>
        </div>

        <div className="flex items-center space-x-3 justify-center sm:justify-start">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Zero Data Leakage</div>
            <div className="text-[11px] text-slate-400">Isolated fine-tuned models & RAG</div>
          </div>
        </div>

        <div className="flex items-center space-x-3 justify-center sm:justify-start">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Full IP Ownership</div>
            <div className="text-[11px] text-slate-400">You own 100% of the code & prompts</div>
          </div>
        </div>
      </div>
    </div>
  );
};
