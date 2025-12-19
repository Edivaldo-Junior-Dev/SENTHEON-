
import React from 'react';
import { 
  User, MapPin, Linkedin, Github, Mail, Code, Terminal, ShieldCheck, Zap,
  Bot, TrendingUp, Globe, PenTool
} from 'lucide-react';
import { CyberCard } from '../../components/ui/CyberComponents';
import { SentheonLogo } from '../../components/SentheonLogo';

const TechBadge: React.FC<{ icon: React.ReactNode; label: string; color: string }> = ({ icon, label, color }) => (
  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-${color}/30 text-${color} text-[10px] font-mono hover:bg-${color}/10 transition-colors`}>
    {icon}
    {label}
  </div>
);

export const ProfileView: React.FC = () => {
  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar bg-void-dark/50">
      <div className="max-w-6xl mx-auto space-y-12 pb-20">
        
        <section className="text-center space-y-6 animate-in fade-in slide-in-from-top-10 duration-700">
           <div className="flex justify-center mb-4">
              <SentheonLogo size="xl" animated />
           </div>
           <h1 className="text-5xl font-black text-white tracking-[0.3em] font-cyber uppercase">SENTHEON <span className="text-neon-orange">v4.0</span></h1>
           <p className="text-gray-400 font-mono text-lg max-w-2xl mx-auto italic">
             "Google Grounding & Jasper AI: A nova era do Content-Driven Intelligence."
           </p>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">
           <CyberCard className="border-l-4 border-neon-orange">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                 <Terminal className="text-neon-orange" /> MANUAL DE OPERAÇÕES v4.0
              </h2>
              <div className="space-y-6 text-sm text-gray-300 font-mono">
                 <div className="flex gap-4">
                    <PenTool className="text-neon-orange shrink-0" size={20} />
                    <div>
                       <p className="text-white font-bold uppercase mb-1">JASPER CONTENT ENGINE</p>
                       <p>Gere copy de vendas, anúncios e automações de conteúdo com o Jasper integrado. frameworks AIDA/PAS via Gemini.</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <Globe className="text-neon-cyan shrink-0" size={20} />
                    <div>
                       <p className="text-white font-bold uppercase mb-1">GROUNDING (Busca Real-Time)</p>
                       <p>Valide fatos e dados de mercado instantaneamente via Google Search Grounding.</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <TrendingUp className="text-neon-green shrink-0" size={20} />
                    <div>
                       <p className="text-white font-bold uppercase mb-1">NEXUS CRM</p>
                       <p>Gestão de Pipeline estilo HubSpot com probabilidade de fechamento calculada por rede neural.</p>
                    </div>
                 </div>
              </div>
           </CyberCard>

           <CyberCard className="border-l-4 border-neon-green">
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                 <div className="w-24 h-24 rounded-2xl border-2 border-neon-green flex items-center justify-center shrink-0">
                    <User size={48} className="text-neon-green" />
                 </div>
                 <div>
                    <h2 className="text-2xl font-black text-white font-cyber">EDIVALDO LIMA JUNIOR</h2>
                    <p className="text-neon-green font-mono text-xs font-bold mt-1">AI Architect | Content Strategist</p>
                    <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-2">
                       <MapPin size={12} /> Jacobina, BA (Cloud Node)
                    </div>
                 </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-8">
                 <TechBadge icon={<PenTool size={10} />} label="Content Ops" color="neon-orange" />
                 <TechBadge icon={<Globe size={10} />} label="Grounding AI" color="neon-cyan" />
                 <TechBadge icon={<TrendingUp size={10} />} label="Revenue Ops" color="neon-green" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                 <a href="https://www.linkedin.com/in/edivaldojuniordev/" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 p-3 bg-white/5 border border-white/10 text-white rounded hover:bg-neon-blue/20 transition-all text-[10px] font-bold">LINKEDIN</a>
                 <a href="https://github.com/Edivaldo-Junior-Dev" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 p-3 bg-white/5 border border-white/10 text-white rounded hover:bg-white/20 transition-all text-[10px] font-bold">GITHUB</a>
              </div>
           </CyberCard>
        </section>
      </div>
    </div>
  );
};
