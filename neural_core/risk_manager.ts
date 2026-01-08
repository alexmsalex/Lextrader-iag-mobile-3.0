
export interface RiskParameters {
  maxDrawdown: number;
  stopLossPercent: number;
  takeProfitPercent: number;
  quantumSafetyFactor: number;
}

export class RiskManager {
  private config: RiskParameters;
  private currentDrawdown: number = 0;

  constructor(config: RiskParameters = {
    maxDrawdown: 0.15,
    stopLossPercent: 0.02,
    takeProfitPercent: 0.06,
    quantumSafetyFactor: 0.5
  }) {
    this.config = config;
  }

  evaluateTradeRisk(pnl: number, quantumCoherence: number): { allowed: boolean, size: number } {
    // If coherence is low, reduce size (Quantum Caution)
    const baseSize = 1.0;
    const adjustedSize = baseSize * (quantumCoherence * this.config.quantumSafetyFactor + 0.5);
    
    // Stop-loss logic
    if (pnl < -this.config.stopLossPercent) {
      return { allowed: false, size: 0 };
    }

    return { allowed: true, size: adjustedSize };
  }

  updateParameters(newParams: Partial<RiskParameters>) {
    this.config = { ...this.config, ...newParams };
  }

  getConfig() {
    return { ...this.config };
  }
}
