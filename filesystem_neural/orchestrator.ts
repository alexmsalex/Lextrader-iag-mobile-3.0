
import { NeuralBus } from './neural_bus';
import { FileNeuronMapper } from './neuron_mapper';
import { Network } from '../neural_core/networks';
import { 
  AnalysisNeuron, 
  TrendNeuron, 
  VolatilityNeuron, 
  LiquidityNeuron,
  MemoryNeuron,
  MetaNeuron,
  StrategyNeuron,
  PatternNeuron,
  EpisodicMemoryNeuron,
  IndicatorNeuron
} from '../neural_core/neurons';
import { DeepAnalysisEngine, ForexAnalysis, PatternResult } from '../oracle/analysis/deep_analysis';
import { BehavioralAnalytics } from '../oracle/analysis/behavioral_analytics';
import { ConsensusEngine, Prediction } from '../oracle/consensus';
import { RiskManager } from '../neural_core/risk_manager';
import { SencientEngine } from '../neural_core/sencient';
import { NeuroPlasticityEngine } from '../neural_core/neuro_plasticidade';
import { NeuralEvolutionEngine } from '../evolution/engine';
import { StateSerializer } from '../utils/serialization';
import { QuantumRegister, decayCoherence } from '../quantum/quantum_states';
import { QuantumHeuristicAgent } from '../neural_core/heuristic_agent';

export class QuantumBrainOrchestrator {
  bus: NeuralBus;
  mapper: FileNeuronMapper;
  brain: Network;
  oracle: DeepAnalysisEngine;
  behavioral: BehavioralAnalytics;
  consensus: ConsensusEngine;
  risk: RiskManager;
  sencience: SencientEngine;
  plasticity: NeuroPlasticityEngine;
  evoEngine: NeuralEvolutionEngine;
  heuristicAgent: QuantumHeuristicAgent;
  quantumRegisters: Map<string, QuantumRegister> = new Map();
  tradeStats = {
    totalPnL: 0,
    winRate: 0,
    activeStrategies: 0
  };
  currentPattern: PatternResult | null = null;
  currentSentiment: number = 0.5;
  currentPredictions: Prediction[] = [];
  
  forexPairs: string[] = [
    'EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CHF', 
    'USD/CAD', 'NZD/USD', 'EUR/GBP', 'EUR/JPY', 'GBP/JPY', 
    'EUR/AUD', 'GBP/CAD', 'AUD/JPY', 'EUR/CHF', 'CAD/JPY',
    'AUD/CAD', 'AUD/NZD', 'CAD/CHF', 'EUR/NZD', 'GBP/NZD',
    'GBP/CHF', 'NZD/CAD', 'NZD/CHF', 'USD/MXN', 'USD/ZAR',
    'USD/SGD', 'USD/HKD', 'EUR/TRY', 'EUR/NOK', 'XAU/USD'
  ];
  forexAnalyses: ForexAnalysis[] = [];
  private lastReflectTime: number = 0;
  private lastAnalysisTime: number = 0;

  constructor() {
    this.bus = new NeuralBus();
    this.mapper = new FileNeuronMapper();
    this.brain = new Network('root_brain');
    this.oracle = new DeepAnalysisEngine();
    this.behavioral = new BehavioralAnalytics();
    this.consensus = new ConsensusEngine();
    this.risk = new RiskManager();
    this.sencience = new SencientEngine();
    this.plasticity = new NeuroPlasticityEngine();
    this.evoEngine = NeuralEvolutionEngine.get_instance();
    this.heuristicAgent = new QuantumHeuristicAgent();
    
    this.initAnalysisNeurons();
    this.initStrategyLayer();
    this.initIndicatorLayer();
    this.initQuantumSystems();
    this.setupListeners();
    this.loadState();
    this.initForexSim();
    this.startEvolution();
  }

  private async startEvolution() {
    await this.evoEngine.initialize(50);
    this.evoEngine.create_and_evolve("Main_Evolution_Chain", 10, "NEUROEVOLUTION", 50);
  }

  private initForexSim() {
    this.forexAnalyses = this.forexPairs.map(pair => ({
      pair,
      bias: Math.random() > 0.6 ? 'BULL' : Math.random() > 0.4 ? 'BEAR' : 'NEUTRAL',
      volatility: Math.random(),
      macroFactors: ['CPI Delta', 'Yield Spread', 'Trade Balance'],
      quantumSignal: Math.floor(Math.random() * 100)
    }));
  }

  private initIndicatorLayer() {
    const indicators = ['rsi', 'macd', 'ema_fast', 'ema_slow', 'bollinger', 'stochastic', 'atr', 'adx', 'volume', 'obv'];
    indicators.forEach(id => {
      this.brain.addNeuron(new IndicatorNeuron(`indicator_${id}`));
      this.brain.connect(`indicator_${id}`, 'analysis_market_sentiment', 0.2);
    });
  }

  private initStrategyLayer() {
    this.brain.addNeuron(new StrategyNeuron('strategy_scalper_hf'));
    this.brain.addNeuron(new StrategyNeuron('strategy_trend_momentum'));
    this.brain.addNeuron(new StrategyNeuron('strategy_mean_reversion'));
    this.brain.addNeuron(new StrategyNeuron('strategy_sentiment_arb'));
    this.brain.addNeuron(new PatternNeuron('pattern_recognition_core'));
    this.brain.addNeuron(new EpisodicMemoryNeuron('memory_recall_gate'));

    this.brain.connect('analysis_market_sentiment', 'strategy_sentiment_arb', 0.9);
    this.brain.connect('analysis_trend_momentum', 'strategy_trend_momentum', 0.85);
    this.brain.connect('analysis_risk_volatility', 'strategy_mean_reversion', 0.7);
    this.brain.connect('analysis_liquidity_depth', 'strategy_scalper_hf', 0.95);
    this.brain.connect('pattern_recognition_core', 'strategy_trend_momentum', 0.5);
    this.brain.connect('memory_recall_gate', 'analysis_market_sentiment', 0.3);
  }

  private initQuantumSystems() {
    const domains = ['market', 'behavior', 'evolution', 'trading'];
    domains.forEach(domain => {
      this.quantumRegisters.set(domain, {
        id: `qreg_${domain}`,
        coherence: 1.0,
        probability: 0.5,
        phase: Math.random() * Math.PI * 2,
        harmonics: [Math.random(), Math.random(), Math.random()],
        flux: Math.random() * 0.1
      });
    });
  }

  private async loadState() {
    try {
      const saved = await StateSerializer.loadFromStorage<any>('lextrader_neural_state');
      if (saved) {
        if (saved.tradeStats) this.tradeStats = saved.tradeStats;
        this.bus.publish('SYS_LOG', 'Orchestrator: Neural fabric state restored.');
      }
    } catch (error) {
      this.bus.publish('SYS_LOG', 'Orchestrator: Restoration failed.');
    }
  }

  private initAnalysisNeurons() {
    this.brain.addNeuron(new AnalysisNeuron('analysis_market_sentiment'));
    this.brain.addNeuron(new AnalysisNeuron('analysis_behavioral_risk'));
    this.brain.addNeuron(new AnalysisNeuron('analysis_quantum_drift'));
    this.brain.addNeuron(new TrendNeuron('analysis_trend_momentum'));
    this.brain.addNeuron(new VolatilityNeuron('analysis_risk_volatility'));
    this.brain.addNeuron(new LiquidityNeuron('analysis_liquidity_depth'));
    this.brain.addNeuron(new MemoryNeuron('memory_sentiment_buffer'));
    this.brain.addNeuron(new MetaNeuron('meta_stability_monitor'));
  }

  private setupListeners() {
    this.bus.subscribe('MARKET_DATA_UPDATE', async (data) => {
      const now = Date.now();
      if (now - this.lastAnalysisTime < 10000) return;
      this.lastAnalysisTime = now;

      const avgCoherence = this.getAverageCoherence();
      this.currentPredictions = this.consensus.generateMockPredictions();
      
      this.currentPredictions.forEach(p => {
        const neuron = this.brain.getNeuron<IndicatorNeuron>(`indicator_${p.sourceId}`);
        if (neuron) {
          const signalType: 'BULLISH' | 'BEARISH' | 'NEUTRAL' = 
            p.action === 'BUY' ? 'BULLISH' : 
            p.action === 'SELL' ? 'BEARISH' : 'NEUTRAL';
          neuron.updateIndicator(p.value || 0, signalType, p.confidence);
        }
      });

      const selectedPair = this.forexPairs[Math.floor(Math.random() * this.forexPairs.length)];
      this.oracle.analyzeForexPair(selectedPair, { mockData: true }).then(analysis => {
          const idx = this.forexAnalyses.findIndex(a => a.pair === analysis.pair);
          if (idx !== -1) this.forexAnalyses[idx] = analysis;
      });

      try {
        const [sentiment, behavior, pattern] = await Promise.all([
          this.oracle.analyzeMarketContext({ market: data, indicators: this.currentPredictions }),
          this.behavioral.analyzeBehavior(data),
          this.oracle.analyzeChartPatterns(Array.from({length: 10}, () => ({price: 50000 + Math.random()*1000})))
        ]);
        
        this.currentSentiment = sentiment.sentiment;
        this.currentPattern = pattern;

        const patternNeuron = this.brain.getNeuron<PatternNeuron>('pattern_recognition_core');
        if (patternNeuron) patternNeuron.setPattern(pattern.pattern, pattern.probability);

        this.brain.propagate();
        this.plasticity.optimize(this.brain);
        this.updatePnLWithRisk(sentiment.sentiment, avgCoherence);
        
        if (now - this.lastReflectTime > 30000) {
          this.sencience.reflect({
            pnl: this.tradeStats.totalPnL,
            coherence: avgCoherence,
            fitness: Math.max(...(this.evoEngine.getPopulation()?.genomes.map(g => g.fitness) || [0])),
            pattern: pattern.pattern
          });
          this.lastReflectTime = now;
        }

        this.bus.publish('AGI_THOUGHT_COMPLETE', { sentiment, behavior, pattern });
      } catch (error) {
        this.bus.publish('SYS_LOG', 'Orchestrator: Analysis pipeline failure - backing off.');
      }
    });
  }

  private getAverageCoherence() {
    return Array.from(this.quantumRegisters.values()).reduce((a, b) => a + b.coherence, 0) / this.quantumRegisters.size;
  }

  private updatePnLWithRisk(marketSentiment: number, coherence: number) {
    let totalDelta = 0;
    this.brain.neurons.forEach(n => {
      if (n instanceof StrategyNeuron) {
        const riskEval = this.risk.evaluateTradeRisk(n.pnl, coherence);
        if (riskEval.allowed) {
          const success = (n.activation > 0 && marketSentiment > 0.5) || (n.activation < 0 && marketSentiment < 0.5);
          const pnlDelta = (success ? Math.random() * 0.1 : -Math.random() * 0.08) * riskEval.size;
          n.pnl += pnlDelta;
          totalDelta += pnlDelta;
        }
      }
    });
    this.tradeStats.totalPnL += totalDelta;
  }

  async think() {
    this.quantumRegisters.forEach(reg => decayCoherence(reg, 0.003));
    this.brain.propagate();
    this.evoEngine.create_and_evolve("Realtime_Cycle", 1, "ADAPTIVE", 50);

    return {
      neurons: this.getFlattenedNeuronsDetailed(),
      synapses: this.getSynapsesDetailed(),
      stats: this.tradeStats,
      avgCoherence: this.getAverageCoherence(),
      forex: this.forexAnalyses,
      predictions: this.currentPredictions,
      evoHistory: this.evoEngine.history,
      riskConfig: this.risk.getConfig(),
      pattern: this.currentPattern,
      sencient: this.sencience.getCurrentState()
    };
  }

  private getFlattenedNeuronsDetailed() {
    const list: any[] = [];
    const recurse = (net: Network) => {
      net.neurons.forEach(n => list.push({ 
        id: n.id, act: n.activation, type: n.type, pnl: (n as any).pnl, 
        efficiency: (n as any).efficiency, value: (n as any).value, signalType: (n as any).signalType,
        patternName: (n as any).patternName
      }));
      net.subNetworks.forEach(sub => recurse(sub));
    };
    recurse(this.brain);
    return list;
  }

  private getSynapsesDetailed() {
    const list: any[] = [];
    const recurse = (net: Network) => {
      net.synapses.forEach(s => list.push({ source: s.sourceId, target: s.targetId, weight: s.weight }));
      net.subNetworks.forEach(sub => recurse(sub));
    };
    recurse(this.brain);
    return list;
  }

  async processFileSystem(files: any[]) {
    files.forEach(f => {
      const neuron = this.mapper.mapFileToNeuron(f.name, f.size, f.content);
      this.brain.addNeuron(neuron);
    });
  }

  getHeuristicResponse(text: string) {
    return this.heuristicAgent.respond(text);
  }
}
