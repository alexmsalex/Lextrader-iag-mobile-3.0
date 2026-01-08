
import { Genome } from './genomes';

export interface EnvironmentConfig {
  name: string;
  volatility: number;
  complexity: number;
}

export class NeuralEnvironment {
  config: EnvironmentConfig;

  constructor(config: EnvironmentConfig) {
    this.config = config;
  }

  evaluateFitness(genome: Genome): number {
    // Fitness calculation based on weights alignment with environment complexity
    const weightSum = genome.weights.reduce((a, b) => a + b, 0);
    const score = Math.abs(weightSum - (this.config.complexity * 10)) / 10;
    return Math.max(0, 1 - score);
  }

  simulateStep() {
    // Dynamic environment changes
    this.config.volatility += (Math.random() - 0.5) * 0.1;
    this.config.complexity = Math.max(0, this.config.complexity + (Math.random() - 0.5) * 0.2);
  }
}
