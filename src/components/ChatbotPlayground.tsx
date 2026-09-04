import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, RefreshCw, Sliders, ChevronDown, Check, Zap, Cpu, Flame, HelpCircle } from 'lucide-react';
import { CHAT_PERSONAS } from '../data/agencyData';
import { ChatPersona, ChatMessage } from '../types';

interface ChatbotPlaygroundProps {
  onOrderModel: (modelTitle: string) => void;
}

export const ChatbotPlayground: React.FC<ChatbotPlaygroundProps> = ({ onOrderModel }) => {
  const [selectedPersona, setSelectedPersona] = useState<ChatPersona>(CHAT_PERSONAS[0]);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.5-flash');
  const [customSystemPrompt, setCustomSystemPrompt] = useState<string>('');
  const [isCustomPromptOpen, setIsCustomPromptOpen] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'model',
      content: CHAT_PERSONAS[0].initialMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // When switching persona, reset thread with that persona's initial greeting
  const handlePersonaChange = (persona: ChatPersona) => {
    setSelectedPersona(persona);
    setCustomSystemPrompt('');
    setMessages([
      {
        id: `init-${persona.id}-${Date.now()}`,
        role: 'model',
        content: persona.initialMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    setInputMessage('');
    setErrorMessage(null);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const activeSystemInstruction =
        customSystemPrompt.trim() !== '' ? customSystemPrompt.trim() : selectedPersona.systemInstruction;

      const payloadMessages = newHistory.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payloadMessages,
          systemInstruction: activeSystemInstruction,
          model: selectedModel,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${res.status}`);
      }

      const data = await res.json();
      const botReply: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: data.reply || 'No response generated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorMessage(err?.message || 'Failed to connect to AI server. Please try again.');
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'model',
          content: 'Sorry, I encountered an issue processing that request. Please verify connection and retry.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: `clear-${Date.now()}`,
        role: 'model',
        content: selectedPersona.initialMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div id="chatbot-playground-section" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Model Sandbox</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Test-Drive AI Chatbot Agency Models in Real-Time
        </h2>
        <p className="mt-3 text-slate-300 text-sm sm:text-base">
          Experience our multi-turn conversational intelligence. Switch roles, adjust the system instructions, or benchmark latency across Gemini 3-series models.
        </p>
      </div>

      {/* Main Playground Frame */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
        {/* Left Sidebar: Persona & Model Selection */}
        <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-slate-800 p-5 space-y-6 bg-slate-900/90">
          {/* Persona selector */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
              Select Chatbot Persona
            </label>
            <div className="space-y-2">
              {CHAT_PERSONAS.map((persona) => {
                const isSelected = selectedPersona.id === persona.id;
                return (
                  <button
                    key={persona.id}
                    id={`persona-btn-${persona.id}`}
                    onClick={() => handlePersonaChange(persona)}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-start space-x-3 ${
                      isSelected
                        ? 'bg-indigo-600/20 border border-indigo-500/50 text-white shadow-sm'
                        : 'bg-slate-800/40 border border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg ${persona.avatarBg} flex items-center justify-center shrink-0 mt-0.5 shadow-sm`}>
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">{persona.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{persona.roleTitle}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Model Engine Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                AI Engine
              </label>
              <span className="text-[10px] text-indigo-400 font-mono">Gemini 3 Series</span>
            </div>

            <div className="space-y-2 text-xs">
              <button
                id="model-fast-btn"
                onClick={() => setSelectedModel('gemini-3.1-flash-lite')}
                className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between ${
                  selectedModel === 'gemini-3.1-flash-lite'
                    ? 'border-cyan-500/60 bg-cyan-950/30 text-cyan-200'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <div>
                    <div className="font-semibold text-slate-200">gemini-3.1-flash-lite</div>
                    <div className="text-[10px] text-slate-400">Fast Tasks & Ultra-Low Latency</div>
                  </div>
                </div>
                {selectedModel === 'gemini-3.1-flash-lite' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
              </button>

              <button
                id="model-general-btn"
                onClick={() => setSelectedModel('gemini-3.5-flash')}
                className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between ${
                  selectedModel === 'gemini-3.5-flash'
                    ? 'border-indigo-500/60 bg-indigo-950/30 text-indigo-200'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                  <div>
                    <div className="font-semibold text-slate-200">gemini-3.5-flash</div>
                    <div className="text-[10px] text-slate-400">General Tasks (Default)</div>
                  </div>
                </div>
                {selectedModel === 'gemini-3.5-flash' && <Check className="w-3.5 h-3.5 text-indigo-400" />}
              </button>

              <button
                id="model-complex-btn"
                onClick={() => setSelectedModel('gemini-3.1-pro-preview')}
                className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between ${
                  selectedModel === 'gemini-3.1-pro-preview'
                    ? 'border-violet-500/60 bg-violet-950/30 text-violet-200'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Flame className="w-3.5 h-3.5 text-violet-400" />
                  <div>
                    <div className="font-semibold text-slate-200">gemini-3.1-pro-preview</div>
                    <div className="text-[10px] text-slate-400">Complex STEM, Code & Reasoning</div>
                  </div>
                </div>
                {selectedModel === 'gemini-3.1-pro-preview' && <Check className="w-3.5 h-3.5 text-violet-400" />}
              </button>
            </div>
          </div>

          {/* Custom System Instruction Drawer */}
          <div>
            <button
              id="custom-instruction-toggle-btn"
              onClick={() => setIsCustomPromptOpen(!isCustomPromptOpen)}
              className="w-full flex items-center justify-between py-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200"
            >
              <span className="flex items-center space-x-1.5">
                <Sliders className="w-3.5 h-3.5" />
                <span>Custom System Prompt</span>
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isCustomPromptOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCustomPromptOpen && (
              <div className="mt-2 pt-2 border-t border-slate-800 space-y-2">
                <textarea
                  id="custom-system-prompt-input"
                  rows={3}
                  value={customSystemPrompt}
                  onChange={(e) => setCustomSystemPrompt(e.target.value)}
                  placeholder={`Default: ${selectedPersona.systemInstruction.slice(0, 80)}...`}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none font-mono"
                />
                <p className="text-[10px] text-slate-500">
                  Override the role behavior to simulate your company's proprietary guidelines.
                </p>
              </div>
            )}
          </div>

          {/* Order this bot button */}
          <div className="pt-2">
            <button
              id="order-current-persona-btn"
              onClick={() => onOrderModel(selectedPersona.name)}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-indigo-600/20 flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Deploy This Bot</span>
            </button>
          </div>
        </div>

        {/* Right Chat Thread (3 Cols) */}
        <div className="lg:col-span-3 flex flex-col h-[620px] bg-slate-950/40">
          {/* Chat Header */}
          <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <div className="flex items-center space-x-3">
              <div className={`w-9 h-9 rounded-xl ${selectedPersona.avatarBg} flex items-center justify-center text-white font-bold shadow-sm`}>
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-white">{selectedPersona.name}</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Online • Multi-turn
                  </span>
                </div>
                <div className="text-xs text-slate-400">{selectedPersona.roleTitle}</div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                id="clear-chat-btn"
                onClick={clearChat}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Reset Conversation"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-900/30 overflow-x-auto flex items-center space-x-2 no-scrollbar">
            <span className="text-[11px] text-slate-400 whitespace-nowrap font-medium flex items-center space-x-1">
              <HelpCircle className="w-3 h-3 text-indigo-400" />
              <span>Try Asking:</span>
            </span>
            {selectedPersona.quickPrompts.map((prompt, i) => (
              <button
                key={i}
                id={`quick-prompt-${i}`}
                onClick={() => handleSendMessage(prompt)}
                className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-indigo-900/40 text-slate-300 hover:text-indigo-200 border border-slate-700/60 text-xs whitespace-nowrap transition-all shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Scrollable Messages Thread */}
          <div id="messages-scroll-thread" className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1 shadow-sm ${
                      isUser ? 'bg-indigo-600 text-white' : `${selectedPersona.avatarBg} text-white`
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className={`max-w-[80%] sm:max-w-[70%] space-y-1`}>
                    <div
                      className={`p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                        isUser
                          ? 'bg-indigo-600 text-white rounded-tr-sm shadow-md'
                          : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-tl-sm shadow-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <div
                      className={`text-[10px] text-slate-400 px-1 ${isUser ? 'text-right' : 'text-left'}`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-lg ${selectedPersona.avatarBg} text-white flex items-center justify-center shrink-0 mt-1`}>
                  <Bot className="w-4 h-4 animate-pulse" />
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700/80 rounded-tl-sm text-sm text-slate-300 flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-xs text-slate-400 ml-1">AI Chatbot Agency thinking...</span>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-xs text-rose-300">
                {errorMessage}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/60">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center space-x-2"
            >
              <input
                id="chat-user-input"
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Ask ${selectedPersona.name} anything...`}
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-60"
              />

              <button
                id="send-message-btn"
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-medium shadow-md shadow-indigo-600/20 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span>Multi-turn memory active</span>
              <span>Model: <span className="text-slate-300 font-mono">{selectedModel}</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
