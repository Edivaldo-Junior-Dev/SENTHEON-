import React from 'react';
import { X } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  glow?: boolean;
}

export const CyberButton: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  glow = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-6 py-3 font-cyber font-bold tracking-wider uppercase transition-all duration-300 clip-path-slant";
  
  const variants = {
    primary: `bg-neon-cyan/10 text-neon-cyan border border-neon-cyan hover:bg-neon-cyan/20 ${glow ? 'shadow-[0_0_15px_rgba(0,240,255,0.5)]' : ''}`,
    secondary: "bg-neon-magenta/10 text-neon-magenta border border-neon-magenta hover:bg-neon-magenta/20",
    danger: "bg-red-500/10 text-red-500 border border-red-500 hover:bg-red-500/20",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const CyberCard: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`glass-card p-6 rounded-none relative overflow-hidden ${className}`} {...props}>
    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-neon-cyan"></div>
    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-neon-cyan"></div>
    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-neon-cyan"></div>
    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-neon-cyan"></div>
    {children}
  </div>
);

export const CyberInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    {...props}
    className={`w-full bg-void-dark border border-white/20 p-3 text-white font-mono focus:border-neon-cyan focus:outline-none focus:shadow-[0_0_10px_rgba(0,240,255,0.3)] transition-all ${props.className || ''}`}
  />
);

export const CyberSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
  <select
    {...props}
    className={`w-full bg-void-dark border border-white/20 p-3 text-white font-mono focus:border-neon-cyan focus:outline-none focus:shadow-[0_0_10px_rgba(0,240,255,0.3)] transition-all ${props.className || ''}`}
  >
    {props.children}
  </select>
);

export const CyberTextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea
    {...props}
    className={`w-full bg-void-dark border border-white/20 p-3 text-white font-mono focus:border-neon-cyan focus:outline-none focus:shadow-[0_0_10px_rgba(0,240,255,0.3)] transition-all ${props.className || ''}`}
  />
);

export const CyberModal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg animate-in fade-in zoom-in duration-200">
         <CyberCard className="border-neon-yellow shadow-[0_0_30px_rgba(255,255,0,0.1)]">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-2">
                <h2 className="text-xl font-bold text-neon-yellow tracking-widest">{title}</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
            </div>
            {children}
         </CyberCard>
      </div>
    </div>
  );
};