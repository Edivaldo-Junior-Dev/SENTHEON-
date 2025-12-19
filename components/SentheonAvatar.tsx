
import React, { useEffect, useRef, useState } from 'react';
import { useAgentStore } from '../core/store';
import { MessageSquare, Settings, Search, Globe, Mic, MicOff, Command, Loader2 } from 'lucide-react';
import { streamConsultantChat, ChatResponse } from '../services/geminiService';
import { useNavigate } from 'react-router-dom';

const normalizeText = (text: string) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s]/g, "").trim();

// Variantes fonéticas para ativação do Sentheon
const ACTIVATION_KEYWORDS = [
    'sentheon', 'senteon', 'senton', 'cention', 'centon', 
    'centro', 'sente um', 'sentinel', 'sentinel', 'sancho', 
    'centurion', 'sention', 'centhiun', 'ajuda', 'hey sentheon'
];

const AudioVisualizer: React.FC<{ active: boolean, color: string }> = ({ active, color }) => {
    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {[1, 2, 3].map((i) => (
                <div 
                    key={i}
                    className={`absolute rounded-full border-2 opacity-0 ${active ? 'animate-ping' : ''}`}
                    style={{ 
                        borderColor: color, 
                        width: `${100 + i * 40}%`, 
                        height: `${100 + i * 40}%`,
                        animationDelay: `${i * 0.3}s`,
                        animationDuration: '2s'
                    }}
                />
            ))}
        </div>
    );
};

const HolographicFace: React.FC<{ state: string, isListening: boolean }> = ({ state, isListening }) => {
    let color = state === 'speaking' ? "#00F0FF" : state === 'processing' ? "#FFFF00" : isListening ? "#00FF41" : "#BC13FE";
    return (
        <div className="relative w-40 h-40 flex items-center justify-center pointer-events-none select-none">
            <AudioVisualizer active={isListening && state === 'listening'} color={color} />
            <div className="absolute inset-2 rounded-full blur-[40px] opacity-20 transition-all duration-500" style={{ background: color }}></div>
            <svg viewBox="0 0 200 200" className="w-full h-full relative z-20 drop-shadow-[0_0_15px_currentColor]" style={{ color }}>
                <circle cx="100" cy="100" r="85" fill="none" stroke={color} strokeWidth="0.5" strokeDasharray="5 5" className="animate-[spin_30s_linear_infinite]" />
                <path d="M60,80 Q100,60 140,80" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
                <circle cx="80" cy="95" r="2" fill="#fff" />
                <circle cx="120" cy="95" r="2" fill="#fff" />
                <g transform="translate(100, 140)">
                    {state === 'speaking' ? (
                        <path d="M-30,0 Q0,25 30,0" fill="none" stroke={color} strokeWidth="2">
                           <animate attributeName="d" values="M-30,0 Q0,5 30,0; M-30,0 Q0,40 30,0; M-30,0 Q0,5 30,0" dur="0.1s" repeatCount="indefinite" />
                        </path>
                    ) : state === 'processing' ? (
                        <circle r="5" fill={color} className="animate-ping" />
                    ) : (
                        <path d="M-20,0 Q0,5 20,0" fill="none" stroke={color} strokeWidth="1" opacity="0.4" />
                    )}
                </g>
            </svg>
        </div>
    );
};

export const SentheonAvatar: React.FC = () => {
    const navigate = useNavigate();
    const { config, setConfig, agentState, setAgentState, position, setPosition } = useAgentStore();
    const [spokenText, setSpokenText] = useState('');
    const [liveTranscript, setLiveTranscript] = useState('');
    const [isBoxExpanded, setIsBoxExpanded] = useState(false);
    const [isGrounding, setIsGrounding] = useState(false);
    const [micError, setMicError] = useState<string | null>(null);
    const [isReconnecting, setIsReconnecting] = useState(false);
    
    const recognitionRef = useRef<any>(null);
    const restartTimeoutRef = useRef<any>(null);
    const synthRef = useRef<SpeechSynthesis>(window.speechSynthesis);
    const speechQueue = useRef<string[]>([]);
    const isSpeakingInProgress = useRef(false);
    const idlePromptTimeoutRef = useRef<any>(null);

    useEffect(() => {
        if (config.isActive) {
            initRecognition();
        } else {
            stopRecognition();
        }
        return () => {
            stopRecognition();
            synthRef.current.cancel();
            if (idlePromptTimeoutRef.current) clearTimeout(idlePromptTimeoutRef.current);
        };
    }, [config.isActive, config.language]);

    const stopRecognition = () => {
        if (recognitionRef.current) {
            recognitionRef.current.onend = null;
            try { recognitionRef.current.stop(); } catch(e) {}
        }
        if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
    };

    const initRecognition = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setMicError("Navegador sem suporte a voz.");
            return;
        }
        
        stopRecognition();

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = config.language;

        recognition.onstart = () => {
            setAgentState('listening');
            setMicError(null);
            setIsReconnecting(false);
        };

        recognition.onerror = (event: any) => {
            if (event.error === 'no-speech') return;
            if (event.error === 'network') {
                setIsReconnecting(true);
                setMicError("Falha de rede na voz. Tentando reconectar...");
            } else if (event.error === 'not-allowed') {
                setMicError("Microfone bloqueado pelo sistema.");
                setConfig({ isActive: false });
            } else {
                setMicError(`Erro: ${event.error}`);
            }
        };
        
        recognition.onresult = async (event: any) => {
            const result = event.results[event.results.length - 1];
            const rawText = result[0].transcript;
            
            if (!result.isFinal) {
                setLiveTranscript(rawText);
                return;
            }

            setLiveTranscript("");
            const text = normalizeText(rawText);

            // Verifica se alguma das palavras-chave de ativação está presente
            const hasActivation = ACTIVATION_KEYWORDS.some(keyword => text.includes(keyword));

            // --- COMMAND BRIDGE LOGIC ---
            if (text.includes("abrir crm") || text.includes("mostrar crm")) {
                speak("Navegando para o Nexus CRM.");
                navigate('/crm');
                return;
            }
            if (text.includes("abrir forja") || text.includes("gerar logo")) {
                speak("Acessando a Forja de Marcas.");
                navigate('/forge');
                return;
            }
            if (text.includes("configura") || text.includes("modo sistema")) {
                speak("Abrindo painel de sistema.");
                navigate('/settings');
                return;
            }

            // --- CHAT LOGIC ---
            if (hasActivation || text.includes("pesquise") || text.includes("explorar")) {
                if (idlePromptTimeoutRef.current) clearTimeout(idlePromptTimeoutRef.current);
                try { recognition.stop(); } catch(e) {}
                await processQuery(rawText);
            }
        };

        recognition.onend = () => {
            if (config.isActive && agentState !== 'speaking' && agentState !== 'processing') {
                const delay = isReconnecting ? 2000 : 300;
                restartTimeoutRef.current = setTimeout(() => {
                    try { recognition.start(); } catch(e) {}
                }, delay);
            }
        };

        recognitionRef.current = recognition;
        try { recognition.start(); } catch(e) {}
    };

    const processQuery = async (userText: string) => {
        setAgentState('processing');
        setIsBoxExpanded(true);
        setIsGrounding(true);
        setSpokenText('');
        
        let lastSentenceProcessed = "";
        let buffer = "";

        try {
            await streamConsultantChat(userText, 'GENERAL_ASSISTANT', [], (res: ChatResponse) => {
                const fullText = res.text;
                setSpokenText(fullText);
                buffer = fullText.replace(lastSentenceProcessed, "");
                
                const sentences = buffer.split(/[.!?;]/);
                if (sentences.length > 1) {
                    const completeSentence = sentences[0].trim();
                    if (completeSentence) {
                        speechQueue.current.push(completeSentence);
                        lastSentenceProcessed += sentences[0] + (buffer.match(/[.!?;]/)?.[0] || "");
                        runSpeechQueue();
                    }
                }
            }, `Sentheon AI em ${config.language}`);
            
            const finalRest = spokenText.replace(lastSentenceProcessed, "").trim();
            if (finalRest) {
                speechQueue.current.push(finalRest);
                runSpeechQueue();
            }
        } catch (e) {
            speak("Erro na conexão neural. Verifique sua chave de API.");
        } finally {
            setIsGrounding(false);
            setAgentState('idle');
            // Agenda um prompt de encerramento se o usuário ficar em silêncio
            scheduleIdlePrompt();
            if (config.isActive) initRecognition();
        }
    };

    const scheduleIdlePrompt = () => {
        if (idlePromptTimeoutRef.current) clearTimeout(idlePromptTimeoutRef.current);
        idlePromptTimeoutRef.current = setTimeout(() => {
            if (agentState === 'idle' || agentState === 'listening') {
                speak("Posso ajudá-lo com algo mais neste momento?");
                // Após o prompt, ele fecha a caixa de texto depois de um tempo
                setTimeout(() => setIsBoxExpanded(false), 10000);
            }
        }, 15000); // 15 segundos de silêncio após a última resposta
    };

    const runSpeechQueue = () => {
        if (isSpeakingInProgress.current || speechQueue.current.length === 0) return;
        
        const nextText = speechQueue.current.shift();
        if (!nextText) return;

        isSpeakingInProgress.current = true;
        setAgentState('speaking');

        const utterance = new SpeechSynthesisUtterance(nextText);
        utterance.lang = config.language;
        utterance.pitch = config.voicePitch;
        utterance.rate = config.voiceRate;

        utterance.onend = () => {
            isSpeakingInProgress.current = false;
            if (speechQueue.current.length > 0) {
                runSpeechQueue();
            } else {
                setAgentState('listening');
                if (config.isActive) initRecognition();
            }
        };

        synthRef.current.speak(utterance);
    };

    const speak = (text: string) => {
        speechQueue.current.push(text);
        runSpeechQueue();
    };

    return (
        <div className="fixed z-[9999] flex items-center" style={{ left: position.x, top: position.y }}>
            
            {/* LIVE TRANSCRIPT BUBBLE */}
            {liveTranscript && (
                <div className="absolute -top-16 left-0 right-0 flex justify-center animate-in fade-in slide-in-from-bottom-2">
                    <div className="bg-neon-green/10 border border-neon-green/30 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2">
                        <Mic size={12} className="text-neon-green animate-pulse" />
                        <span className="text-[10px] font-mono text-neon-green uppercase tracking-widest truncate max-w-[200px]">
                            {liveTranscript}
                        </span>
                    </div>
                </div>
            )}

            <div className="relative group cursor-move" onMouseDown={(e) => {
                const startX = e.clientX - position.x;
                const startY = e.clientY - position.y;
                const onMove = (me: MouseEvent) => setPosition(me.clientX - startX, me.clientY - startY);
                window.addEventListener('mousemove', onMove);
                window.addEventListener('mouseup', () => window.removeEventListener('mousemove', onMove), { once: true });
            }}>
                <div className="bg-slate-950/80 backdrop-blur-2xl rounded-full border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.9)] p-1">
                    <HolographicFace state={agentState} isListening={config.isActive} />
                    
                    {/* INDICADORES DE STATUS */}
                    <div className="absolute -top-1 -right-1 flex gap-1">
                         <div className={`p-1 rounded-full ${micError ? 'bg-neon-red' : config.isActive ? 'bg-neon-green' : 'bg-gray-700'} text-black shadow-lg`}>
                            {micError ? <MicOff size={10} /> : isReconnecting ? <Loader2 size={10} className="animate-spin" /> : <Mic size={10} />}
                         </div>
                         <div className="bg-neon-orange text-black p-1 rounded-full">
                            <Command size={10} />
                         </div>
                    </div>

                    {micError && (
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-neon-red/20 border border-neon-red/50 text-neon-red px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-tighter text-center">
                            {micError}
                        </div>
                    )}
                </div>
            </div>

            <div className={`ml-6 transition-all duration-700 ease-out origin-left ${isBoxExpanded ? 'w-[450px] opacity-100 scale-100' : 'w-0 opacity-0 scale-75 pointer-events-none'}`}>
                <div className="glass-panel p-6 rounded-3xl shadow-2xl relative overflow-hidden border-neon-orange/20">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-orange to-transparent opacity-40"></div>
                    <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                        <div className="flex items-center gap-2 text-neon-orange text-[9px] font-mono tracking-[0.2em] uppercase font-bold">
                            <MessageSquare size={12} /> BREEZE HUB SYNC
                        </div>
                        <div className="flex gap-2 items-center">
                           {isGrounding && <span className="text-[8px] text-neon-cyan font-mono animate-pulse flex items-center gap-1"><Search size={8}/> GOOGLE SEARCH GROUNDING</span>}
                           <Globe size={12} className="text-white/20" />
                        </div>
                    </div>
                    <p className="text-xs font-mono text-slate-100 leading-relaxed max-h-80 overflow-y-auto custom-scrollbar whitespace-pre-wrap">
                        {spokenText || "Aguardando ativação neural..."}
                    </p>
                    
                    {/* VOZ COMMAND SHORTCUTS TIPS */}
                    <div className="mt-4 pt-3 border-t border-white/5 flex gap-4 overflow-x-auto no-scrollbar">
                        <span className="text-[8px] text-gray-500 font-mono whitespace-nowrap">DICA: "Sentheon, abrir CRM"</span>
                        <span className="text-[8px] text-gray-500 font-mono whitespace-nowrap">DICA: "Sentheon, pesquise sobre [x]"</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
