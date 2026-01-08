
export class Synapse {
  sourceId: string;
  targetId: string;
  weight: number;
  learningRate: number = 0.01;
  
  // Plasticity metrics
  plasticity: number = 1.0; // Ability to change
  stability: number = 0.0;  // Long-term strength
  usageCount: number = 0;
  health: number = 1.0;     // Pruning metric

  constructor(source: string, target: string, weight: number = Math.random() - 0.5) {
    this.sourceId = source;
    this.targetId = target;
    this.weight = weight;
  }

  adjust(delta: number) {
    // Plasticity decreases as synapse stabilizes through use
    const effectiveDelta = delta * this.learningRate * this.plasticity;
    this.weight += effectiveDelta;
    this.usageCount++;
    
    // Hebbian-lite: use strengthens stability
    if (Math.abs(delta) > 0.01) {
      this.stability = Math.min(1.0, this.stability + 0.001);
      this.plasticity = Math.max(0.1, this.plasticity - 0.0005);
    }
  }

  decay(rate: number = 0.0001) {
    // Stability protects against weight decay
    const decayFactor = rate * (1 - this.stability);
    this.weight *= (1 - decayFactor);
    this.health -= rate * 0.5;
    
    // Reset health if used
    if (this.usageCount > 0) {
      this.health = Math.min(1.0, this.health + 0.1);
      this.usageCount = 0;
    }
  }
}
