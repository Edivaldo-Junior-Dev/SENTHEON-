
import React, { useEffect, useState } from 'react';
import { chronicleService } from './services/chronicleService';
import { ChronicleEvent, ModuleName, EventType } from '../../types';
import { EventCard } from './components/EventCard';
import { History, Filter, RefreshCw, Calendar, Download, Rewind, Clock, RotateCcw, AlertTriangle } from 'lucide-react';
import { CyberButton, CyberCard } from '../../components/ui/CyberComponents';

export const ChronicleView: React.FC = () => {
  const [events, setEvents] = useState<ChronicleEvent[]>([]);
  const [filterModule, setFilterModule] = useState<string>('ALL');
  
  const refreshEvents = () => {
    setEvents(chronicleService.getEvents());
  };

  useEffect(() => {
    refreshEvents();
    
    // Listen for updates from service
    const handleUpdate = () => refreshEvents();
    window.addEventListener('chronicle-updated', handleUpdate);
    return () => window.removeEventListener('chronicle-updated', handleUpdate);
  }, []);

  const handleSimulateEvent = async () => {
    // Demonstration purpose only
    await chronicleService.recordEvent(
      EventType.GENERATED,
      ModuleName.FORGE,
      'sim_001',
      { status: 'draft' },
      { status: 'published', name: 'New Cyber Brand' },
      'Simulação Manual',
      'Arquiteto'
    );
  };

  const filteredEvents = filterModule === 'ALL' 
    ? events 
    : events.filter(e => e.module === filterModule);

  const stats = {
    total: events.length,
    highImpact: events.filter(e => e.aiAnalysis?.impact === 'high' || e.aiAnalysis?.impact === 'critical').length,
    today: events.filter(e => new Date(e.timestamp).toDateString() === new Date().toDateString()).length
  };

  // --- MOCK SNAPSHOTS FOR TIME MANAGER PANEL ---
  const snapshots = [
    { id: 'snap_1', time: '10:42 AM', label: 'Pré-Deploy Produção', stable: true },
    { id: 'snap_2', time: '09:15 AM', label: 'Backup Automático Diário', stable: true },
    { id: 'snap_3', time: 'Yesterday', label: 'Alteração Crítica DB', stable: false },
  ];

  return (
    <div className="flex h-full relative">
      {/* Sidebar Filters */}
      <div className="w-64 border-r border-white/10 bg-black/40 p-6 flex flex-col gap-6 overflow-y-auto">
        <div>
           <h2 className="text-neon-cyan font-cyber text-lg mb-4 flex items-center gap-2">
             <Filter size={18} /> FILTROS
           </h2>
           
           <div className="space-y-2">
             <button 
               onClick={() => setFilterModule('ALL')}
               className={`w-full text-left px-3 py-2 rounded text-xs font-mono transition-colors ${filterModule === 'ALL' ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan' : 'text-gray-400 hover:bg-white/5'}`}
             >
               TODOS OS MÓDULOS
             </button>
             {Object.values(ModuleName).map(mod => (
               <button 
                 key={mod}
                 onClick={() => setFilterModule(mod)}
                 className={`w-full text-left px-3 py-2 rounded text-xs font-mono transition-colors ${filterModule === mod ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan' : 'text-gray-400 hover:bg-white/5'}`}
               >
                 {mod.split(' ')[0]}
               </button>
             ))}
           </div>
        </div>

        <div className="mt-auto border-t border-white/10 pt-6">
           <h2 className="text-neon-yellow font-cyber text-lg mb-4 flex items-center gap-2">
             <Calendar size={18} /> HOJE
           </h2>
           <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-white/5 p-2 rounded">
                 <span className="block text-xl font-bold text-white">{stats.total}</span>
                 <span className="text-[10px] text-gray-500 uppercase">Eventos</span>
              </div>
              <div className="bg-white/5 p-2 rounded">
                 <span className="block text-xl font-bold text-neon-red">{stats.highImpact}</span>
                 <span className="text-[10px] text-gray-500 uppercase">Críticos</span>
              </div>
           </div>
        </div>
      </div>

      {/* Main Timeline */}
      <div className="flex-1 overflow-y-auto p-8 relative">
        <div className="max-w-4xl mx-auto">
           {/* Header */}
           <div className="flex justify-between items-center mb-10">
              <div>
                <h1 className="text-3xl font-black text-white tracking-widest flex items-center gap-3">
                  <Clock className="text-neon-magenta" size={32} />
                  GERENCIADOR NO TEMPO
                </h1>
                <p className="text-gray-500 font-mono text-sm mt-1">Controle Temporal, Auditoria & Versionamento do Sentheon</p>
              </div>
              
              <div className="flex gap-2">
                 <CyberButton onClick={handleSimulateEvent} variant="secondary" className="text-xs py-2 px-4">
                   + SIMULAR EVENTO
                 </CyberButton>
                 <button className="p-2 border border-white/20 rounded hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                    <Download size={18} />
                 </button>
                 <button onClick={refreshEvents} className="p-2 border border-white/20 rounded hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                    <RefreshCw size={18} />
                 </button>
              </div>
           </div>

           {/* --- NOVO PAINEL: GERENCIADOR NO TEMPO (TIME MACHINE) --- */}
           <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
              <CyberCard className="border-l-4 border-neon-cyan bg-black/60 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-20">
                    <RotateCcw size={100} className="text-neon-cyan" />
                 </div>
                 <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2 relative z-10">
                    <Rewind className="text-neon-cyan" /> PONTOS DE RESTAURAÇÃO
                 </h2>
                 <div className="space-y-3 relative z-10">
                    {snapshots.map(snap => (
                       <div key={snap.id} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded hover:bg-white/10 transition-colors group cursor-pointer">
                          <div>
                             <div className="flex items-center gap-2">
                                <span className="text-neon-cyan font-bold font-mono text-sm">{snap.time}</span>
                                {snap.stable ? (
                                   <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 rounded border border-green-500/30">STABLE</span>
                                ) : (
                                   <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 rounded border border-red-500/30">UNSTABLE</span>
                                )}
                             </div>
                             <p className="text-xs text-gray-400">{snap.label}</p>
                          </div>
                          <button className="opacity-0 group-hover:opacity-100 bg-neon-cyan/20 text-neon-cyan px-3 py-1 text-xs rounded border border-neon-cyan hover:bg-neon-cyan hover:text-black transition-all font-bold">
                             RESTAURAR
                          </button>
                       </div>
                    ))}
                 </div>
              </CyberCard>
              
              <CyberCard className="border-l-4 border-neon-red bg-black/60 flex flex-col justify-center">
                 <div className="text-center space-y-4">
                    <AlertTriangle size={48} className="text-neon-red mx-auto animate-pulse" />
                    <div>
                       <h3 className="text-lg font-bold text-white">CONTROLE DE CRONOGRAMA</h3>
                       <p className="text-xs text-gray-400 font-mono mt-1 px-8">
                          O sistema detectou inconsistências temporais no módulo Hive. Recomenda-se sincronização imediata.
                       </p>
                    </div>
                    <CyberButton variant="danger" glow className="w-full">
                       FORÇAR RESSINCRONIZAÇÃO
                    </CyberButton>
                 </div>
              </CyberCard>
           </div>

           <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
              <History size={16} className="text-neon-magenta" />
              <h3 className="text-neon-magenta font-bold tracking-widest text-sm">FLUXO DE EVENTOS COMPLETO</h3>
           </div>

           {/* Timeline Stream */}
           <div className="space-y-0 pl-4">
              {filteredEvents.length === 0 ? (
                <div className="text-center py-20 opacity-50 border-2 border-dashed border-gray-700 rounded-lg">
                   <History size={48} className="mx-auto mb-4 text-gray-600" />
                   <p className="font-mono text-gray-400">NENHUM EVENTO REGISTRADO NESTE PERÍODO.</p>
                </div>
              ) : (
                filteredEvents.map(event => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onRestore={(evt) => alert(`Funcionalidade de Viagem no Tempo: Restaurar estado de ${evt.entityId} para o ponto ${evt.timestamp}.`)}
                  />
                ))
              )}
           </div>
        </div>
      </div>
      
      {/* Right AI Panel (Optional/Collapsible) */}
      <div className="w-72 bg-black/60 border-l border-white/10 p-6 hidden xl:block">
         <h3 className="text-neon-magenta font-bold tracking-widest mb-6">INSIGHTS IA</h3>
         <div className="space-y-4">
            <CyberCard className="border-neon-magenta/30">
               <p className="text-xs text-gray-400 mb-2">RESUMO GERAL</p>
               <p className="text-sm text-white leading-relaxed">
                  O sistema apresenta alta atividade no módulo <strong>FORJA</strong>. A taxa de alterações críticas está dentro dos limites seguros.
               </p>
            </CyberCard>
            
            <div className="p-4 bg-neon-yellow/5 border border-neon-yellow/20 rounded">
               <span className="text-xs text-neon-yellow font-bold block mb-1">SUGESTÃO TÁTICA</span>
               <p className="text-xs text-gray-300">
                  Realize um backup manual (Snapshot) antes da próxima grande alteração no módulo HIVE.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};
