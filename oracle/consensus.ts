
export interface MarketSource {
  id: string;
  name: string;
  weight: number;
  lastReliability: number;
  category: 'on-chain' | 'exchange' | 'social' | 'sentiment' | 'technical';
  indicatorValue?: number;
  signal?: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
}

export interface Prediction {
  sourceId: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  value?: number;
}

export class ConsensusEngine {
  sources: MarketSource[] = [
    // 10 Key Indicators
    { id: 'rsi', name: 'RSI (14)', weight: 2.0, lastReliability: 0.98, category: 'technical' },
    { id: 'macd', name: 'MACD (12,26,9)', weight: 1.8, lastReliability: 0.95, category: 'technical' },
    { id: 'ema_fast', name: 'EMA (20)', weight: 1.5, lastReliability: 0.92, category: 'technical' },
    { id: 'ema_slow', name: 'EMA (200)', weight: 2.2, lastReliability: 0.99, category: 'technical' },
    { id: 'bollinger', name: 'Bollinger Bands', weight: 1.6, lastReliability: 0.94, category: 'technical' },
    { id: 'stochastic', name: 'Stochastic Oscillator', weight: 1.4, lastReliability: 0.90, category: 'technical' },
    { id: 'atr', name: 'ATR (Volatility)', weight: 1.2, lastReliability: 0.96, category: 'technical' },
    { id: 'adx', name: 'ADX (Trend Strength)', weight: 1.7, lastReliability: 0.93, category: 'technical' },
    { id: 'volume', name: 'Volume Profile', weight: 1.9, lastReliability: 0.97, category: 'technical' },
    { id: 'obv', name: 'On-Balance Volume', weight: 1.5, lastReliability: 0.91, category: 'technical' },
    
    // Sentiment & On-chain
    { id: 'fear_greed', name: 'Fear & Greed', weight: 1.2, lastReliability: 0.88, category: 'sentiment' },
    { id: 'whale_flow', name: 'Whale Flow', weight: 2.5, lastReliability: 0.95, category: 'on-chain' }
  ];

  generateMockPredictions(): Prediction[] {
    return this.sources.map(s => {
      const confidence = 0.5 + Math.random() * 0.5;
      let action: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
      let value = 0;

      switch(s.id) {
        case 'rsi': 
          value = 20 + Math.random() * 60;
          action = value > 70 ? 'SELL' : value < 30 ? 'BUY' : 'HOLD';
          break;
        case 'ema_fast':
        case 'ema_slow':
          value = 50000 + (Math.random() - 0.5) * 5000;
          action = Math.random() > 0.5 ? 'BUY' : 'SELL';
          break;
        default:
          value = Math.random() * 100;
          action = Math.random() > 0.6 ? 'BUY' : Math.random() > 0.6 ? 'SELL' : 'HOLD';
      }

      return { sourceId: s.id, action, confidence, value };
    });
  }

  calculate(predictions: Prediction[]) {
    let totalScore = 0;
    let weightedSum = 0;

    predictions.forEach(p => {
      const source = this.sources.find(s => s.id === p.sourceId);
      if (!source) return;

      const multiplier = source.weight * source.lastReliability;
      const direction = p.action === 'BUY' ? 1 : p.action === 'SELL' ? -1 : 0;
      
      weightedSum += direction * p.confidence * multiplier;
      totalScore += multiplier;
    });

    const normalized = weightedSum / (totalScore || 1);
    const threshold = 0.15;
    
    if (normalized > threshold) return 'BUY';
    if (normalized < -threshold) return 'SELL';
    return 'HOLD';
  }

  getConsensusStrength(predictions: Prediction[]): number {
    if (predictions.length === 0) return 0;
    const actions = predictions.map(p => p.action);
    const mode = actions.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const maxVotes = Math.max(...Object.values(mode));
    return maxVotes / predictions.length;
  }
}
