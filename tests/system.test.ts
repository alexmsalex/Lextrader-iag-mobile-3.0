
import { Population } from '../evolution/populations';
import { ConsensusEngine } from '../oracle/consensus';

// Define global test runners to satisfy TypeScript compiler when @types/jest is missing
declare const describe: any;
declare const test: any;
declare const expect: any;

describe('Neural Learning System Tests', () => {
  test('Population should initialize with correct size', () => {
    const size = 20;
    const pop = new Population(size);
    expect(pop.genomes.length).toBe(size);
  });

  test('Consensus engine should return valid action', () => {
    const engine = new ConsensusEngine();
    const predictions = [
      { sourceId: 'tv', action: 'BUY', confidence: 0.9 },
      { sourceId: 'gn', action: 'BUY', confidence: 0.8 }
    ];
    // @ts-ignore
    const result = engine.calculate(predictions);
    expect(['BUY', 'SELL', 'HOLD']).toContain(result);
  });
});
