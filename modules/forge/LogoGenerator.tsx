
import React, { useState, useEffect, useRef } from 'react';
import { generateLogo } from '../../services/geminiService';
import { LogoRequest, LogoResult } from '../../types';
import { 
    Image as ImageIcon, Download, Wand2, Palette, Layers, Sparkles, 
    Layout, Upload, X, History, Trash2, Monitor, AlertTriangle, RefreshCw, Eye
} from 'lucide-react';

// --- CUSTOM COMPONENTS FOR THIS MODULE ---

// 1. Neon Rotating Squares Loader
const RotatingLoader = () => (
    <div className="flex flex-col items-center justify-center gap-6">
        <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Outer Square - Slow Purple */}
            <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-sm animate-[spin_3s_linear_infinite] shadow-[0_0_20px_rgba(168,85,247,0.4)]"></div>
            
            {/* Inner Square - Fast Teal (Reverse) */}
            <div 
                className="absolute inset-4 border-4 border-teal-400 border-b-transparent rounded-sm shadow-[0_0_15px_rgba(45,212,191,0.4)]"
                style={{ animation: 'spin 1.5s linear infinite reverse' }}
            ></div>
            
            {/* Center Text */}
            <span className="font-cyber text-[10px] text-white -rotate-45 animate-pulse tracking-widest">
                RENDERING
            </span>
        </div>
        <p className="font-mono text-teal-400 text-xs animate-pulse tracking-widest uppercase">
            Analysing Semiotics & Vectors...
        </p>
        <style>{`
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
    </div>
);

// 2. Error Diagnostic Card
const ErrorDiagnostic: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => (
    <div className="bg-red-950/30 border border-red-500/50 p-6 rounded-lg max-w-md text-center">
        <AlertTriangle className="text-red-500 mx-auto mb-4" size={32} />
        <h3 className="text-red-400 font-bold mb-2">SYSTEM HALTED</h3>
        <p className="text-xs text-red-300 font-mono mb-6">{message}</p>
        <button 
            onClick={onRetry}
            className="px-4 py-2 bg-red-500/10 border border-red-500 text-red-500 hover:bg-red-500/20 text-xs font-bold tracking-wider uppercase transition-colors"
        >
            RE-INITIALIZE
        </button>
    </div>
);

// 3. Styled Inputs for Slate Theme
const SlateInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input 
        {...props}
        className={`w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs p-3 rounded focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400/50 transition-all font-mono ${props.className}`}
    />
);

const SlateSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
    <div className="relative">
        <select 
            {...props}
            className={`w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs p-3 rounded appearance-none focus:border-teal-400 focus:outline-none font-mono ${props.className}`}
        >
            {props.children}
        </select>
        <div className="absolute right-3 top-3 pointer-events-none text-slate-500">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
    </div>
);

const SlateLabel: React.FC<{ icon?: React.ReactNode; children: React.ReactNode }> = ({ icon, children }) => (
    <label className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-500 mb-1.5 tracking-wider">
        {icon && <span className="text-teal-500">{icon}</span>}
        {children}
    </label>
);

// --- MAIN MODULE ---

export const LogoGenerator: React.FC = () => {
    // --- STATE ---
    const [formData, setFormData] = useState<LogoRequest>({
        brandName: '',
        context: '',
        industry: '',
        style: 'Minimalist Tech',
        colors: 'Cyan & Dark Grey',
        referenceImage: undefined,
        removeBackground: false,
        essence: 'Innovation',
        emotion: 'Trust',
        symbolType: 'Abstract Mark',
        typography: 'Sans Serif (Modern)',
        composition: 'Symbol Left, Text Right'
    });

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<LogoResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<LogoResult[]>([]);
    const [showHistory, setShowHistory] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- EFFECTS ---
    useEffect(() => {
        const cached = localStorage.getItem('brandforge_cache');
        if (cached) {
            try {
                setHistory(JSON.parse(cached));
            } catch (e) {
                console.error("Cache corrupted");
            }
        }
    }, []);

    const saveToHistory = (newResult: LogoResult) => {
        const updated = [newResult, ...history].slice(0, 10); // Keep last 10
        setHistory(updated);
        localStorage.setItem('brandforge_cache', JSON.stringify(updated));
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('brandforge_cache');
    };

    // --- HANDLERS ---
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, referenceImage: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = async () => {
        if (!formData.brandName) {
            setError("PROTOCOL HALTED: Brand Name is mandatory.");
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const logo = await generateLogo(formData);
            setResult(logo);
            saveToHistory(logo);
        } catch (err: any) {
            setError(err.message || "Unknown synthesis error.");
        } finally {
            setLoading(false);
        }
    };

    const loadFromHistory = (item: LogoResult) => {
        setResult(item);
        setFormData(item.params);
        setShowHistory(false);
    };

    // --- RENDER ---
    return (
        <div className="flex flex-col lg:flex-row h-full gap-0 bg-[#020617] text-slate-200 overflow-hidden font-inter">
            
            {/* LEFT SIDEBAR - CONTROLS (420px) */}
            <div className="w-full lg:w-[420px] bg-slate-900/50 backdrop-blur-md border-r border-slate-800 flex flex-col h-full overflow-hidden">
                <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                    <div>
                        <h2 className="text-sm font-bold text-white font-cyber tracking-widest flex items-center gap-2">
                            <Sparkles className="text-teal-400" size={14} /> BRANDFORGE <span className="text-purple-500">v2.0</span>
                        </h2>
                        <p className="text-[10px] text-slate-500 font-mono mt-1">Visual Synthesis Engine</p>
                    </div>
                    <button 
                        onClick={() => setShowHistory(!showHistory)}
                        className={`p-2 rounded border transition-all ${showHistory ? 'bg-purple-500/20 border-purple-500 text-purple-400' : 'border-slate-700 text-slate-400 hover:text-white'}`}
                        title="Offline Gallery"
                    >
                        <History size={16} />
                    </button>
                </div>

                {/* SCROLLABLE FORM AREA */}
                <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-6">
                    
                    {/* 1. Core Identity */}
                    <div className="space-y-3">
                        <SlateLabel icon={<Layout size={12}/>}>Project Identity</SlateLabel>
                        <SlateInput 
                            placeholder="BRAND NAME"
                            value={formData.brandName}
                            onChange={e => setFormData({...formData, brandName: e.target.value})}
                            className="border-teal-500/30 text-teal-300 font-bold"
                        />
                        <textarea 
                            className="w-full bg-slate-900 border border-slate-700 text-slate-300 text-xs p-3 rounded focus:border-teal-400 focus:outline-none font-mono min-h-[60px]"
                            placeholder="Context: What does this company do?"
                            value={formData.context}
                            onChange={e => setFormData({...formData, context: e.target.value})}
                        />
                    </div>

                    {/* 2. Visual Reference */}
                    <div className="space-y-3">
                         <SlateLabel icon={<Upload size={12}/>}>Reference Material</SlateLabel>
                         {!formData.referenceImage ? (
                             <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center cursor-pointer hover:border-teal-500/50 hover:bg-slate-800/50 transition-all group"
                             >
                                 <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                 <ImageIcon className="mx-auto text-slate-600 group-hover:text-teal-400 mb-2" size={24} />
                                 <p className="text-[10px] text-slate-500 uppercase font-bold">Upload Reference Image</p>
                             </div>
                         ) : (
                             <div className="relative rounded-lg overflow-hidden border border-purple-500/30 group">
                                 <img src={formData.referenceImage} alt="Ref" className="w-full h-32 object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                 <button 
                                    onClick={() => setFormData({...formData, referenceImage: undefined})}
                                    className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded hover:bg-red-500"
                                 >
                                     <X size={14} />
                                 </button>
                             </div>
                         )}
                    </div>

                    {/* 3. Strategic Parameters */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <SlateLabel>Industry</SlateLabel>
                            <SlateSelect value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})}>
                                <option value="">Select...</option>
                                <option>Technology / SaaS</option>
                                <option>Finance / Crypto</option>
                                <option>Healthcare / Bio</option>
                                <option>Gaming / Esports</option>
                                <option>Fashion / Lifestyle</option>
                                <option>Education</option>
                            </SlateSelect>
                        </div>
                        <div>
                            <SlateLabel>Emotion</SlateLabel>
                            <SlateSelect value={formData.emotion} onChange={e => setFormData({...formData, emotion: e.target.value})}>
                                <option>Trust & Stability</option>
                                <option>Innovation & Future</option>
                                <option>Excitement & Energy</option>
                                <option>Luxury & Exclusivity</option>
                                <option>Friendly & Approachable</option>
                            </SlateSelect>
                        </div>
                    </div>

                    {/* 4. Visual Parameters */}
                    <div className="space-y-3">
                        <SlateLabel icon={<Palette size={12}/>}>Visual Genetics</SlateLabel>
                        <div className="grid grid-cols-2 gap-3">
                            <SlateSelect value={formData.style} onChange={e => setFormData({...formData, style: e.target.value})}>
                                <option>Minimalist Tech</option>
                                <option>Cyberpunk Neon</option>
                                <option>Abstract Geometric</option>
                                <option>Vintage / Retro</option>
                                <option>3D Metallic</option>
                                <option>Hand Drawn / Organic</option>
                            </SlateSelect>
                            <SlateSelect value={formData.symbolType} onChange={e => setFormData({...formData, symbolType: e.target.value})}>
                                <option>Abstract Mark</option>
                                <option>Lettermark (Monogram)</option>
                                <option>Wordmark (Text Only)</option>
                                <option>Pictorial Mark</option>
                                <option>Mascot</option>
                                <option>Emblem</option>
                            </SlateSelect>
                        </div>
                        <SlateInput 
                            placeholder="Custom Color Palette (ex: #FF00FF & Black)"
                            value={formData.colors}
                            onChange={e => setFormData({...formData, colors: e.target.value})}
                        />
                    </div>

                    {/* 5. Toggles */}
                    <div className="flex items-center gap-3 p-3 bg-slate-900 rounded border border-slate-800">
                        <input 
                            type="checkbox" 
                            id="bgToggle"
                            checked={formData.removeBackground}
                            onChange={e => setFormData({...formData, removeBackground: e.target.checked})}
                            className="w-4 h-4 accent-teal-500 bg-slate-800 border-slate-600 rounded"
                        />
                        <label htmlFor="bgToggle" className="text-xs text-slate-300 select-none cursor-pointer">
                            Request Transparent/Isolated Background
                        </label>
                    </div>

                </div>

                {/* ACTION BAR */}
                <div className="p-5 border-t border-slate-800 bg-slate-950/50">
                    <button 
                        onClick={handleGenerate}
                        disabled={loading}
                        className={`
                            w-full py-4 text-sm font-bold font-cyber tracking-widest uppercase rounded
                            flex items-center justify-center gap-3 transition-all
                            ${loading 
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] border border-white/10'
                            }
                        `}
                    >
                        {loading ? 'PROCESSING...' : <><Wand2 size={18} /> GENERATE ASSET</>}
                    </button>
                </div>
            </div>

            {/* RIGHT DISPLAY AREA (FLEX-1) */}
            <div className="flex-1 relative bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(30,41,59,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.3)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20 pointer-events-none"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,184,166,0.05),transparent_70%)] pointer-events-none"></div>

                {/* Status Monitor (Bottom Right) */}
                <div className="absolute bottom-4 right-4 flex items-center gap-3 text-[10px] font-mono text-slate-600">
                    <span className="flex items-center gap-1"><Monitor size={10} /> STATUS: ONLINE</span>
                    <span className="flex items-center gap-1"><Layers size={10} /> MODEL: GEMINI-2.5-FLASH</span>
                </div>

                {/* CONTENT STATES */}
                {loading ? (
                    <RotatingLoader />
                ) : error ? (
                    <ErrorDiagnostic message={error} onRetry={handleGenerate} />
                ) : result ? (
                    <div className="relative z-10 flex flex-col items-center gap-6 animate-in zoom-in duration-500">
                        <div className="relative group rounded-lg overflow-hidden border border-slate-700 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-[#111]">
                            {/* The Generated Image */}
                            <img 
                                src={result.imageUrl} 
                                alt="Generated Logo" 
                                className="max-h-[60vh] max-w-[90vw] object-contain"
                            />
                            
                            {/* Overlay Controls */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                                <a 
                                    href={result.imageUrl} 
                                    download={`BrandForge_${result.id.substring(0,6)}.png`}
                                    className="p-3 bg-teal-500 hover:bg-teal-400 text-black rounded-full transition-transform hover:scale-110"
                                    title="Download PNG"
                                >
                                    <Download size={24} />
                                </a>
                                <button 
                                    onClick={() => window.open(result.imageUrl, '_blank')}
                                    className="p-3 bg-slate-700 hover:bg-slate-600 text-white rounded-full transition-transform hover:scale-110"
                                    title="Full View"
                                >
                                    <Eye size={24} />
                                </button>
                            </div>
                        </div>
                        
                        <div className="bg-slate-900/80 backdrop-blur border border-slate-800 p-3 rounded-full flex items-center gap-4 text-xs font-mono text-slate-400">
                            <span>ID: {result.id.split('-')[0]}</span>
                            <span className="w-px h-3 bg-slate-700"></span>
                            <span>{new Date(result.timestamp).toLocaleTimeString()}</span>
                        </div>
                    </div>
                ) : (
                    <div className="text-center opacity-30 select-none">
                        <Layout size={64} className="mx-auto mb-4 text-slate-500" />
                        <h1 className="text-4xl font-black font-cyber text-slate-700 uppercase tracking-widest">Visual Synthesis</h1>
                        <p className="text-sm font-mono text-slate-500 mt-2">Awaiting Parameters...</p>
                    </div>
                )}

                {/* HISTORY DRAWER (OVERLAY) */}
                {showHistory && (
                    <div className="absolute top-0 right-0 bottom-0 w-80 bg-slate-900 border-l border-purple-500/30 z-50 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
                        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <History size={14} className="text-purple-500"/> Offline Gallery
                            </h3>
                            <div className="flex gap-2">
                                <button onClick={clearHistory} className="text-slate-500 hover:text-red-500" title="Clear Cache"><Trash2 size={14}/></button>
                                <button onClick={() => setShowHistory(false)} className="text-slate-500 hover:text-white"><X size={14}/></button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {history.length === 0 ? (
                                <p className="text-xs text-slate-600 text-center py-10 font-mono">CACHE EMPTY</p>
                            ) : (
                                history.map(item => (
                                    <div key={item.id} className="bg-slate-800/50 border border-slate-700 rounded p-2 hover:border-purple-500/50 transition-colors group">
                                        <div className="h-32 bg-black/50 rounded mb-2 overflow-hidden flex items-center justify-center">
                                            <img src={item.imageUrl} alt="Cached" className="h-full object-contain" />
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-300 truncate w-32">{item.params.brandName}</p>
                                                <p className="text-[9px] text-slate-500 font-mono">{new Date(item.timestamp).toLocaleTimeString()}</p>
                                            </div>
                                            <button 
                                                onClick={() => loadFromHistory(item)}
                                                className="p-1.5 bg-purple-500/10 text-purple-400 rounded hover:bg-purple-500 hover:text-white transition-colors"
                                                title="Load"
                                            >
                                                <RefreshCw size={12} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
