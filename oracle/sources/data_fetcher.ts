
import { Prediction } from '../consensus';

export class DataFetcher {
  async fetchExternalSignals(symbol: string): Promise<Prediction[]> {
    // Simulated multi-source data fetching
    return [
      { sourceId: 'tv', action: Math.random() > 0.5 ? 'BUY' : 'SELL', confidence: Math.random() },
      { sourceId: 'gn', action: Math.random() > 0.4 ? 'BUY' : 'HOLD', confidence: Math.random() },
      { sourceId: 'cg', action: Math.random() > 0.6 ? 'SELL' : 'HOLD', confidence: Math.random() },
      { sourceId: 'st', action: Math.random() > 0.3 ? 'BUY' : 'SELL', confidence: Math.random() }
    ];
  }
}
