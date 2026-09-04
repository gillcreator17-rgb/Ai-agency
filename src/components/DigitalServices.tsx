import React from 'react';
import { Globe, Bot, Sparkles, Layers, CheckCircle2, Clock, Code, ArrowRight } from 'lucide-react';
import { DIGITAL_SERVICES } from '../data/agencyData';
import { DigitalService } from '../types';

interface DigitalServicesProps {
  onRequestService: (service: DigitalService) => void;
}

export const DigitalServices: React.FC<DigitalServicesProps> = ({ onRequestService }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe':
        return <Globe className="w-6 h-6 text-indigo-400" />;
      case 'Bot':
        return <Bot className="w-6 h-6 text-cyan-400" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-violet-400" />;
      case 'Layers':
      default:
        return <Layers className="w-6 h-6 text-emerald-400" />;
    }
  };

  return (
    <div id="digital-services-section" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-950/80 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-3">
          <Globe className="w-3.5 h-3.5" />
          <span>Full-Spectrum Digital Studio</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Website Making & Digital Engineering
        </h2>
        <p className="mt-3 text-slate-300 text-sm sm:text-base">
          Beyond standalone AI models, AI Chatbot Agency designs, builds, and deploys high-converting web applications that seamlessly integrate your AI ecosystem into your business operations.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {DIGITAL_SERVICES.map((service) => (
          <div
            key={service.id}
            id={`service-card-${service.id}`}
            className="rounded-2xl bg-slate-900/60 border border-slate-800 p-7 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-xl backdrop-blur-sm"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
                  {getIcon(service.icon)}
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-slate-800 text-violet-300 border border-violet-500/20">
                  {service.badge}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                {service.title}
              </h3>
              <p className="text-xs text-indigo-400 font-medium mt-1">
                {service.tagline}
              </p>

              <p className="text-sm text-slate-300 mt-4 leading-relaxed">
                {service.description}
              </p>

              {/* Deliverables */}
              <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-2.5">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Scope & Deliverables
                </div>
                {service.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Tech Stack Chips */}
              <div className="mt-6">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                  <Code className="w-3.5 h-3.5" />
                  <span>Technologies</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {service.techStack.map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 rounded-md bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">Starting from</div>
                <div className="text-2xl font-extrabold text-white">
                  ${service.startingPrice.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  <span>Est. {service.turnaroundDays}</span>
                </div>
              </div>

              <button
                id={`request-service-btn-${service.id}`}
                onClick={() => onRequestService(service)}
                className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-indigo-600/20 transition-all flex items-center space-x-2"
              >
                <span>Request Project Scope</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
