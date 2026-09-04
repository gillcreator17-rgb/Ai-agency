import React, { useState, useRef } from 'react';
import { Sparkles, Image as ImageIcon, Wand2, Download, Upload, Loader2, ArrowRight, RefreshCw, Layers } from 'lucide-react';

export const AIAssetStudio: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'create' | 'edit'>('create');

  // Create Mode state
  const [createPrompt, setCreatePrompt] = useState<string>(
    'A high-end 3D glossy metallic humanoid chatbot avatar with glowing cyan optic visor, cinematic dark studio lighting, 8k render'
  );
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [createdImageUrl, setCreatedImageUrl] = useState<string | null>(null);

  // Edit Mode state
  const [editPrompt, setEditPrompt] = useState<string>('Add glowing violet circuitry patterns along the sides and cinematic lens flare');
  const [sourceImageBase64, setSourceImageBase64] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleCreatePrompts = [
    'Sleek 3D cyberpunk customer service robot avatar with gentle friendly expression, matte dark obsidian with neon indigo lights',
    'Modern futuristic website hero banner for an AI development agency, abstract floating neural network crystal, dark glassmorphism',
    'Minimalist vector app icon for AI Chatbot Agency, glowing robotic eye inside a hexagonal badge, vibrant gradients',
  ];

  const handleGenerate = async () => {
    if (!createPrompt.trim()) return;
    setIsCreating(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: createPrompt,
          aspectRatio,
          imageSize: '1K',
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${res.status}`);
      }

      const data = await res.json();
      setCreatedImageUrl(data.imageUrl);
    } catch (err: any) {
      console.error('Image creation failed:', err);
      setErrorMsg(err?.message || 'Failed to create image with Gemini.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleEdit = async () => {
    const base64ToUse = sourceImageBase64 || createdImageUrl;
    if (!base64ToUse) {
      setErrorMsg('Please upload or generate an image first to edit.');
      return;
    }
    if (!editPrompt.trim()) {
      setErrorMsg('Please enter instructions for what changes to apply.');
      return;
    }

    setIsEditing(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/edit-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: editPrompt,
          imageBase64: base64ToUse,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${res.status}`);
      }

      const data = await res.json();
      setEditedImageUrl(data.imageUrl);
    } catch (err: any) {
      console.error('Image edit failed:', err);
      setErrorMsg(err?.message || 'Failed to edit image with Gemini.');
    } finally {
      setIsEditing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSourceImageBase64(reader.result as string);
      setEditedImageUrl(null);
    };
    reader.readAsDataURL(file);
  };

  const useCreatedForEdit = () => {
    if (!createdImageUrl) return;
    setSourceImageBase64(createdImageUrl);
    setActiveMode('edit');
  };

  return (
    <div id="ai-asset-studio-section" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gemini 3.1 Flash Image Studio</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          AI Digital Asset & Avatar Studio
        </h2>
        <p className="mt-3 text-slate-300 text-sm sm:text-base">
          Craft custom 3D chatbot avatars, web hero branding mockups, and digital illustrations with text prompts — or edit existing assets using conversational AI.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            id="mode-create-btn"
            onClick={() => setActiveMode('create')}
            className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-colors ${
              activeMode === 'create'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Create New Asset</span>
          </button>
          <button
            id="mode-edit-btn"
            onClick={() => setActiveMode('edit')}
            className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-colors ${
              activeMode === 'edit'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Edit Existing Asset</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="max-w-2xl mx-auto mb-6 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 text-center">
          {errorMsg}
        </div>
      )}

      {/* CREATE ASSET MODE */}
      {activeMode === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls (5 Cols) */}
          <div className="lg:col-span-5 rounded-2xl bg-slate-900/70 border border-slate-800 p-6 sm:p-7 backdrop-blur-sm space-y-5 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Prompt Asset Creation</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Image Description / Text Prompt
              </label>
              <textarea
                id="create-image-prompt-input"
                rows={4}
                value={createPrompt}
                onChange={(e) => setCreatePrompt(e.target.value)}
                placeholder="Describe your desired chatbot avatar, brand icon, or website mockup..."
                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Aspect Ratio
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {['1:1', '16:9', '4:3'].map((ratio) => (
                  <button
                    key={ratio}
                    id={`ratio-btn-${ratio.replace(':', '-')}`}
                    onClick={() => setAspectRatio(ratio)}
                    className={`py-2 rounded-lg border font-semibold ${
                      aspectRatio === ratio
                        ? 'border-indigo-500 bg-indigo-950/60 text-indigo-200'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            {/* Inspiration Chips */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Prompt Inspiration
              </label>
              <div className="space-y-1.5">
                {sampleCreatePrompts.map((p, idx) => (
                  <button
                    key={idx}
                    id={`inspiration-prompt-${idx}`}
                    onClick={() => setCreatePrompt(p)}
                    className="w-full text-left p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] text-slate-300 hover:text-white hover:border-slate-700 line-clamp-1 transition-all"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <button
              id="generate-image-btn"
              onClick={handleGenerate}
              disabled={isCreating || !createPrompt.trim()}
              className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/25 flex items-center justify-center space-x-2 transition-all"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing with Gemini...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Generate Asset</span>
                </>
              )}
            </button>
          </div>

          {/* Image Display (7 Cols) */}
          <div className="lg:col-span-7 rounded-2xl bg-slate-900/70 border border-slate-800 p-6 sm:p-7 backdrop-blur-sm shadow-xl flex flex-col justify-between items-center min-h-[460px]">
            <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Output Preview
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Resolution: 1024x1024 (1K)
              </span>
            </div>

            <div className="flex-1 w-full flex items-center justify-center">
              {isCreating ? (
                <div className="py-16 flex flex-col items-center justify-center space-y-3">
                  <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
                  <p className="text-sm font-medium text-slate-200">
                    Generating digital asset with Gemini...
                  </p>
                  <p className="text-xs text-slate-500">
                    Applying photorealistic lighting & custom textures
                  </p>
                </div>
              ) : createdImageUrl ? (
                <div className="relative group max-w-md w-full">
                  <img
                    id="created-asset-preview"
                    src={createdImageUrl}
                    alt="Generated Asset"
                    className="w-full rounded-xl border border-slate-700 shadow-2xl object-contain max-h-[380px] mx-auto"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-400 border border-slate-700">
                    <ImageIcon className="w-7 h-7 text-indigo-400" />
                  </div>
                  <h4 className="text-sm font-semibold text-white">No Asset Generated Yet</h4>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Enter a prompt on the left and click "Generate Asset" to create high-resolution bot avatars and web graphics.
                  </p>
                </div>
              )}
            </div>

            {createdImageUrl && (
              <div className="w-full pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  id="send-to-edit-btn"
                  onClick={useCreatedForEdit}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors border border-slate-700"
                >
                  <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Edit in Studio</span>
                </button>

                <a
                  id="download-created-image-btn"
                  href={createdImageUrl}
                  download="ai-chatbot-asset.png"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download High-Res</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* EDIT ASSET MODE */}
      {activeMode === 'edit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls (5 Cols) */}
          <div className="lg:col-span-5 rounded-2xl bg-slate-900/70 border border-slate-800 p-6 sm:p-7 backdrop-blur-sm space-y-5 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Wand2 className="w-4 h-4 text-cyan-400" />
              <span>Conversational Image Editing</span>
            </h3>

            {/* Source Image Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Source Image
              </label>

              {sourceImageBase64 || createdImageUrl ? (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={sourceImageBase64 || createdImageUrl || ''}
                      alt="Source preview"
                      className="w-12 h-12 rounded-lg object-cover border border-slate-600"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="text-xs font-semibold text-slate-200">Image Loaded</div>
                      <div className="text-[10px] text-slate-400">Ready for editing modifications</div>
                    </div>
                  </div>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-6 text-center cursor-pointer transition-colors"
                >
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                  <div className="text-xs font-semibold text-slate-200">Upload Image to Edit</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">PNG, JPG up to 10MB</div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Edit Instructions / Text Changes *
              </label>
              <textarea
                id="edit-image-prompt-input"
                rows={4}
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                placeholder="e.g. Add neon green cyber glasses, turn the background into a minimalist server rack room, make it look cinematic..."
                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
              />
            </div>

            <button
              id="apply-edit-image-btn"
              onClick={handleEdit}
              disabled={isEditing || (!sourceImageBase64 && !createdImageUrl) || !editPrompt.trim()}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:opacity-60 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-600/25 flex items-center justify-center space-x-2 transition-all"
            >
              {isEditing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Applying Changes with Gemini...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Apply Edits</span>
                </>
              )}
            </button>
          </div>

          {/* Results Comparison (7 Cols) */}
          <div className="lg:col-span-7 rounded-2xl bg-slate-900/70 border border-slate-800 p-6 sm:p-7 backdrop-blur-sm shadow-xl flex flex-col justify-between">
            <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Edited Asset Result
              </span>
              <span className="text-[11px] font-mono text-cyan-400">
                gemini-3.1-flash-lite-image
              </span>
            </div>

            <div className="flex-1 w-full flex items-center justify-center py-6">
              {isEditing ? (
                <div className="py-16 flex flex-col items-center justify-center space-y-3">
                  <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
                  <p className="text-sm font-medium text-slate-200">
                    Applying conversational modifications...
                  </p>
                  <p className="text-xs text-slate-500">
                    Synthesizing edits while maintaining image coherence
                  </p>
                </div>
              ) : editedImageUrl ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-slate-400">Original</span>
                    <img
                      src={sourceImageBase64 || createdImageUrl || ''}
                      alt="Before"
                      className="w-full rounded-xl border border-slate-800 object-cover max-h-[300px]"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-semibold text-cyan-400">Modified with AI</span>
                    <img
                      id="edited-asset-preview"
                      src={editedImageUrl}
                      alt="After"
                      className="w-full rounded-xl border border-cyan-500/50 shadow-xl object-cover max-h-[300px]"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              ) : (
                <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-400 border border-slate-700">
                    <Wand2 className="w-7 h-7 text-cyan-400" />
                  </div>
                  <h4 className="text-sm font-semibold text-white">No Edits Applied Yet</h4>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Select a source image, enter what to alter (e.g. change color, add accessories, modify scenery), and click "Apply Edits".
                  </p>
                </div>
              )}
            </div>

            {editedImageUrl && (
              <div className="w-full pt-4 border-t border-slate-800 flex items-center justify-end">
                <a
                  id="download-edited-image-btn"
                  href={editedImageUrl}
                  download="ai-chatbot-edited-asset.png"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Edited Asset</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
