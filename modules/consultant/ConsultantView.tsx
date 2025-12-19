
import React, { useState, useRef, useEffect } from 'react';
import { Bot, MessageSquare, ShieldCheck, Terminal, Send, Cpu, User, Activity, Trash2, Brain, Sliders, Volume2, Globe, ExternalLink } from 'lucide-react';
import { CyberInput, CyberButton, CyberCard } from '../../components/ui/CyberComponents';
import { streamConsultantChat, ChatResponse } from '../../services/geminiService';
import { ChatMessage, ConsultantPersona, AgentPersonality } from '../../types';
import { useProjectStore, useForgeStore, useAgentStore } from '../../core/store';
import { chronicleService } from '../chronicle/services/chronicleService';

// --- NEURAL AVATAR COMPONENT ---
const NeuralAvatar: React.FC<{ state: 'idle' | 'thinking' | 'speaking' }> = ({ state }) => {
  const color = state === 'thinking' ? '#bc13fe' : state === 'speaking' ? '#00f0ff' : '#4b5563';
  return (
    <div className="relative w-48 h-48 flex items-center justify-center mx-auto mb-8 transition-all duration-500">
      <div className="absolute inset-0 rounded-full border-2 border-dashed opacity-30 animate-[spin_10s_linear_infinite]" style={{ borderColor: color }}></div>
      <div className="relative z-10 w-32 h-32">
         <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_currentColor]" style={{ color }}>
            <path d="M50 20 L20 50 L50 80 L80 50 Z" fill="none" stroke="currentColor" strokeWidth="0.5" className="animate-pulse" />
            <circle cx="50" cy="50" r="15" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1" />
            <circle cx="50" cy="50" r="5" fill="currentColor">
               {state === 'speaking' && <animate attributeName="opacity" values="1;0.5;1" dur="0.2s" repeatCount="indefinite" />}
            </circle>
         </svg>
      </div>
      <div className="absolute -bottom-8 w-full text-center">
         <span className="text-[10px] font-mono tracking-[0.3em] uppercase animate-pulse" style={{ color }}>
             {state === 'idle' ? 'STANDBY' : state === 'thinking' ? 'SYNCING GOOGLE SEARCH' : 'TRANSMITTING DATA'}
         </span>
      </div>
    </div>
  );
};

export const ConsultantView: React.FC = () => {
  const [activePersona, setActivePersona] = useState<ConsultantPersona | 'CONFIG'>('ARCHITECT');
  const [messages, setMessages] = useState<(ChatMessage & { sources?: {uri: string, title: string}[] })[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [avatarState, setAvatarState] = useState<'idle' | 'thinking' | 'speaking'>('idle');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { config, setConfig } = useAgentStore();
  const { projects } = useProjectStore();
  const { results: forgeResults } = useForgeStore();

  const buildSystemContext = () => {
     const recentEvents = chronicleService.getEvents().slice(0, 3);
     return `Contexto: ${config.language}. Arquiteto logado. Google Search Grounding ATIVO.`;
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, avatarState]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || activePersona === 'CONFIG') return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setAvatarState('thinking');

    const context = buildSystemContext();

    try {
      const tempId = 'temp-' + Date.now();
      setMessages(prev => [...prev, {
        id: tempId,
        role: 'model',
        text: '',
        timestamp: new Date().toISOString(),
        persona: activePersona as ConsultantPersona,
        sources: []
      }]);

      await streamConsultantChat(
        userMsg.text, 
        activePersona as ConsultantPersona, 
        messages, 
        (res: ChatResponse) => {
           setAvatarState('speaking');
           setMessages(prev => prev.map(msg => 
             msg.id === tempId ? { ...msg, text: res.text, sources: res.sources } : msg
           ));
        },
        context
      );
    } catch (error) {
      console.error(error);
    } finally {
      setAvatarState('idle');
    }
  };

  return (
    <div className="flex h-full overflow-hidden bg-black/80">
      <div className="w-80 border-r border-white/10 flex flex-col bg-black/40 backdrop-blur-sm">
         <div className="p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white tracking-widest font-cyber flex items-center gap-2">
               <Bot className="text-neon-cyan" /> NÚCLEO IA
            </h2>
            <div className="flex items-center gap-2 mt-2">
               <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse"></div>
               <span className="text-[9px] text-neon-green font-mono uppercase tracking-widest">Google Grounding Active</span>
            </div>
         </div>

         <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {[
               { id: 'ARCHITECT', label: 'Estrategista Digital', icon: <Cpu size={18} />, color: 'text-neon-cyan' },
               { id: 'DEVOPS', label: 'Especialista Web', icon: <Terminal size={18} />, color: 'text-neon-green' },
               { id: 'SECURITY', label: 'Auditor Cyber', icon: <ShieldCheck size={18} />, color: 'text-neon-red' },
            ].map((p) => (
               <button
                 key={p.id}
                 onClick={() => setActivePersona(p.id as ConsultantPersona)}
                 className={`w-full flex items-center gap-3 p-4 rounded border transition-all ${
                   activePersona === p.id 
                     ? `bg-white/10 border-white/30 ${p.color}` 
                     : 'border-transparent text-gray-500 hover:text-white'
                 }`}
               >
                 {p.icon}
                 <span className="text-left font-bold text-xs tracking-wider uppercase">{p.label}</span>
               </button>
            ))}
         </div>
         <div className="p-4"><NeuralAvatar state={avatarState} /></div>
      </div>

      <div className="flex-1 flex flex-col relative bg-cyber-grid bg-fixed">
         <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
            {messages.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
                  <Globe size={64} className="text-neon-cyan mb-6 animate-pulse" />
                  <h3 className="text-2xl font-cyber text-white tracking-widest uppercase">CONEXÃO WEB ESTABELECIDA</h3>
                  <p className="font-mono text-neon-cyan mt-2">Pergunte sobre tendências, dados de mercado ou auditoria técnica.</p>
               </div>
            ) : (
               messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border border-white/10 ${msg.role === 'user' ? 'bg-neon-yellow/10' : 'bg-neon-blue/10'}`}>
                         {msg.role === 'user' ? <User size={18} className="text-neon-yellow" /> : <Cpu size={18} className="text-neon-blue" />}
                      </div>
                      <div className={`max-w-3xl p-5 rounded-lg border backdrop-blur-md ${msg.role === 'user' ? 'bg-neon-yellow/5 border-neon-yellow/30' : 'bg-black/90 border-neon-blue/30'}`}>
                         <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap">{msg.text || '▌'}</div>
                         
                         {/* FONTES DO GOOGLE SEARCH */}
                         {msg.sources && msg.sources.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                               <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest flex items-center gap-2">
                                  <Globe size={10} className="text-neon-cyan"/> Fontes de Pesquisa Google
                               </p>
                               <div className="flex flex-wrap gap-2">
                                  {msg.sources.map((src, i) => (
                                     <a 
                                        key={i} href={src.uri} target="_blank" rel="noreferrer"
                                        className="text-[9px] bg-neon-cyan/10 text-neon-cyan px-2 py-1 rounded border border-neon-cyan/20 flex items-center gap-1 hover:bg-neon-cyan/20 transition-all"
                                     >
                                        <ExternalLink size={8} /> {src.title.substring(0, 20)}...
                                     </a>
                                  ))}
                               </div>
                            </div>
                         )}
                      </div>
                  </div>
               ))
            )}
            <div ref={chatEndRef} />
         </div>

         <div className="p-6 bg-black/60 border-t border-white/10">
            <div className="max-w-4xl mx-auto flex gap-4">
               <input
                  type="text"
                  className="flex-1 bg-black/50 border border-white/20 rounded p-4 text-white font-mono focus:border-neon-cyan focus:shadow-[0_0_15px_rgba(0,240,255,0.2)] outline-none"
                  placeholder="Consulte a inteligência Sentheon (Google Grounding Ativo)..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
               />
               <CyberButton variant="primary" glow onClick={handleSendMessage} disabled={avatarState !== 'idle'}>
                  <Send size={18} />
               </CyberButton>
            </div>
         </div>
      </div>
    </div>
  );
};
