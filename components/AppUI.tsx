import React, { useState } from 'react';
import { Sparkles, Play, Pause, Wand2, Music } from 'lucide-react';
import { HolidayMode } from '../types';
import { generateLuxuryWish } from '../services/geminiService';

interface AppUIProps {
  mode: HolidayMode;
  setMode: (mode: HolidayMode) => void;
}

export const AppUI: React.FC<AppUIProps> = ({ mode, setMode }) => {
  const [name, setName] = useState('');
  const [wish, setWish] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const handleGenerateWish = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setWish(null);
    const result = await generateLuxuryWish(name, mode);
    setWish(result);
    setLoading(false);
  };

  const toggleAudio = () => {
    // Placeholder for actual audio logic
    setIsAudioPlaying(!isAudioPlaying);
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 md:p-12 z-10">
      
      {/* Header */}
      <header className="flex justify-between items-start pointer-events-auto">
        <div>
          <h1 className="font-serif text-3xl md:text-5xl text-yellow-500 tracking-wider font-bold drop-shadow-lg">
            ARIX <span className="text-white text-xl md:text-3xl font-light italic">Signature</span>
          </h1>
          <p className="text-emerald-200/80 font-serif italic mt-1 text-sm md:text-base">
            The Interactive Holiday Experience
          </p>
        </div>
        
        {/* Mode Switcher */}
        <div className="flex flex-col gap-2">
           {Object.values(HolidayMode).map((m) => (
             <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-2 font-serif text-xs md:text-sm transition-all duration-300 border border-white/20 backdrop-blur-md
                  ${mode === m 
                    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' 
                    : 'bg-black/40 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
             >
               {m.toUpperCase()}
             </button>
           ))}
        </div>
      </header>

      {/* Main Interactive Panel */}
      <main className="flex flex-col items-center justify-center pointer-events-none">
         {/* Center area is left clear for the tree */}
      </main>

      {/* Footer / Controls */}
      <footer className="flex flex-col md:flex-row justify-between items-end gap-6 pointer-events-auto">
        
        {/* Gemini Wish Generator */}
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-6 max-w-md w-full rounded-sm shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-800 via-yellow-500 to-emerald-800 opacity-50" />
          
          <h3 className="text-yellow-500 font-serif mb-4 flex items-center gap-2">
            <Wand2 size={16} /> 
            <span>AI Wish Architect</span>
          </h3>
          
          {!wish ? (
            <div className="flex flex-col gap-3">
              <input 
                type="text" 
                placeholder="Enter Recipient Name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/5 border border-white/10 text-white placeholder-white/30 px-4 py-2 font-serif focus:outline-none focus:border-yellow-500/50 transition-colors rounded-sm"
              />
              <button 
                onClick={handleGenerateWish}
                disabled={loading || !name}
                className="bg-gradient-to-r from-yellow-700 to-yellow-500 text-black font-serif font-bold py-2 px-4 rounded-sm hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Crafting...' : 'Generate Signature Wish'}
                {loading && <Sparkles size={16} className="animate-spin" />}
              </button>
            </div>
          ) : (
             <div className="animate-fadeIn">
               <p className="font-serif italic text-lg text-white/90 leading-relaxed mb-4 border-l-2 border-yellow-500 pl-4">
                 "{wish}"
               </p>
               <button 
                 onClick={() => setWish(null)}
                 className="text-xs text-yellow-500 hover:text-white underline font-serif uppercase tracking-widest"
               >
                 Create Another
               </button>
             </div>
          )}
        </div>

        {/* Audio Toggle (Visual only for this demo) */}
        <button 
          onClick={toggleAudio}
          className="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-full text-yellow-500 hover:bg-yellow-500/10 hover:scale-105 transition-all"
        >
          {isAudioPlaying ? <Music size={24} /> : <div className="relative"><Music size={24} /><div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" /></div>}
        </button>
      </footer>
    </div>
  );
};
