
import React from 'react';
import { useSystemStore } from '../core/store';

interface SentheonLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animated?: boolean;
}

export const SentheonLogo: React.FC<SentheonLogoProps> = ({ 
  size = 'md', 
  className = '', 
  animated = true 
}) => {
  const version = useSystemStore(s => s.version);
  const dimensions = {
    sm: 'w-10 h-10',
    md: 'w-24 h-24',
    lg: 'w-48 h-48',
    xl: 'w-64 h-64'
  };

  return (
    <div className={`relative flex flex-col items-center justify-center ${dimensions[size]} ${className}`}>
      {/* Glow Aura */}
      <div className={`absolute inset-0 rounded-full bg-neon-orange/20 blur-2xl transition-all duration-1000 ${animated ? 'animate-pulse' : ''}`}></div>
      
      <svg viewBox="0 0 200 200" className="w-full h-full relative z-10 drop-shadow-[0_0_10px_rgba(255,95,31,0.5)]">
        <defs>
          <linearGradient id="sentheon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF5F1F" />
            <stop offset="100%" stopColor="#FFFF00" />
          </linearGradient>
        </defs>

        {/* Outer Rotating Ring */}
        <circle 
          cx="100" cy="100" r="90" 
          fill="none" 
          stroke="url(#sentheon-gradient)" 
          strokeWidth="1" 
          strokeDasharray="40 10 20 10"
          className={animated ? 'animate-[spin_20s_linear_infinite]' : ''}
          opacity="0.3"
        />

        {/* Middle Hex Frame */}
        <path 
          d="M100 20 L170 60 L170 140 L100 180 L30 140 L30 60 Z" 
          fill="none" 
          stroke="url(#sentheon-gradient)" 
          strokeWidth="2"
          className={animated ? 'animate-[pulse_4s_ease-in-out_infinite]' : ''}
          opacity="0.6"
        />

        {/* Central "S" Sigil */}
        <g className={animated ? 'animate-[bounce_3s_ease-in-out_infinite]' : ''}>
           <path 
            d="M70 60 C70 40, 130 40, 130 70 C130 90, 70 110, 70 130 C70 160, 130 160, 130 140" 
            fill="none" 
            stroke="white" 
            strokeWidth="12" 
            strokeLinecap="round"
          />
        </g>
      </svg>
      
      {size !== 'sm' && (
        <span className="absolute -bottom-4 text-[9px] font-mono text-neon-orange font-bold tracking-tighter bg-black/50 px-2 rounded-full border border-neon-orange/20 animate-pulse">
          {version}
        </span>
      )}
    </div>
  );
};
