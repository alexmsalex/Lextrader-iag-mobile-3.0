
import { Genome, generateDNA, dnaToWeights, mutate, crossover } from './genomes';

export class Population {
  genomes: Genome[] = [];
  generation: number = 0;
  size: number;

  constructor(size: number = 50) {
    this.size = size;
    this.initialize();
  }

  initialize() {
    this.genomes = Array.from({ length: this.size }, (_, i) => {
      const dna = generateDNA();
      return {
        id: `gnm_${this.generation}_${i}`,
        dna,
        weights: dnaToWeights(dna),
        fitness: Math.random()
      };
    });
  }

  evolve() {
    this.generation++;
    // Sort by fitness (desc)
    this.genomes.sort((a, b) => b.fitness - a.fitness);
    
    const elites = this.genomes.slice(0, Math.floor(this.size * 0.1));
    const nextGen: Genome[] = [...elites];

    while (nextGen.length < this.size) {
      const parentA = elites[Math.floor(Math.random() * elites.length)];
      const parentB = elites[Math.floor(Math.random() * elites.length)];
      let childDna = crossover(parentA.dna, parentB.dna);
      childDna = mutate(childDna);
      
      nextGen.push({
        id: `gnm_${this.generation}_${nextGen.length}`,
        dna: childDna,
        weights: dnaToWeights(childDna),
        fitness: 0 // To be evaluated
      });
    }

    this.genomes = nextGen;
    return this.genomes;
  }
}
