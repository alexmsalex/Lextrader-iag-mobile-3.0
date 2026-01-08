
import { Population } from '../populations';
import { NeuralEnvironment } from '../environments';

export class AdaptiveEvolution {
  stagnationCounter: number = 0;
  lastBestFitness: number = 0;
  baseMutationRate: number = 0.05;

  process(population: Population, environment: NeuralEnvironment) {
    // Evaluate fitness
    population.genomes.forEach(g => {
      g.fitness = environment.evaluateFitness(g);
    });

    const currentBest = Math.max(...population.genomes.map(g => g.fitness));

    if (currentBest <= this.lastBestFitness) {
      this.stagnationCounter++;
    } else {
      this.stagnationCounter = 0;
      this.lastBestFitness = currentBest;
    }

    // Adapt mutation rate: if stagnated, increase randomness
    const adaptedRate = this.stagnationCounter > 5 
      ? Math.min(0.5, this.baseMutationRate * (1 + this.stagnationCounter * 0.1))
      : this.baseMutationRate;

    return {
      nextGen: population.evolve(),
      mutationRate: adaptedRate,
      stagnation: this.stagnationCounter
    };
  }
}
