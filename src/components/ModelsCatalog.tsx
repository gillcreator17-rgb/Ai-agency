import React, { useState } from 'react';
import { Bot, Heart, Check, Sparkles, Zap, ArrowRight, Layers, MessageSquare, Search, SlidersHorizontal } from 'lucide-react';
import { CHATBOT_MODELS } from '../data/agencyData';
import { ChatbotModel } from '../types';
import { useAuth } from '../context/AuthContext';
import { toggleSaveModel, removeSavedModel } from '../firebase';

interface ModelsCatalogProps {
  onSelectForPlayground: (model: ChatbotModel) => void;
  onOrderModel: (model: ChatbotModel) => void;
  savedModelIds: string[];
  onRefreshSaved: () => void;
}

export const ModelsCatalog: React.FC<ModelsCatalogProps> = ({
  onSelectForPlayground,
  onOrderModel,
  savedModelIds,
  onRefreshSaved,
}) => {
  const { user, signIn } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [savingId, setSavingId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Bot Models' },
    { id: 'support', label: 'Customer Care & Triage' },
    { id: 'sales', label: 'Sales & Lead Gen' },
    { id: 'ecommerce', label: 'E-Commerce Growth' },
    { id: 'technical', label: 'Developer & Code' },
    { id: 'enterprise', label: 'Enterprise RAG' },
  ];

  const filteredModels = CHATBOT_MODELS.filter((model) => {
    const matchesCategory = selectedCategory === 'all' || model.category === selectedCategory;
    const matchesSearch =
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleToggleFavorite = async (model: ChatbotModel) => {
    if (!user) {
      await signIn();
      return;
    }

    setSavingId(model.id);
    const isSaved = savedModelIds.includes(model.id);

    try {
      if (isSaved) {
        await removeSavedModel(model.id);
      } else {
        await toggleSaveModel({
          id: model.id,
          name: model.name,
          category: model.category,
          price: model.pricingMonthly,
        });
      }
      onRefreshSaved();
    } catch (err) {
      console.error('Failed to toggle model bookmark:', err);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div id="models-catalog-section" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            <Bot className="w-3.5 h-3.5" />
            <span>Turn-Key & Custom Bot Models</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            AI Chatbot Models for Sale
          </h2>
          <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-2xl">
            Deploy proprietary, fine-tuned chatbot models tailored to your industry. Each model comes with guaranteed sub-400ms latency, custom system guardrails, and full API integration.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bot capabilities..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            id={`category-filter-${cat.id}`}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Models Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModels.map((model) => {
          const isSaved = savedModelIds.includes(model.id);

          return (
            <div
              key={model.id}
              id={`model-card-${model.id}`}
              className="rounded-2xl bg-slate-900/60 border border-slate-800/90 hover:border-slate-700 transition-all duration-200 p-6 flex flex-col justify-between group shadow-xl backdrop-blur-sm relative"
            >
              {/* Card Top */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide uppercase bg-slate-800 text-indigo-300 border border-indigo-500/20">
                    {model.category}
                  </span>

                  <button
                    id={`bookmark-model-${model.id}`}
                    onClick={() => handleToggleFavorite(model)}
                    disabled={savingId === model.id}
                    className={`p-2 rounded-lg border transition-colors ${
                      isSaved
                        ? 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
                    }`}
                    title={isSaved ? 'Saved to Favorites (Firestore)' : 'Save to Favorites'}
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-400' : ''}`} />
                  </button>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {model.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {model.tagline}
                </p>

                <p className="text-sm text-slate-300 mt-4 leading-relaxed">
                  {model.description}
                </p>

                {/* Tech Specs */}
                <div className="mt-5 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center space-x-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Base Engine</span>
                    </span>
                    <span className="text-slate-200 font-mono text-[11px] font-medium">
                      {model.baseModel}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center space-x-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Avg. Latency</span>
                    </span>
                    <span className="text-slate-200 font-mono text-[11px] font-medium">
                      ~{model.latencyMs}ms
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center space-x-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Channels</span>
                    </span>
                    <span className="text-slate-300 text-[11px] truncate max-w-[150px]">
                      {model.supportedChannels.slice(0, 2).join(', ')}...
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <div className="mt-5 space-y-2">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Model Capabilities
                  </div>
                  {model.features.slice(0, 4).map((feature, i) => (
                    <div key={i} className="flex items-start space-x-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-8 pt-5 border-t border-slate-800">
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <span className="text-2xl font-extrabold text-white">${model.pricingMonthly}</span>
                    <span className="text-xs text-slate-400"> / month</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    +${model.setupFee} setup fee
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    id={`test-model-${model.id}`}
                    onClick={() => onSelectForPlayground(model)}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center space-x-1.5 border border-slate-700"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Test Bot</span>
                  </button>

                  <button
                    id={`order-model-${model.id}`}
                    onClick={() => onOrderModel(model)}
                    className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center space-x-1.5"
                  >
                    <span>Deploy</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
