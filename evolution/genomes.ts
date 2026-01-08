
export interface Genome {
  id: string;
  dna: string;
  weights: number[];
  fitness: number;
}

export const generateDNA = (length: number = 32): string => {
  let dna = '';
  for (let i = 0; i < length; i++) {
    dna += Math.random() > 0.5 ? '1' : '0';
  }
  return dna;
};

export const dnaToWeights = (dna: string): number[] => {
  const chunks = dna.match(/.{1,4}/g) || [];
  return chunks.map(chunk => parseInt(chunk, 2) / 15);
};

export const mutate = (dna: string, rate: number = 0.05): string => {
  return dna.split('').map(bit => 
    Math.random() < rate ? (bit === '0' ? '1' : '0') : bit
  ).join('');
};

export const crossover = (parentA: string, parentB: string): string => {
  const mid = Math.floor(Math.random() * parentA.length);
  return parentA.substring(0, mid) + parentB.substring(mid);
};
