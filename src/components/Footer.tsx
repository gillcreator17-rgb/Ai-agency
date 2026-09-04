import React from 'react';
import { Bot, Sparkles, Globe, Heart, Shield, Code } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onOpenInquiry: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenInquiry }) => {
  return (
    <footer className="bg-[#080b13] border-t border-slate-800/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-white font-mono">AI CHATBOT AGENCY</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Premier AI agency engineering proprietary AI chatbot models and high-conversion digital web experiences for modern ventures worldwide.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Available for Q2 & Q3 Projects</span>
            </div>
          </div>

          {/* Chatbot Models */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-200">
              AI Chatbot Models
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setActiveTab('models')} className="hover:text-white transition-colors">
                  OmniSupport Pro 2.5
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('models')} className="hover:text-white transition-colors">
                  LeadHunter Qualifier AI
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('models')} className="hover:text-white transition-colors">
                  CommerceGenie Shopping Bot
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('models')} className="hover:text-white transition-colors">
                  CodeCraft Technical Assistant
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('models')} className="hover:text-white transition-colors">
                  Enterprise Nexus RAG
                </button>
              </li>
            </ul>
          </div>

          {/* Digital Services */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Digital Services
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setActiveTab('services')} className="hover:text-white transition-colors">
                  Custom React & Tailwind Websites
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('services')} className="hover:text-white transition-colors">
                  Bespoke AI Model Development
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('studio')} className="hover:text-white transition-colors">
                  AI Asset & Avatar Studio
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('estimator')} className="hover:text-white transition-colors">
                  Instant AI Scope Estimator
                </button>
              </li>
            </ul>
          </div>

          {/* Start Project CTA */}
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Launch Your Initiative
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Have a custom AI chatbot or digital website project? Partner directly with our engineers.
            </p>
            <button
              id="footer-quote-btn"
              onClick={onOpenInquiry}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all"
            >
              Get in Touch
            </button>
          </div>
        </div>

        {/* Bottom credits */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} AI Chatbot Agency Inc. All rights reserved.
          </div>
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-1">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span>Enterprise Grade Security</span>
            </span>
            <span className="flex items-center space-x-1">
              <Code className="w-3.5 h-3.5 text-cyan-400" />
              <span>Gemini 3 Series & Firestore</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
