
import { QuantumBrainOrchestrator } from '../filesystem_neural/orchestrator';
import { Population } from '../evolution/populations';

async function main() {
  console.log("Initializing Quantum-Neural System...");

  // 1. Initialize the population
  const pop = new Population(100);
  console.log(`Generation 0 initialized with ${pop.size} genomes.`);

  // 2. Setup the Orchestrator
  const orchestrator = new QuantumBrainOrchestrator();

  // 3. Process mock files
  const mockFiles = [
    { name: 'config.json', size: 1024, content: '{"status": "active"}' },
    { name: 'main.ts', size: 5400, content: 'console.log("hello")' }
  ];

  await orchestrator.processFileSystem(mockFiles);
  console.log("Neural network mapped from filesystem.");

  // 4. Run propagation
  orchestrator.brain.propagate();
  console.log("Neural signal propagated through the network.");
}

main().catch(console.error);
