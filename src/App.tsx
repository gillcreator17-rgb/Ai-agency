import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ModelsCatalog } from './components/ModelsCatalog';
import { DigitalServices } from './components/DigitalServices';
import { ChatbotPlayground } from './components/ChatbotPlayground';
import { ProjectEstimator } from './components/ProjectEstimator';
import { AIAssetStudio } from './components/AIAssetStudio';
import { TestimonialsSection } from './components/TestimonialsSection';
import { Footer } from './components/Footer';
import { ClientPortalModal } from './components/ClientPortalModal';
import { InquiryModal } from './components/InquiryModal';
import { useAuth } from './context/AuthContext';
import { subscribeToSavedModels } from './firebase';
import { ChatbotModel, DigitalService } from './types';
import { Bot, Globe, Sparkles, Wand2, Calculator } from 'lucide-react';

export default function App() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('models');

  // Modals state
  const [isPortalOpen, setIsPortalOpen] = useState<boolean>(false);
  const [isInquiryOpen, setIsInquiryOpen] = useState<boolean>(false);
  const [inquiryPrefillService, setInquiryPrefillService] = useState<string>('full_solution');
  const [inquiryPrefillTitle, setInquiryPrefillTitle] = useState<string>('');

  // Real-time saved models tracking from Firestore
  const [savedModelIds, setSavedModelIds] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      setSavedModelIds([]);
      return;
    }

    const unsubscribe = subscribeToSavedModels(user.uid, (models) => {
      setSavedModelIds(models.map((m) => m.modelId));
    });

    return () => unsubscribe();
  }, [user]);

  // Handlers for interactions across components
  const handleSelectForPlayground = (model: ChatbotModel) => {
    setActiveTab('playground');
    // scroll smoothly to playground
    const el = document.getElementById('chatbot-playground-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOrderModel = (model: ChatbotModel) => {
    setInquiryPrefillService('chatbot_model');
    setInquiryPrefillTitle(`Deployment: ${model.name}`);
    setIsInquiryOpen(true);
  };

  const handleOrderPersona = (personaName: string) => {
    setInquiryPrefillService('chatbot_model');
    setInquiryPrefillTitle(`Custom Deployment: ${personaName}`);
    setIsInquiryOpen(true);
  };

  const handleRequestService = (service: DigitalService) => {
    setInquiryPrefillService(
      service.id === 'bespoke-web-dev' ? 'custom_website' : 'full_solution'
    );
    setInquiryPrefillTitle(`Project Scope: ${service.title}`);
    setIsInquiryOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPortal={() => setIsPortalOpen(true)}
        onOpenInquiry={() => {
          setInquiryPrefillService('full_solution');
          setInquiryPrefillTitle('AI Chatbot Agency Digital Consultation');
          setIsInquiryOpen(true);
        }}
        savedModelsCount={savedModelIds.length}
      />

      {/* Hero Section */}
      <HeroSection
        onExploreModels={() => setActiveTab('models')}
        onExploreServices={() => setActiveTab('services')}
        onOpenPlayground={() => setActiveTab('playground')}
        onOpenEstimator={() => setActiveTab('estimator')}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Section Navigation Tabs Banner */}
        <div className="border-b border-slate-800/80 bg-[#0e1322]/50 sticky top-18 z-30 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-1 sm:space-x-4 overflow-x-auto py-2.5 no-scrollbar">
              <button
                id="tab-btn-models"
                onClick={() => setActiveTab('models')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-2 ${
                  activeTab === 'models'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Chatbot Models Catalog</span>
              </button>

              <button
                id="tab-btn-services"
                onClick={() => setActiveTab('services')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-2 ${
                  activeTab === 'services'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Websites & Digital Services</span>
              </button>

              <button
                id="tab-btn-playground"
                onClick={() => setActiveTab('playground')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-2 ${
                  activeTab === 'playground'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Live AI Playground</span>
              </button>

              <button
                id="tab-btn-estimator"
                onClick={() => setActiveTab('estimator')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-2 ${
                  activeTab === 'estimator'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Calculator className="w-3.5 h-3.5 text-violet-400" />
                <span>AI Scope Estimator</span>
              </button>

              <button
                id="tab-btn-studio"
                onClick={() => setActiveTab('studio')}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-2 ${
                  activeTab === 'studio'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>AI Asset & Avatar Studio</span>
              </button>
            </div>
          </div>
        </div>

        {/* View Switcher based on Active Tab */}
        {activeTab === 'models' && (
          <ModelsCatalog
            onSelectForPlayground={handleSelectForPlayground}
            onOrderModel={handleOrderModel}
            savedModelIds={savedModelIds}
            onRefreshSaved={() => {}}
          />
        )}

        {activeTab === 'services' && (
          <DigitalServices onRequestService={handleRequestService} />
        )}

        {activeTab === 'playground' && (
          <ChatbotPlayground onOrderModel={handleOrderPersona} />
        )}

        {activeTab === 'estimator' && (
          <ProjectEstimator
            onInquirySubmitted={() => {
              setIsPortalOpen(true);
            }}
          />
        )}

        {activeTab === 'studio' && <AIAssetStudio />}

        {/* Social Proof and Agency Trust */}
        <TestimonialsSection />
      </main>

      {/* Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenInquiry={() => {
          setInquiryPrefillService('full_solution');
          setInquiryPrefillTitle('General Digital Inquiry');
          setIsInquiryOpen(true);
        }}
      />

      {/* Client Portal & Bookmarked Models Modal */}
      <ClientPortalModal
        isOpen={isPortalOpen}
        onClose={() => setIsPortalOpen(false)}
        onTestModel={(modelName) => {
          setActiveTab('playground');
        }}
      />

      {/* Inquiry & Quote Modal */}
      <InquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        prefillService={inquiryPrefillService}
        prefillTitle={inquiryPrefillTitle}
        onSuccess={() => {
          setIsPortalOpen(true);
        }}
      />
    </div>
  );
}
