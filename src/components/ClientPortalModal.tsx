import React, { useState, useEffect } from 'react';
import { X, FolderHeart, FileText, Bot, ExternalLink, Trash2, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { subscribeToUserInquiries, subscribeToSavedModels, removeSavedModel } from '../firebase';
import { ServiceInquiry, SavedModel } from '../types';

interface ClientPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTestModel: (modelName: string) => void;
}

export const ClientPortalModal: React.FC<ClientPortalModalProps> = ({ isOpen, onClose, onTestModel }) => {
  const { user, signIn } = useAuth();
  const [activeTab, setActiveTab] = useState<'inquiries' | 'saved'>('inquiries');
  const [inquiries, setInquiries] = useState<ServiceInquiry[]>([]);
  const [savedModels, setSavedModels] = useState<SavedModel[]>([]);
  const [expandedProposalId, setExpandedProposalId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setInquiries([]);
      setSavedModels([]);
      return;
    }

    const unsubInquiries = subscribeToUserInquiries(user.uid, (data) => {
      setInquiries(data);
    });

    const unsubModels = subscribeToSavedModels(user.uid, (data) => {
      setSavedModels(data);
    });

    return () => {
      unsubInquiries();
      unsubModels();
    };
  }, [user]);

  if (!isOpen) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Completed</span>;
      case 'in_progress':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">In Progress</span>;
      case 'reviewing':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">Reviewing</span>;
      case 'submitted':
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">Submitted</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <FolderHeart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Client Portal & Saved Items</h3>
              <p className="text-xs text-slate-400">Live Firestore Persistence</p>
            </div>
          </div>

          <button
            id="close-portal-modal-btn"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="px-6 pt-3 border-b border-slate-800 flex space-x-6">
          <button
            id="portal-tab-inquiries"
            onClick={() => setActiveTab('inquiries')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors relative ${
              activeTab === 'inquiries' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>My Inquiries & Orders</span>
            <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300">
              {inquiries.length}
            </span>
            {activeTab === 'inquiries' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
            )}
          </button>

          <button
            id="portal-tab-saved"
            onClick={() => setActiveTab('saved')}
            className={`pb-3 text-xs font-bold uppercase tracking-wider transition-colors relative ${
              activeTab === 'saved' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Saved Bot Models</span>
            <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300">
              {savedModels.length}
            </span>
            {activeTab === 'saved' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
            )}
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {!user ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-950/60 border border-indigo-800/80 flex items-center justify-center text-indigo-400">
                <FolderHeart className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-white">Sign In to View Your Account</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Connect with Google to persist your project inquiries, track live quote proposals, and bookmark your favorite AI models with Firestore.
              </p>
              <button
                id="portal-signin-btn"
                onClick={() => signIn()}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-colors"
              >
                Sign In with Google
              </button>
            </div>
          ) : activeTab === 'inquiries' ? (
            inquiries.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <FileText className="w-10 h-10 text-slate-500 mx-auto" />
                <h4 className="text-sm font-semibold text-slate-300">No Inquiries Submitted Yet</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Use our AI Scope Estimator or click "Request Quote" to submit your project requirements to our engineering team.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-white">{inquiry.projectTitle}</h4>
                          {getStatusBadge(inquiry.status)}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {new Date(inquiry.createdAt).toLocaleDateString()} • Type: <span className="text-slate-300 capitalize">{inquiry.serviceType.replace('_', ' ')}</span>
                          {inquiry.budgetRange && ` • Budget: ${inquiry.budgetRange}`}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2">
                      {inquiry.description}
                    </p>

                    {inquiry.aiProposal && (
                      <div>
                        <button
                          onClick={() =>
                            setExpandedProposalId(
                              expandedProposalId === inquiry.id ? null : inquiry.id
                            )
                          }
                          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>
                            {expandedProposalId === inquiry.id
                              ? 'Hide AI Proposal'
                              : 'View AI Architecture Scope'}
                          </span>
                        </button>

                        {expandedProposalId === inquiry.id && (
                          <div className="mt-3 p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed">
                            {inquiry.aiProposal}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          ) : savedModels.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Bot className="w-10 h-10 text-slate-500 mx-auto" />
              <h4 className="text-sm font-semibold text-slate-300">No Saved Chatbot Models</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Explore the Chatbot Models catalog and click the heart icon on any model to bookmark it here for quick access.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {savedModels.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.modelName}</h4>
                      <div className="text-[11px] text-slate-400">
                        {item.category?.toUpperCase()} • {item.priceMonthly ? `$${item.priceMonthly}/mo` : 'Custom Pricing'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        onTestModel(item.modelName);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                    >
                      Test in Playground
                    </button>
                    <button
                      onClick={() => removeSavedModel(item.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                      title="Remove from favorites"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
