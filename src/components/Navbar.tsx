import React, { useState } from 'react';
import { Bot, Sparkles, User as UserIcon, LogOut, FolderHeart, FileText, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenPortal: () => void;
  onOpenInquiry: () => void;
  savedModelsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenPortal,
  onOpenInquiry,
  savedModelsCount,
}) => {
  const { user, signIn, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'models', label: 'Chatbot Models' },
    { id: 'services', label: 'Website & Digital Services' },
    { id: 'playground', label: 'Live AI Playground' },
    { id: 'estimator', label: 'AI Project Estimator' },
    { id: 'studio', label: 'AI Asset Studio' },
  ];

  return (
    <nav id="agency-navbar" className="sticky top-0 z-40 bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <div
            id="brand-logo-btn"
            onClick={() => setActiveTab('models')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-lg sm:text-xl tracking-tight text-white font-mono">AI CHATBOT</span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded">
                  Agency
                </span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-wide">Custom AI Models & Web Engineering</p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                id={`nav-link-${link.id}`}
                onClick={() => setActiveTab(link.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === link.id
                    ? 'text-white bg-slate-800/80 border border-slate-700 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right Action Area */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Saved Models / Portal Trigger */}
            <button
              id="open-portal-btn"
              onClick={onOpenPortal}
              className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-700"
              title="Saved Models & Inquiries"
            >
              <FolderHeart className="w-5 h-5" />
              {savedModelsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {savedModelsCount}
                </span>
              )}
            </button>

            {/* Request Quote / Order */}
            <button
              id="get-started-nav-btn"
              onClick={onOpenInquiry}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all duration-150 flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Request Quote</span>
            </button>

            {/* Auth Area */}
            {user ? (
              <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-800">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-8 h-8 rounded-full border border-slate-700 ring-2 ring-indigo-500/20"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-700 text-white flex items-center justify-center text-xs font-bold">
                    {user.displayName?.charAt(0) || 'C'}
                  </div>
                )}
                <button
                  id="signout-btn"
                  onClick={() => signOut()}
                  className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="google-signin-btn"
                onClick={() => signIn()}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors flex items-center space-x-1.5"
              >
                <UserIcon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Client Login</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex sm:hidden items-center space-x-2">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-nav-drawer" className="sm:hidden bg-[#0e1322] border-b border-slate-800 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium ${
                activeTab === link.id
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3 border-t border-slate-800 flex flex-col space-y-2">
            <button
              onClick={() => {
                onOpenPortal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/80 text-sm text-slate-200"
            >
              <span className="flex items-center space-x-2">
                <FolderHeart className="w-4 h-4 text-rose-400" />
                <span>My Saved Models & Inquiries</span>
              </span>
              {savedModelsCount > 0 && (
                <span className="px-2 py-0.5 bg-rose-500 text-white text-xs font-bold rounded-full">
                  {savedModelsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                onOpenInquiry();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-lg bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider text-center"
            >
              Request Agency Quote
            </button>

            {user ? (
              <div className="flex items-center justify-between px-3 py-2 text-sm text-slate-300">
                <span>Signed in as {user.displayName || user.email}</span>
                <button onClick={() => signOut()} className="text-rose-400 hover:underline">
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="w-full py-2 rounded-lg bg-slate-800 text-slate-200 text-sm font-medium flex items-center justify-center space-x-2"
              >
                <UserIcon className="w-4 h-4 text-indigo-400" />
                <span>Sign in with Google</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
