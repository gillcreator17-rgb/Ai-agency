import React, { useState } from 'react';
import { X, Send, Sparkles, CheckCircle2, Loader2, Bot, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { saveServiceInquiry } from '../firebase';
import { ServiceInquiry } from '../types';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillService?: string;
  prefillTitle?: string;
  onSuccess: () => void;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  isOpen,
  onClose,
  prefillService = 'full_solution',
  prefillTitle = '',
  onSuccess,
}) => {
  const { user, signIn } = useAuth();

  const [serviceType, setServiceType] = useState<string>(prefillService);
  const [projectTitle, setProjectTitle] = useState<string>(prefillTitle);
  const [description, setDescription] = useState<string>('');
  const [budgetRange, setBudgetRange] = useState<string>('$3,000 - $6,000');
  const [timeline, setTimeline] = useState<string>('3 - 5 Weeks');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorMsg('Please describe your project requirements.');
      return;
    }

    let currentUser = user;
    if (!currentUser) {
      try {
        await signIn();
        // user will update, or user will need to re-click
        return;
      } catch (err: any) {
        setErrorMsg('Please sign in to submit your inquiry.');
        return;
      }
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const newInquiry: ServiceInquiry = {
        id: `inquiry-${Date.now()}`,
        userId: currentUser.uid,
        serviceType: serviceType as any,
        projectTitle: projectTitle.trim() || 'Custom AI Chatbot Project',
        description: description.trim(),
        budgetRange,
        timeline,
        status: 'submitted',
        createdAt: new Date().toISOString(),
      };

      await saveServiceInquiry(newInquiry);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setIsSuccess(false);
      }, 1500);
    } catch (err: any) {
      console.error('Failed to submit inquiry:', err);
      setErrorMsg(err?.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Start Your Project with AI Chatbot Agency</h3>
              <p className="text-xs text-slate-400">Direct Engineering Team Consultation</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white">Inquiry Successfully Submitted!</h4>
            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              Your project request has been logged in Firestore. Our lead AI architect will review your technical requirements.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Requested Solution
              </label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="chatbot_model">Pre-trained or Fine-Tuned Chatbot Model</option>
                <option value="custom_website">Custom Digital Website / Web Application</option>
                <option value="full_solution">Full Solution: Custom Website + AI Chatbots</option>
                <option value="ai_consultation">AI Architecture & Consulting</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Project Name or Subject
              </label>
              <input
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="e.g. Deploy OmniSupport Pro for our Shopify brand"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Scope & Requirements *
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us about your traffic, expected features, target integrations, or current challenges..."
                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Budget Target
                </label>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="$1,000 - $3,000">$1,000 - $3,000</option>
                  <option value="$3,000 - $6,000">$3,000 - $6,000</option>
                  <option value="$6,000 - $12,000">$6,000 - $12,000</option>
                  <option value="$12,000+">$12,000+</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Desired Timeline
                </label>
                <select
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="1 - 2 Weeks">1 - 2 Weeks</option>
                  <option value="3 - 5 Weeks">3 - 5 Weeks</option>
                  <option value="6 - 8 Weeks">6 - 8 Weeks</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800 text-xs text-rose-300">
                {errorMsg}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/25 flex items-center justify-center space-x-2 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Inquiry to Firestore...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{user ? 'Submit Project Inquiry' : 'Sign In & Submit'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
