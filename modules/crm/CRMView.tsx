
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, DollarSign, Plus, MoreVertical, 
  Mail, Phone, ArrowRight, ShieldCheck, Zap, BarChart3,
  Sparkles, Loader2, Info, Briefcase, FileSearch
} from 'lucide-react';
import { CyberCard, CyberButton } from '../../components/ui/CyberComponents';
import { streamConsultantChat } from '../../services/geminiService';
import { SentheonLogo } from '../../components/SentheonLogo';
import { useLeadStore } from '../../core/store';
import { Lead } from '../../types';

export const CRMView: React.FC = () => {
  const { leads, fetchLeads, addLead, isLoading } = useLeadStore();
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const stages: Lead['status'][] = ['Lead', 'Proposta', 'Negociação', 'Fechado'];

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleSummarize = async () => {
    if (leads.length === 0) {
      setAiSummary("O pipeline está vazio. Adicione novos negócios para que a IA possa gerar insights estratégicos.");
      return;
    }
    setIsSummarizing(true);
    const context = `Pipeline atual: ${JSON.stringify(leads)}. Resuma o desempenho e sugira ações estratégicas.`;
    try {
      await streamConsultantChat(context, 'ARCHITECT', [], (res) => {
        setAiSummary(res.text);
      }, 'Português');
    } catch (e) {
      setAiSummary("Erro ao sincronizar com Breeze AI.");
    } finally {
      setIsSummarizing(false);
    }
  };

  const createNewLead = (stage: Lead['status']) => {
    const newLead: Lead = {
      id: `L-${Date.now().toString().slice(-4)}`,
      name: 'Novo Cliente',
      company: 'Empresa Exemplo',
      value: 5000,
      status: stage,
      probability: 20,
      lastContact: new Date().toISOString()
    };
    addLead(newLead);
  };

  const totalPipeline = leads.reduce((acc, l) => acc + l.value, 0);
  const winRate = leads.length > 0 ? (leads.filter(l => l.status === 'Fechado').length / leads.length) * 100 : 0;

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar flex flex-col bg-void-dark">
      <div className="flex justify-between items-start mb-8 border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <SentheonLogo size="sm" animated />
          <div>
            <h1 className="text-3xl font-black text-white tracking-widest flex items-center gap-3">
              <TrendingUp className="text-neon-orange" size={32} />
              NEXUS CRM <span className="text-xs bg-neon-orange/20 text-neon-orange px-2 py-1 rounded font-mono">BREEZE IA</span>
            </h1>
            <p className="text-gray-500 font-mono text-[10px] mt-1 uppercase tracking-widest">Business Intelligence & Revenue Operations</p>
          </div>
        </div>
        
        <div className="flex gap-4">
           <CyberButton variant="primary" className="text-[10px] py-2 px-4 flex items-center gap-2 border-neon-orange text-neon-orange hover:bg-neon-orange/10" onClick={handleSummarize}>
             {isSummarizing ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />} 
             RESUMIR COM IA
           </CyberButton>
           <CyberButton variant="primary" className="text-[10px] py-2 px-4 flex items-center gap-2" onClick={() => createNewLead('Lead')}>
             <Plus size={14} /> NOVO NEGÓCIO
           </CyberButton>
        </div>
      </div>

      {aiSummary && (
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
           <CyberCard className="border-neon-orange bg-neon-orange/5 p-4 relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                 <h3 className="text-neon-orange font-bold text-xs flex items-center gap-2">
                    <Zap size={14} /> BREEZE COPILOT INSIGHTS
                 </h3>
                 <button onClick={() => setAiSummary(null)} className="text-gray-500 hover:text-white"><Plus className="rotate-45" size={14}/></button>
              </div>
              <p className="text-xs text-gray-200 font-mono leading-relaxed">{aiSummary}</p>
           </CyberCard>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
         {[
           { label: 'Pipeline Total', val: `R$ ${totalPipeline.toLocaleString()}`, icon: <DollarSign className="text-neon-green"/> },
           { label: 'Negócios Ativos', val: leads.length.toString(), icon: <Briefcase size={20} className="text-neon-cyan"/> },
           { label: 'Taxa Est. Fechamento', val: `${winRate.toFixed(1)}%`, icon: <BarChart3 className="text-neon-yellow"/> },
           { label: 'Previsão Mensal', val: `R$ ${(totalPipeline * 0.3).toLocaleString()}`, icon: <TrendingUp className="text-neon-orange"/> },
         ].map((s, i) => (
           <div key={i} className="bg-slate-900/40 border border-white/5 p-4 rounded-xl group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:scale-125 transition-transform">{s.icon}</div>
              <div className="text-[9px] text-gray-500 uppercase font-mono mb-1">{s.label}</div>
              <div className="text-xl font-bold text-white tracking-wider font-cyber">{s.val}</div>
           </div>
         ))}
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 pb-20 overflow-x-auto custom-scrollbar">
        {stages.map(stage => (
          <div key={stage} className="min-w-[280px] flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2 px-2">
               <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stage}</h3>
               <span className="text-[9px] text-gray-600 bg-white/5 px-2 py-0.5 rounded-full">{leads.filter(l => l.status === stage).length}</span>
            </div>
            
            <div className="flex-1 space-y-3 bg-white/5 p-2 rounded-xl border border-dashed border-white/10">
               {leads.filter(l => l.status === stage).length === 0 ? (
                  <div className="py-10 text-center opacity-20 flex flex-col items-center gap-2">
                     <FileSearch size={24} />
                     <span className="text-[9px] font-mono uppercase tracking-widest">Sem registros</span>
                  </div>
               ) : (
                  leads.filter(l => l.status === stage).map(lead => (
                    <CyberCard key={lead.id} className="p-3 hover:border-neon-orange cursor-grab active:cursor-grabbing transition-all border-l-2 border-neon-orange/40 bg-slate-950/50">
                       <div className="flex justify-between items-start mb-2">
                          <span className="text-[8px] text-gray-500 font-mono">#{lead.id}</span>
                       </div>
                       <h4 className="text-xs font-bold text-white truncate">{lead.name}</h4>
                       <p className="text-[10px] text-neon-orange font-mono mb-3 uppercase tracking-tighter">{lead.company}</p>
                       <div className="flex justify-between items-center text-[9px] border-t border-white/5 pt-2">
                          <span className="text-gray-400 font-mono">R$ {lead.value.toLocaleString()}</span>
                          <span className="text-gray-500 flex items-center gap-1"><Info size={10} /> {lead.probability}%</span>
                       </div>
                    </CyberCard>
                  ))
               )}
               <button onClick={() => createNewLead(stage)} className="w-full py-2 border border-dashed border-white/10 text-[10px] text-gray-600 hover:text-neon-orange hover:border-neon-orange/40 rounded-lg transition-all">
                  + NOVO CARD
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
