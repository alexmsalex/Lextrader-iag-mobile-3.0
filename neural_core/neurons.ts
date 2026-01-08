
export enum NeuronType {
  CORE = 'CORE',
  ANALYSIS = 'ANALYSIS',
  QUANTUM = 'QUANTUM',
  INPUT = 'INPUT',
  OUTPUT = 'OUTPUT',
  TREND = 'TREND',
  VOLATILITY = 'VOLATILITY',
  LIQUIDITY = 'LIQUIDITY',
  MEMORY = 'MEMORY',
  META = 'META',
  STRATEGY = 'STRATEGY',
  PATTERN = 'PATTERN',
  EPISODIC = 'EPISODIC',
  INDICATOR = 'INDICATOR'
}

export class Neuron {
  id: string;
  bias: number;
  activation: number = 0;
  type: NeuronType;

  constructor(id: string, bias: number = 0, type: NeuronType = NeuronType.CORE) {
    this.id = id;
    this.bias = bias;
    this.type = type;
  }

  activate(inputs: number[], weights: number[]) {
    const sum = inputs.reduce((acc, val, i) => acc + val * (weights[i] || 1), 0) + this.bias;
    this.activation = Math.tanh(sum); 
    return this.activation;
  }
}

export class AnalysisNeuron extends Neuron {
  score: number = 0.5; 
  confidence: number = 0;

  constructor(id: string, bias: number = 0, type: NeuronType = NeuronType.ANALYSIS) {
    super(id, bias, type);
  }

  setSignal(score: number, confidence: number) {
    this.score = score;
    this.confidence = confidence;
    this.activation = (score * 2 - 1) * confidence;
  }
}

export class IndicatorNeuron extends AnalysisNeuron {
  value: number = 0;
  signalType: 'BULLISH' | 'BEARISH' | 'NEUTRAL' = 'NEUTRAL';

  constructor(id: string, bias: number = 0) {
    super(id, bias, NeuronType.INDICATOR);
  }

  updateIndicator(value: number, signal: 'BULLISH' | 'BEARISH' | 'NEUTRAL', confidence: number) {
    this.value = value;
    this.signalType = signal;
    const score = signal === 'BULLISH' ? 0.8 : signal === 'BEARISH' ? 0.2 : 0.5;
    this.setSignal(score, confidence);
  }
}

export class TrendNeuron extends AnalysisNeuron {
  constructor(id: string, bias: number = 0) {
    super(id, bias, NeuronType.TREND);
  }
}

export class VolatilityNeuron extends AnalysisNeuron {
  constructor(id: string, bias: number = 0) {
    super(id, bias, NeuronType.VOLATILITY);
  }
}

export class LiquidityNeuron extends AnalysisNeuron {
  constructor(id: string, bias: number = 0) {
    super(id, bias, NeuronType.LIQUIDITY);
  }
}

export class EpisodicMemoryNeuron extends Neuron {
  recallStrength: number = 0;

  constructor(id: string, bias: number = 0) {
    super(id, bias, NeuronType.EPISODIC);
  }

  injectRecall(recalledActivation: number, strength: number) {
    this.recallStrength = strength;
    this.activation = recalledActivation * strength;
  }
}

export class PatternNeuron extends AnalysisNeuron {
  patternName: string = 'NONE';
  
  constructor(id: string, bias: number = 0) {
    super(id, bias, NeuronType.PATTERN);
  }

  setPattern(name: string, probability: number) {
    this.patternName = name;
    this.activation = probability;
  }
}

export class StrategyNeuron extends AnalysisNeuron {
  efficiency: number = 0.5;
  pnl: number = 0;

  constructor(id: string, bias: number = 0) {
    super(id, bias, NeuronType.STRATEGY);
  }

  evaluate(marketData: any) {
    this.efficiency = Math.min(1, Math.max(0, this.efficiency + (Math.random() - 0.5) * 0.1));
  }
}

export class MemoryNeuron extends Neuron {
  history: number[] = [];
  capacity: number = 10;

  constructor(id: string, bias: number = 0) {
    super(id, bias, NeuronType.MEMORY);
  }

  activate(inputs: number[], weights: number[]) {
    const current = super.activate(inputs, weights);
    this.history.push(current);
    if (this.history.length > this.capacity) this.history.shift();
    const avg = this.history.reduce((a, b) => a + b, 0) / this.history.length;
    this.activation = (current + avg) / 2;
    return this.activation;
  }
}

export class MetaNeuron extends Neuron {
  constructor(id: string, bias: number = 0) {
    super(id, bias, NeuronType.META);
  }

  updateFromNodes(nodes: Neuron[]) {
    if (nodes.length === 0) return;
    const activations = nodes.map(n => n.activation);
    const mean = activations.reduce((a, b) => a + b, 0) / activations.length;
    const variance = activations.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / activations.length;
    this.activation = Math.tanh(variance * 10 - 1);
  }
}
