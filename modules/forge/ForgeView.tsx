
import React, { useState } from 'react';
import { useForgeStore } from '../../core/store';
import { generateBrandNames, generateJasperContent } from '../../services/geminiService';
import { CyberButton, CyberCard, CyberInput, CyberTextArea } from '../../components/ui/CyberComponents';
import { Brain, Zap, Globe, Save, Search, Cpu, Hash, Sparkles, Image as ImageIcon, Type as TypeIcon, PenTool, Loader2 } from 'lucide-react';
import { LogoGenerator } from './LogoGenerator';

type ForgeTab = 'naming' | 'visual' | 'jasper';

export const ForgeView: React.FC = () => {
  const { results, setResults } = useForgeStore();
  const [activeTab, setActiveTab] = useState<ForgeTab>('naming');
  
  // Jasper Engine State
  const [jasperLoading, setJasperLoading] = useState(false);
  const [jasperOutput, setJasperOutput] = useState('');
  const [jasperFormat, setJasperFormat] = useState('Sales Copy (AIDA)');
  const [jasperTone, setJasperTone] = useState('Persuasive & Tech');

  // Naming State
  const [loading, setLoading] = useState(false);
  const [mission, setMission] = useState('');
  const [style, setStyle] = useState('Cyberpunk');
  const [creativity, setCreativity] = useState(85);
  const [targetWord, setTargetWord] = useState('');

  const handleGenerateNames = async () => {
    if (!mission) return;
    setLoading(true);
    setResults([]); 
    try {
      const generated = await generateBrandNames(mission, style, creativity, targetWord);
      setResults(generated);
    } catch (e) {
      console.error(e);
      alert("Falha no Link Neural.");
    } finally {
      setLoading(false);
    }
  };

  const handleJasperSynthesis = async () => {
    if (!mission) return;
    setJasperLoading(true);
    try {
        const content = await generateJasperContent(mission, jasperFormat, jasperTone);
        setJasperOutput(content);
    } catch (e) {
        setJasperOutput("Erro na síntese Jasper.");
    } finally {
        setJasperLoading(false);
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto flex flex-col">
      <div className="mb-8 text-center flex-shrink-0">
        <h1 className="text-4xl font-black text-white tracking-widest mb-4 flex items-center justify-center gap-4">
           <Sparkles className="text-neon-yellow" size={32} />
           A FORJA UNIFICADA
           <Cpu className="text-neon-cyan" size={32} />
        </h1>
        
        <div className="flex justify-center gap-4 mb-6">
            <button onClick={() => setActiveTab('naming')} className={`flex items-center gap-2 px-6 py-3 border-b-2 font-cyber transition-all ${activeTab === 'naming' ? 'border-neon-cyan text-neon-cyan' : 'border-transparent text-gray-500 hover:text-white'}`}>
                <TypeIcon size={18} /> NEURAL NAMING
            </button>
            <button onClick={() => setActiveTab('visual')} className={`flex items-center gap-2 px-6 py-3 border-b-2 font-cyber transition-all ${activeTab === 'visual' ? 'border-neon-violet text-neon-violet' : 'border-transparent text-gray-500 hover:text-white'}`}>
                <ImageIcon size={18} /> BRANDFORGE AI (LOGO)
            </button>
            <button onClick={() => setActiveTab('jasper')} className={`flex items-center gap-2 px-6 py-3 border-b-2 font-cyber transition-all ${activeTab === 'jasper' ? 'border-neon-orange text-neon-orange' : 'border-transparent text-gray-500 hover:text-white'}`}>
                <PenTool size={18} /> JASPER ENGINE
            </button>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full">
        {activeTab === 'naming' && (
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 space-y-6">
                  <CyberCard className="border-l-4 border-neon-yellow">
                    <h2 className="text-xl font-bold mb-6 text-neon-yellow">INPUTS DO SISTEMA</h2>
                    <div className="space-y-6">
                      <CyberTextArea rows={4} placeholder="Descreva a alma do projeto..." value={mission} onChange={(e) => setMission(e.target.value)} />
                      <CyberInput placeholder="Palavra-Chave" value={targetWord} onChange={(e) => setTargetWord(e.target.value)} />
                      <CyberButton variant="primary" glow className="w-full" onClick={handleGenerateNames} disabled={loading}>{loading ? 'PROCESSANDO...' : 'INICIAR SÍNTESE'}</CyberButton>
                    </div>
                  </CyberCard>
                </div>
                <div className="lg:col-span-8 space-y-4">
                    {results.map((r, i) => (
                        <CyberCard key={i} className="border-l-4 border-neon-green">
                            <h3 className="text-2xl font-black text-white">{r.name}</h3>
                            <p className="text-neon-yellow font-mono italic">"{r.tagline}"</p>
                            <p className="text-xs text-gray-400 mt-2">{r.reasoning}</p>
                        </CyberCard>
                    ))}
                </div>
             </div>
        )}

        {activeTab === 'visual' && <LogoGenerator />}

        {activeTab === 'jasper' && (
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
                <div className="lg:col-span-4 space-y-6">
                    <CyberCard className="border-l-4 border-neon-orange bg-neon-orange/5">
                        <h3 className="text-neon-orange font-bold text-lg mb-4 flex items-center gap-2"><PenTool size={20}/> JASPER CONTENT OPS</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] text-gray-500 font-mono uppercase">Tópico/Produto</label>
                                <CyberTextArea rows={3} value={mission} onChange={e => setMission(e.target.value)} placeholder="Sobre o que vamos escrever?" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-[10px] text-gray-500 font-mono uppercase">Formato</label>
                                    <select className="w-full bg-void border border-white/10 p-2 text-xs text-white" value={jasperFormat} onChange={e => setJasperFormat(e.target.value)}>
                                        <option>Sales Copy (AIDA)</option>
                                        <option>Social Media Plan</option>
                                        <option>Blog Introduction</option>
                                        <option>Cold Email</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-500 font-mono uppercase">Tom</label>
                                    <select className="w-full bg-void border border-white/10 p-2 text-xs text-white" value={jasperTone} onChange={e => setJasperTone(e.target.value)}>
                                        <option>Professional</option>
                                        <option>Persuasive & Bold</option>
                                        <option>Helpful & Educational</option>
                                        <option>Witty & Funny</option>
                                    </select>
                                </div>
                            </div>
                            <CyberButton className="w-full border-neon-orange text-neon-orange" onClick={handleJasperSynthesis} disabled={jasperLoading}>
                                {jasperLoading ? <Loader2 className="animate-spin mx-auto"/> : 'GERAR CONTEÚDO'}
                            </CyberButton>
                        </div>
                    </CyberCard>
                </div>
                <div className="lg:col-span-8">
                    <CyberCard className="h-full min-h-[400px] border-neon-orange bg-slate-950/50">
                        <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                            <span className="text-xs font-mono text-neon-orange tracking-widest uppercase">Saída Jasper.ai v1.0</span>
                            <CyberButton variant="secondary" className="text-[10px] py-1 px-3" onClick={() => navigator.clipboard.writeText(jasperOutput)}>COPIAR</CyberButton>
                        </div>
                        <div className="text-sm font-mono text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {jasperOutput || "Aguardando síntese Jasper..."}
                        </div>
                    </CyberCard>
                </div>
             </div>
        )}
      </div>
    </div>
  );
};
