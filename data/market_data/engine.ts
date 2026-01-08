
import { Population } from './populations';
import { NeuralEnvironment } from './environments';
import { AdaptiveEvolution } from './strategies/adaptive_evolution';

export class NeuralEvolutionEngine {
  private static instance: NeuralEvolutionEngine;
  private population: Population | null = null;
  private environment: NeuralEnvironment | null = null;
  private strategy: AdaptiveEvolution;
  
  public history: { generation: number, fitness: number }[] = [];

  private constructor() {
    this.strategy = new AdaptiveEvolution();
  }

  public static get_instance(): NeuralEvolutionEngine {
    if (!NeuralEvolutionEngine.instance) {
      NeuralEvolutionEngine.instance = new NeuralEvolutionEngine();
    }
    return NeuralEvolutionEngine.instance;
  }

  async initialize(popSize: number = 50) {
    this.population = new Population(popSize);
    this.environment = new NeuralEnvironment({
      name: "Core_AGI_Env",
      volatility: 0.5,
      complexity: 0.7
    });
    console.log("NeuralEvolutionEngine: Initialized.");
  }

  async create_and_evolve(name: string, generations: number, strategy: string, population_size: number) {
    if (!this.population) await this.initialize(population_size);
    if (!this.environment) return;

    for (let i = 0; i < generations; i++) {
      const results = this.strategy.process(this.population!, this.environment!);
      this.environment.simulateStep();
      
      const bestFitness = Math.max(...this.population!.genomes.map(g => g.fitness));
      this.history.push({ generation: i, fitness: bestFitness });
      
      if (this.history.length > 100) this.history.shift();
    }
    
    return `env_${name.replace(/\s+/g, '_')}`;
  }

  getPopulation() { return this.population; }
  getEnvironment() { return this.environment; }
}
