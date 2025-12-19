import React from 'react';
import { ChronicleEvent, ImpactLevel, EventType } from '../../../types';
import { Activity, AlertOctagon, FileCode, GitCommit, GitPullRequest, Zap } from 'lucide-react';

interface EventCardProps {
  event: ChronicleEvent;
  onRestore?: (event: ChronicleEvent) => void;
}

const ImpactColors: Record<ImpactLevel, string> = {
  low: 'text-gray-400 border-gray-700',
  medium: 'text-neon-cyan border-neon-cyan',
  high: 'text-neon-yellow border-neon-yellow',
  critical: 'text-neon-red border-neon-red',
};

const EventIcons: Record<EventType, React.ReactNode> = {
  [EventType.CREATED]: <Zap size={16} />,
  [EventType.UPDATED]: <GitCommit size={16} />,
  [EventType.DELETED]: <AlertOctagon size={16} />,
  [EventType.GENERATED]: <Activity size={16} />,
  [EventType.RESTORED]: <GitPullRequest size={16} />,
  [EventType.SNAPSHOT]: <FileCode size={16} />,
};

export const EventCard: React.FC<EventCardProps> = ({ event, onRestore }) => {
  const impact = event.aiAnalysis?.impact || 'low';
  const colorClass = ImpactColors[impact];
  const date = new Date(event.timestamp);

  return (
    <div className={`relative pl-8 pb-8 border-l-2 ${colorClass.split(' ')[1]} last:border-0 last:pb-0 group animate-in fade-in slide-in-from-left-4 duration-300`}>
      {/* Timeline Dot */}
      <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-black border-2 ${colorClass.split(' ')[1]} shadow-[0_0_10px_currentColor] ${colorClass.split(' ')[0]}`}></div>
      
      {/* Card Content */}
      <div className="bg-black/40 border border-white/10 rounded-lg p-4 hover:bg-white/5 transition-all duration-300 hover:border-opacity-50">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <span className={`p-1 rounded bg-white/5 ${colorClass.split(' ')[0]}`}>
               {EventIcons[event.type]}
            </span>
            <span className="font-bold text-white text-sm tracking-wide">{event.type}</span>
            <span className="text-gray-500 text-xs font-mono">• {event.module}</span>
          </div>
          <span className="text-xs text-gray-500 font-mono">
            {date.toLocaleTimeString()}
          </span>
        </div>

        <h3 className="text-neon-cyan font-bold mb-1 text-base">{event.entityName || event.entityId}</h3>
        
        {event.aiAnalysis ? (
          <div className="mb-3">
             <p className="text-gray-300 text-sm italic border-l-2 border-white/10 pl-2 mb-2">
               "{event.aiAnalysis.summary}"
             </p>
             {event.aiAnalysis.suggestions.length > 0 && (
               <div className="flex flex-wrap gap-2">
                 {event.aiAnalysis.suggestions.map((sug, i) => (
                   <span key={i} className="text-[10px] bg-neon-yellow/10 text-neon-yellow px-2 py-0.5 rounded border border-neon-yellow/20">
                     💡 {sug}
                   </span>
                 ))}
               </div>
             )}
          </div>
        ) : (
          <p className="text-gray-500 text-sm italic animate-pulse">Analisando dados quânticos...</p>
        )}

        <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/5">
           <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center text-[10px] text-white font-bold">
                 {event.actor.name.charAt(0)}
              </div>
              <span className="text-xs text-gray-400">{event.actor.name}</span>
           </div>
           
           <button 
             onClick={() => onRestore?.(event)}
             className="text-[10px] uppercase font-bold tracking-wider text-neon-magenta hover:text-white transition-colors"
           >
             [ RESTAURAR VERSÃO ]
           </button>
        </div>
      </div>
    </div>
  );
};