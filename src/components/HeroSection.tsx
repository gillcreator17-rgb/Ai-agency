import React from 'react';
import { Bot, Globe, Sparkles, ArrowRight, ShieldCheck, Zap, Code2, Layers } from 'lucide-react';
import { AGENCY_METRICS } from '../data/agencyData';

interface HeroSectionProps {
  onExploreModels: () => void;
  onExploreServices: () => void;
  onOpenPlayground: () => void;
  onOpenEstimator: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreModels,
  onExploreServices,
  onOpenPlayground,
  onOpenEstimator,
}) => {
  return (
    <div id="hero-section" className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-800/80">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/15 via-violet-600/10 to-cyan-500/10 blur-[120px] pointer-events-none -z-10 rounded-full" />
      <div className="absolute -top-10 right-10 w-72 h-72 bg-indigo-500/5 blur-[90px] pointer-events-none -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Agency Tag Pill */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Next-Gen AI Agency & Digital Studio</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">Models Ready for Deployment</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
            We Build Intelligent <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-cyan-300">
              AI Chatbot Models
            </span>{' '}
            & Bespoke Websites
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            AI Chatbot Agency architects turn-key AI agents that resolve customer queries, capture enterprise leads, and drive revenue — paired with blazing-fast, custom-engineered digital web platforms.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              id="hero-explore-models-btn"
              onClick={onExploreModels}
              className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition-all flex items-center space-x-2 group"
            >
              <Bot className="w-4 h-4" />
              <span>Browse Chatbot Models</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="hero-test-drive-btn"
              onClick={onOpenPlayground}
              className="px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700 font-semibold text-sm transition-all flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Test-Drive Live Bots</span>
            </button>

            <button
              id="hero-estimate-project-btn"
              onClick={onOpenEstimator}
              className="px-5 py-3.5 rounded-xl bg-transparent hover:bg-slate-800/40 text-slate-300 hover:text-white font-medium text-sm transition-colors flex items-center space-x-2 border border-slate-800"
            >
              <Globe className="w-4 h-4 text-violet-400" />
              <span>AI Scope Estimator</span>
            </button>
          </div>

          {/* Value Badges */}
          <div className="mt-10 pt-8 border-t border-slate-800/60 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
            <div className="flex items-center space-x-2.5 text-xs text-slate-300">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Zap className="w-4 h-4" />
              </div>
              <span>Sub-400ms Latency</span>
            </div>
            <div className="flex items-center space-x-2.5 text-xs text-slate-300">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span>SOC2 & Zero-Hallucination</span>
            </div>
            <div className="flex items-center space-x-2.5 text-xs text-slate-300">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                <Code2 className="w-4 h-4" />
              </div>
              <span>Full-Stack React 19 & APIs</span>
            </div>
            <div className="flex items-center space-x-2.5 text-xs text-slate-300">
              <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400">
                <Layers className="w-4 h-4" />
              </div>
              <span>Omnichannel Integration</span>
            </div>
          </div>
        </div>

        {/* Agency Metrics Banner */}
        <div className="mt-14 max-w-5xl mx-auto rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-slate-800 p-6 backdrop-blur-sm shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {AGENCY_METRICS.map((metric, i) => (
              <div key={i} className="space-y-1">
                <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                  {metric.value}
                </div>
                <div className="text-xs text-slate-400 font-medium tracking-wide">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
