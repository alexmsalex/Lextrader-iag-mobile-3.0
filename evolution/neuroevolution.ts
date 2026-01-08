
import { Population } from '../populations';
import { NeuralEnvironment } from '../environments';

export const runNeuroevolutionCycle = (population: Population, environment: NeuralEnvironment) => {
  // Evaluate all genomes
  population.genomes.forEach(genome => {
    genome.fitness = environment.evaluateFitness(genome);
  });

  // Sort and evolve
  return population.evolve();
};
