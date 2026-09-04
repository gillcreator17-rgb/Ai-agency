import React, { useState } from 'react';
import { Sparkles, Calculator, CheckCircle, ArrowRight, Loader2, FileText, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { saveServiceInquiry } from '../firebase';
import { ServiceInquiry } from '../types';

interface ProjectEstimatorProps {
  onInquirySubmitted: () => void;
}

export const ProjectEstimator: React.FC<ProjectEstimatorProps> = ({ onInquirySubmitted }) => {
  const { user, signIn } = useAuth();

  const [serviceType, setServiceType] = useState<string>('full_solution');
  const [projectTitle, setProjectTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [budgetRange, setBudgetRange] = useState<string>('$3,000 - $6,000');
  const [timeline, setTimeline] = useState<string>('3 - 5 Weeks');

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedProposal, setGeneratedProposal] = useState<string | null>(null);
  const [isSubmittingToDb, setIsSubmittingToDb] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerateProposal = async () => {
    if (!description.trim()) {
      setErrorMsg('Please describe your project requirements so our AI can architect a solution.');
      return;
    }

    setErrorMsg(null);
    setIsGenerating(true);
    setSubmitSuccess(false);

    try {
      const res = await fetch('/api/generate-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectTitle: projectTitle || 'AI Chatbot Agency Digital Transformation',
          serviceType,
          description,
          budgetRange,
          timeline,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to generate scope: ${res.statusText}`);
      }

      const data = await res.json();
      setGeneratedProposal(data.proposal || 'No proposal generated.');
    } catch (err: any) {
      console.error('Proposal error:', err);
      setErrorMsg(err?.message || 'Error generating AI proposal.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToFirestore = async () => {
    if (!user) {
      await signIn();
      return;
    }

    setIsSubmittingToDb(true);
    setErrorMsg(null);

    try {
      const inquiryRecord: ServiceInquiry = {
        id: `inquiry-${Date.now()}`,
        userId: user.uid,
        serviceType: serviceType as any,
        projectTitle: projectTitle || 'AI Chatbot & Digital Project',
        description,
        budgetRange,
        timeline,
        status: 'submitted',
        aiProposal: generatedProposal || undefined,
        createdAt: new Date().toISOString(),
      };

      await saveServiceInquiry(inquiryRecord);
      setSubmitSuccess(true);
      onInquirySubmitted();
    } catch (err: any) {
      console.error('Save inquiry error:', err);
      setErrorMsg(err?.message || 'Failed to submit inquiry to database.');
    } finally {
      setIsSubmittingToDb(false);
    }
  };

  return (
    <div id="project-estimator-section" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
          <Calculator className="w-3.5 h-3.5" />
          <span>Gemini Intelligence Engine</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          AI Project Scope & Architecture Estimator
        </h2>
        <p className="mt-3 text-slate-300 text-sm sm:text-base">
          Input your business vision. Our Gemini intelligence analyzes your technical needs, architects the recommended chatbot models and web stack, and formulates a full delivery proposal in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Inputs (5 Cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900/70 border border-slate-800 p-6 sm:p-7 backdrop-blur-sm space-y-5 shadow-xl">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Configure Project Scope</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Service Type
            </label>
            <select
              id="estimator-service-select"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="full_solution">Full Ecosystem: Custom Website + AI Chatbots</option>
              <option value="custom_website">High-Performance Website / Web Application</option>
              <option value="chatbot_model">Turn-Key or Bespoke AI Chatbot Model</option>
              <option value="ai_consultation">AI Architecture & RAG Pipeline Consulting</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Project / Company Name
            </label>
            <input
              id="estimator-title-input"
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="e.g. Acme Health Patient Concierge & Portal"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Business Objectives & Requirements *
            </label>
            <textarea
              id="estimator-description-input"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail your goals: e.g. We need an intelligent chatbot for our e-commerce site to handle returns and recommend running shoes, plus a sleek redesigned landing page that loads under 1 second."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Target Budget
              </label>
              <select
                id="estimator-budget-select"
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="$1,000 - $3,000">$1,000 - $3,000 (Starter)</option>
                <option value="$3,000 - $6,000">$3,000 - $6,000 (Growth)</option>
                <option value="$6,000 - $12,000">$6,000 - $12,000 (Enterprise)</option>
                <option value="$12,000+">$12,000+ (Custom Suite)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Launch Timeline
              </label>
              <select
                id="estimator-timeline-select"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="1 - 2 Weeks">1 - 2 Weeks (Sprint)</option>
                <option value="3 - 5 Weeks">3 - 5 Weeks (Standard)</option>
                <option value="6 - 8 Weeks">6 - 8 Weeks (Comprehensive)</option>
                <option value="Flexible">Flexible / Ongoing</option>
              </select>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300">
              {errorMsg}
            </div>
          )}

          <button
            id="generate-proposal-btn"
            onClick={handleGenerateProposal}
            disabled={isGenerating}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-60 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/25 flex items-center justify-center space-x-2 transition-all"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Architecting Scope with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate AI Proposal & Scope</span>
              </>
            )}
          </button>
        </div>

        {/* Generated Proposal / Architecture View (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-900/70 border border-slate-800 p-6 sm:p-7 backdrop-blur-sm shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-bold text-white uppercase tracking-wide">
                  AI Chatbot Agency Architecture Proposal
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800">
                Gemini 3.8 Flash
              </span>
            </div>

            {isGenerating ? (
              <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                <p className="text-sm text-slate-300 font-medium">
                  Analyzing system constraints & synthesizing architecture...
                </p>
                <p className="text-xs text-slate-500">
                  Estimating milestones, bot latency requirements, and web tech stack
                </p>
              </div>
            ) : generatedProposal ? (
              <div className="prose prose-invert prose-xs sm:prose-sm max-w-none max-h-[440px] overflow-y-auto pr-2 text-slate-200 whitespace-pre-wrap leading-relaxed font-sans">
                {generatedProposal}
              </div>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-400 border border-slate-700">
                  <Calculator className="w-6 h-6 text-indigo-400" />
                </div>
                <h4 className="text-base font-semibold text-white">No Scope Generated Yet</h4>
                <p className="text-xs text-slate-400 max-w-sm">
                  Fill in your project requirements on the left and click "Generate AI Proposal" to receive an immediate technical breakdown.
                </p>
              </div>
            )}
          </div>

          {/* Action to Save to Firestore */}
          {generatedProposal && (
            <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-xs text-slate-400">
                  Ready to move forward with this architecture?
                </span>
              </div>

              {submitSuccess ? (
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold bg-emerald-950/40 px-3 py-2 rounded-xl border border-emerald-800">
                  <CheckCircle className="w-4 h-4" />
                  <span>Inquiry saved to your Agency Portal!</span>
                </div>
              ) : (
                <button
                  id="submit-proposal-to-db-btn"
                  onClick={handleSaveToFirestore}
                  disabled={isSubmittingToDb}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2"
                >
                  {isSubmittingToDb ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving to Firestore...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>{user ? 'Submit Inquiry to Agency' : 'Sign In & Submit Inquiry'}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
