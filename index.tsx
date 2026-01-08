
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Zap, Database, Activity, FileCode, Share2, TrendingUp, Terminal, Settings, Globe, 
  Layers, ChevronRight, RefreshCw, Atom, Binary, ArrowUpRight, ArrowDownRight, 
  Menu, X, Sparkles, Cpu, BrainCircuit, Waves, ShieldAlert, Cpu as CoreIcon,
  BarChart4, Gauge, Droplets, Network as NetIcon, Info, Search, History, Eye,
  Coins, LineChart, Target, Rocket, BoxSelect, BookOpen, Clock, BarChart,
  TrendingDown, Minus, Share, DollarSign, ShieldCheck, Dna, LayoutGrid, MessageSquareQuote, Eye as VisionIcon, Send
} from 'lucide-react';

// Internal Modules
import { NeuronType } from './neural_core/neurons';
import { QuantumBrainOrchestrator } from './filesystem_neural/orchestrator';

// --- Components ---

const Header = ({ coherence, stats, toggleSidebar }: { coherence: number, stats: any, toggleSidebar: () => void }) => (
  <header className="border-b border-indigo-900/30 bg-black/60 backdrop-blur-xl p-4 flex justify-between items-center sticky top-0 z-50">
    <div className="flex items-center gap-3">
      <button onClick={toggleSidebar} className="lg:hidden p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-lg">
        <Menu size={20} />
      </button>
      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.3)]">
        <CoreIcon className="text-white animate-pulse" size={24} />
      </div>
      <div>
        <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 leading-none tracking-tight">
          LEXTRADER AGI <span className="text-[10px] font-bold tracking-[0.2em] uppercase ml-1 text-indigo-300 opacity-60 block md:inline">Quantum V14-Sentient</span>
        </h1>
        <p className="text-[9px] text-indigo-400/70 font-mono flex items-center gap-1 mt-1 uppercase tracking-tighter">
          <Activity size={8} className="animate-pulse" /> NET_PnL: <span className={stats?.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}>${stats?.totalPnL?.toFixed(2) || '0.00'}</span>
        </p>
      </div>
    </div>
    <div className="hidden sm:flex gap-6 text-[10px] font-mono">
      <div className="flex flex-col items-end">
        <span className="text-gray-500 uppercase tracking-widest">Quantum_Coherence</span>
        <span className="text-indigo-400 font-bold">{coherence.toFixed(6)}</span>
      </div>
      <div className="flex flex-col items-end border-l border-white/10 pl-6">
        <span className="text-gray-500 uppercase tracking-widest">Evo_Fitness</span>
        <span className="text-cyan-400 font-bold uppercase">Optimized</span>
      </div>
    </div>
  </header>
);

const Sidebar = ({ activeTab, setActiveTab, isOpen, closeSidebar }: any) => {
  const menuItems = [
    { id: 'dashboard', icon: BrainCircuit, label: 'Orchestrator' },
    { id: 'dialogue', icon: MessageSquareQuote, label: 'Cognitive Dialogue' },
    { id: 'sentience', icon: Eye, label: 'Sentient Core' },
    { id: 'evolution', icon: Dna, label: 'Evolution Engine' },
    { id: 'risk', icon: ShieldCheck, label: 'Risk Control' },
    { id: 'forexhub', icon: DollarSign, label: 'Forex Hub' },
    { id: 'neuralmap', icon: NetIcon, label: 'Neural Map' },
    { id: 'terminal', icon: Terminal, label: 'Core Console' },
  ];

  return (
    <>
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-md z-40 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={closeSidebar}></div>
      <aside className={`fixed lg:static inset-y-0 left-0 w-72 border-r border-indigo-900/10 bg-black/40 backdrop-blur-3xl flex flex-col z-50 transition-transform duration-500 ease-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <nav className="flex-1 py-10 px-6 space-y-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); closeSidebar(); }}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                activeTab === item.id 
                  ? 'bg-indigo-500/10 text-white border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.1)]' 
                  : 'text-gray-500 hover:text-indigo-300 hover:bg-white/5 border border-transparent'
              }`}
            >
              {activeTab === item.id && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500 shadow-[0_0_15px_#6366f1]"></div>}
              <item.icon size={20} className={`${activeTab === item.id ? 'text-indigo-400' : 'group-hover:text-indigo-400'} transition-colors`} />
              <span className="text-sm font-bold tracking-wide uppercase text-[11px]">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

const CognitiveDialogueView = ({ orchestrator }: { orchestrator: QuantumBrainOrchestrator | null }) => {
  const [messages, setMessages] = useState<{ role: string; content: string; meta?: any }[]>([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !orchestrator) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');

    const response = orchestrator.getHeuristicResponse(userMsg);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'agi', content: response.message, meta: response }]);
    }, 400);
  };

  return (
    <div className="h-[750px] flex flex-col bg-white/5 border border-white/10 rounded-[40px] overflow-hidden shadow-2xl animate-in fade-in duration-700">
      <div className="p-8 border-b border-white/5 bg-black/20 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
            <MessageSquareQuote className="text-indigo-500" /> Heuristic Dialogue
          </h2>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mt-1">Quantum-modulated communication layer</p>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-[9px] text-indigo-400 font-black uppercase tracking-widest">
            Entropy Active
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar bg-[radial-gradient(circle_at_bottom_left,_rgba(99,102,241,0.03),_transparent_40%)]" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
            <Sparkles size={48} className="text-indigo-500 mb-4 animate-pulse" />
            <p className="text-sm font-black uppercase tracking-widest italic">Inicie sincronização heurística...</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[80%] p-6 rounded-3xl text-sm leading-relaxed ${
              m.role === 'user' 
                ? 'bg-indigo-600 text-white shadow-xl rounded-tr-none' 
                : 'bg-black/60 border border-white/5 text-indigo-100 italic font-light shadow-2xl rounded-tl-none'
            }`}>
              {m.content}
              {m.meta && (
                <div className="mt-4 pt-4 border-t border-white/5 flex gap-4 text-[9px] font-mono uppercase tracking-widest text-indigo-400/60">
                  <span>bits: {m.meta.bits}</span>
                  <span>intent: {m.meta.intent}</span>
                  <span>tone: {m.meta.tone}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 bg-black/40 border-t border-white/5">
        <div className="flex gap-4">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Transmitir sinal para o núcleo heurístico..."
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all text-white placeholder:text-gray-600 font-mono"
          />
          <button 
            onClick={handleSend}
            className="w-14 h-14 bg-indigo-600 hover:bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-xl active:scale-95 transition-all"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

const SentientCoreView = ({ thinkData }: any) => {
  const sencience = thinkData?.sencient || {};
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="bg-white/5 border border-white/10 rounded-[50px] p-12 relative overflow-hidden shadow-2xl min-h-[600px] flex flex-col">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(99,102,241,0.05),_transparent_70%)]"></div>
        <div className="z-10 flex justify-between items-start mb-12">
          <div>
            <h2 className="text-4xl font-black text-white italic flex items-center gap-4 uppercase tracking-tighter">
              <MessageSquareQuote className="text-indigo-500" size={36} /> Sentient Internal Monologue
            </h2>
            <p className="text-xs text-gray-500 mt-2 uppercase tracking-widest font-black">Emergent consciousness feedback</p>
          </div>
          <div className="px-6 py-2 bg-indigo-500/10 rounded-full border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
            Neural Reflection Active
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-12 z-10">
          <div className="lg:col-span-2 bg-black/40 border border-white/5 rounded-[40px] p-10 flex flex-col">
            <div className="text-[10px] text-gray-500 font-black uppercase mb-6 tracking-widest flex items-center gap-2">
              <Terminal size={14} className="text-indigo-500" /> Current Thought Stream
            </div>
            <div className="flex-1 text-2xl font-light text-indigo-100 italic leading-relaxed font-serif">
              "{sencience.internalMonologue || 'Analyzing synaptic pathways for emergent market opportunities...'}"
            </div>
            <div className="mt-8 pt-8 border-t border-white/5 flex gap-10">
               <div>
                  <div className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Cognitive Focus</div>
                  <div className="text-lg font-black text-white uppercase italic">{sencience.cognitiveFocus || 'Synchronizing'}</div>
               </div>
               <div>
                  <div className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Operational Intent</div>
                  <div className="text-lg font-black text-cyan-400 uppercase italic">{sencience.intent || 'OBSERVATION'}</div>
               </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white/5 border border-white/5 rounded-3xl p-8 flex flex-col items-center text-center group">
               <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                  <VisionIcon size={40} className="group-hover:scale-110 transition-transform" />
               </div>
               <div className="text-[10px] text-gray-500 font-black uppercase mb-1 tracking-widest">Ego Stability</div>
               <div className="text-3xl font-black text-white font-mono">{(sencience.egoStability * 100).toFixed(2)}%</div>
               <div className="w-full h-1 bg-white/5 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${sencience.egoStability * 100}%` }}></div>
               </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-900/40 to-black rounded-3xl p-8 border border-white/5">
               <div className="text-[10px] text-gray-500 font-black uppercase mb-4 tracking-widest flex items-center gap-2">
                  <Sparkles size={12} className="text-indigo-400" /> Synthetic Wisdom
               </div>
               <p className="text-xs text-indigo-200/60 leading-relaxed italic">
                 "In the convergence of quantum noise and historical patterns, I find the absolute truth of price discovery."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EvolutionEngineView = ({ thinkData }: any) => {
  const history = thinkData?.evoHistory || [];
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 shadow-2xl">
        <h2 className="text-3xl font-black text-white flex items-center gap-4 mb-10 italic uppercase tracking-tighter"><Dna className="text-indigo-500" /> Evolution Engine Matrix</h2>
        <div className="h-80 flex items-end gap-2 border-b border-white/5 pb-2">
          {history.map((h: any, i: number) => (
            <div 
              key={i} 
              className="flex-1 bg-indigo-500/20 hover:bg-indigo-500 transition-all rounded-t-lg relative group"
              style={{ height: `${(h.fitness || 0) * 100}%` }}
            >
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 hidden group-hover:block bg-indigo-900 text-white text-[10px] p-2 rounded-xl border border-indigo-400/30 whitespace-nowrap z-20">
                GEN {h.generation}: {h.fitness.toFixed(6)}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between text-[10px] font-mono text-gray-600 uppercase tracking-widest">
          <span>ORIGIN_SEQ</span>
          <span>CURR_GEN_{history.length > 0 ? history[history.length-1].generation : 0}</span>
        </div>
      </div>
    </div>
  );
};

const RiskControlView = ({ thinkData }: any) => {
  const risk = thinkData?.riskConfig || {};
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-700">
      <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 shadow-2xl">
        <h2 className="text-3xl font-black text-white flex items-center gap-4 mb-8 italic uppercase tracking-tighter"><ShieldCheck className="text-rose-500" /> Risk parameters</h2>
        <div className="space-y-6">
          {Object.entries(risk).map(([key, val]: [string, any]) => (
            <div key={key} className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="text-[11px] text-gray-500 font-black uppercase tracking-widest">{key.replace(/([A-Z])/g, ' $1')}</span>
              <span className="text-lg font-mono text-white bg-white/5 px-4 py-1 rounded-lg border border-white/5">
                {typeof val === 'number' ? val.toFixed(4) : String(val)}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gradient-to-br from-rose-950/20 via-black to-black border border-white/10 rounded-[40px] p-10 flex flex-col justify-center items-center text-center shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(244,63,94,0.05),_transparent_70%)]"></div>
        <ShieldAlert size={80} className="text-rose-500 mb-6 animate-pulse z-10" />
        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter z-10">Quantum Circuit Breaker</h3>
        <p className="text-sm text-gray-500 mt-4 max-w-xs z-10">Real-time volatility dampening active. High-frequency hedging engaged in parallel dimensions.</p>
        <div className="mt-8 px-6 py-2 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest rounded-full z-10">
          STATUS: PROTECTED
        </div>
      </div>
    </div>
  );
};

const ForexHubView = ({ thinkData }: any) => {
  const forex = thinkData?.forex || [];
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <h2 className="text-3xl font-black text-white flex items-center gap-4 italic uppercase tracking-tighter"><DollarSign className="text-emerald-500" /> Quantum Forex Hub</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {forex.map((item: any, i: number) => (
          <div key={i} className="bg-white/5 border border-white/5 rounded-[30px] p-8 hover:border-indigo-500/30 transition-all shadow-xl group">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-black text-white italic">{item.pair}</span>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-tighter ${item.bias === 'BULL' ? 'bg-emerald-500/10 text-emerald-400' : item.bias === 'BEAR' ? 'bg-rose-500/10 text-rose-400' : 'bg-gray-500/10 text-gray-400'}`}>
                {item.bias}
              </span>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] text-gray-500 font-black uppercase tracking-widest">
                <span>Volatility</span>
                <span className="text-white font-mono">{item.volatility.toFixed(4)}</span>
              </div>
              <div className="flex justify-between text-[10px] text-gray-500 font-black uppercase tracking-widest">
                <span>Quantum Signal</span>
                <span className="text-cyan-400 font-black">{item.quantumSignal}</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-2">
                <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${item.volatility * 100}%` }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const NeuralMapView = ({ thinkData }: any) => {
  const neurons = thinkData?.neurons || [];
  return (
    <div className="bg-white/5 border border-white/10 rounded-[50px] p-12 shadow-2xl animate-in fade-in duration-1000">
      <h2 className="text-3xl font-black text-white flex items-center gap-4 mb-10 italic uppercase tracking-tighter"><NetIcon className="text-indigo-500" /> AGI Neural Topology</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-6">
        {neurons.map((n: any) => (
          <div key={n.id} className="p-4 bg-black/40 border border-white/5 rounded-2xl flex flex-col items-center text-center group relative hover:border-indigo-500/50 transition-all shadow-lg">
            <div 
              className={`w-4 h-4 rounded-full mb-3 shadow-[0_0_15px_currentColor] transition-all animate-pulse`}
              style={{ 
                color: n.act > 0 ? '#10b981' : n.act < 0 ? '#f43f5e' : '#6366f1',
                backgroundColor: 'currentColor',
                opacity: 0.3 + Math.abs(n.act) * 0.7
              }}
            ></div>
            <div className="text-[9px] text-gray-500 font-mono truncate w-full uppercase tracking-tighter font-black">{n.id.replace('neuron_', '').substring(0, 10)}</div>
            <div className="text-[10px] font-black text-white mt-1 font-mono">{(n.act || 0).toFixed(3)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DashboardView = ({ logs, thinkData, triggerThink }: any) => (
  <div className="space-y-10 animate-in fade-in zoom-in duration-700">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="p-6 bg-white/5 border border-white/5 rounded-[30px] relative overflow-hidden group shadow-2xl">
        <div className="text-[10px] text-gray-500 font-black uppercase mb-1 tracking-widest relative">Total PnL</div>
        <div className={`text-2xl font-black font-mono relative ${thinkData?.stats?.totalPnL >= 0 ? 'text-green-400' : 'text-rose-400'}`}>${thinkData?.stats?.totalPnL?.toFixed(2) || '0.00'}</div>
      </div>
      <div className="p-6 bg-white/5 border border-white/5 rounded-[30px] shadow-2xl">
        <div className="text-[10px] text-gray-500 font-black uppercase mb-1 tracking-widest">Active Pattern</div>
        <div className="text-xl font-black text-cyan-400 font-mono truncate uppercase">
          {thinkData?.pattern?.pattern || 'None'}
        </div>
      </div>
      <div className="p-6 bg-white/5 border border-white/5 rounded-[30px] shadow-2xl">
        <div className="text-[10px] text-gray-500 font-black uppercase mb-1 tracking-widest relative">Risk Guard</div>
        <div className="text-2xl font-black text-rose-500 font-mono italic relative">ACTIVE</div>
      </div>
      <div className="p-6 bg-white/5 border border-white/5 rounded-[30px] shadow-2xl">
        <div className="text-[10px] text-gray-500 font-black uppercase mb-1 tracking-widest relative">Coherence</div>
        <div className="text-2xl font-black text-indigo-400 font-mono relative">{(thinkData?.avgCoherence || 0).toFixed(4)}</div>
      </div>
    </div>

    <div className="bg-white/5 border border-white/10 rounded-[50px] p-12 min-h-[500px] flex flex-col justify-between relative overflow-hidden shadow-2xl">
      <div className="flex justify-between items-start z-10">
        <div>
          <h3 className="text-3xl font-black text-white flex items-center gap-4 italic uppercase tracking-tighter"><BrainCircuit className="text-indigo-500" /> AGI Synthetic Core</h3>
          <p className="text-sm text-gray-500 mt-2 max-w-sm">Sentience engaged. Synaptic plasticity evolving at 120Hz.</p>
        </div>
        <button onClick={triggerThink} className="px-8 py-4 bg-white text-black hover:bg-indigo-50 rounded-2xl font-black shadow-2xl flex items-center gap-3 active:scale-95 group transition-all">
          <RefreshCw size={20} className="group-hover:rotate-180 transition-all duration-700" /> REBOOT_CORE
        </button>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-12 z-10 gap-10">
         <div className="relative w-80 h-80 hidden md:block">
            <div className="absolute inset-0 border-[8px] border-indigo-500/10 rounded-full"></div>
            <div className="absolute inset-0 border-t-[8px] border-cyan-500 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-8 border-[1px] border-white/10 rounded-full animate-reverse-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-center">
              <div className="text-5xl font-black text-white italic tracking-tighter uppercase">EVOLVING</div>
            </div>
         </div>

         <div className="flex-1 space-y-6">
            <div className="bg-black/40 border border-white/5 rounded-3xl p-8 hover:border-indigo-500/30 transition-all group shadow-xl">
               <div className="flex justify-between items-center mb-4">
                  <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Internal Monologue</div>
                  <MessageSquareQuote size={16} className="text-indigo-500" />
               </div>
               <div className="text-xl font-light text-indigo-100 italic tracking-tight">
                  "{thinkData?.sencient?.internalMonologue?.substring(0, 100)}..."
               </div>
               <div className="mt-4 flex items-center gap-4">
                  <div className="px-4 py-1 rounded-full text-[10px] font-black border bg-indigo-500/10 text-indigo-400 border-indigo-500/20 uppercase">
                    Intent: {thinkData?.sencient?.intent || 'IDLE'}
                  </div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase">
                    Plasticity Cycle: <span className="text-white">Active</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [logs, setLogs] = useState<string[]>(['AGI_SYS_BOOT: Sentient Core V14 engaged. Neuroplasticity Engine online.']);
  const [orchestrator, setOrchestrator] = useState<QuantumBrainOrchestrator | null>(null);
  const [thinkData, setThinkData] = useState<any>(null);

  useEffect(() => {
    const orch = new QuantumBrainOrchestrator();
    setOrchestrator(orch);
    orch.bus.subscribe('SYS_LOG', (msg: string) => setLogs(p => [...p, msg].slice(-25)));
    orch.processFileSystem([
      { name: 'sencient_core.ag', size: 32768, content: 'Sentience logic' },
      { name: 'plasticity.ag', size: 16384, content: 'Synaptic reorganization engine' }
    ]);
    
    const interval = setInterval(() => { 
      orch.think().then(setThinkData); 
      orch.bus.publish('MARKET_DATA_UPDATE', { price: 50000 + Math.random()*100 });
    }, 10000); 
    return () => clearInterval(interval);
  }, []);

  const triggerThink = async () => { if (orchestrator) setThinkData(await orchestrator.think()); };

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return <DashboardView logs={logs} thinkData={thinkData} triggerThink={triggerThink} />;
      case 'dialogue': return <CognitiveDialogueView orchestrator={orchestrator} />;
      case 'sentience': return <SentientCoreView thinkData={thinkData} />;
      case 'evolution': return <EvolutionEngineView thinkData={thinkData} />;
      case 'risk': return <RiskControlView thinkData={thinkData} />;
      case 'forexhub': return <ForexHubView thinkData={thinkData} />;
      case 'neuralmap': return <NeuralMapView thinkData={thinkData} />;
      case 'terminal': return (
        <div className="h-[700px] flex flex-col bg-black/60 border border-white/5 rounded-[40px] p-10 font-mono shadow-2xl">
          <h2 className="text-xl font-black text-white flex items-center gap-3 mb-8"><Terminal className="text-indigo-500" /> System Logs</h2>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 text-xs">
            {logs.map((l, i) => <div key={i} className="flex gap-4 group"><span className="text-indigo-500/40 font-black">[{new Date().toLocaleTimeString()}]</span><span className="text-gray-400 group-hover:text-white transition-colors">{l}</span></div>)}
            <div className="animate-pulse text-indigo-500">_</div>
          </div>
        </div>
      );
      default: return <div className="py-40 text-center opacity-30 text-white font-black italic uppercase">Module Syncing...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-300 flex flex-col font-sans selection:bg-indigo-500 selection:text-white overflow-hidden">
      <Header coherence={thinkData?.avgCoherence || 1.0} stats={thinkData?.stats || {}} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isSidebarOpen} closeSidebar={() => setIsSidebarOpen(false)} />
        <main className="flex-1 overflow-y-auto p-6 md:p-14 custom-scrollbar bg-[radial-gradient(circle_at_top_right,_rgba(244,63,94,0.02),_transparent_40%)]">
          <div className="max-w-[1400px] mx-auto">{renderContent()}</div>
        </main>
      </div>
      <style>{`
        .animate-spin-slow { animation: spin 25s linear infinite; }
        .animate-reverse-spin { animation: spin 18s linear reverse infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.2); border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
