
import { QuantumRegister, calculateEntanglement } from './quantum_states';

export class EntanglementManager {
  pairs: Map<string, [QuantumRegister, QuantumRegister]> = new Map();

  entangle(regA: QuantumRegister, regB: QuantumRegister) {
    const pairId = `${regA.id}<->${regB.id}`;
    this.pairs.set(pairId, [regA, regB]);
    return pairId;
  }

  getEntanglementStrength(pairId: string): number {
    const pair = this.pairs.get(pairId);
    if (!pair) return 0;
    return calculateEntanglement(pair[0], pair[1]);
  }

  syncStates() {
    this.pairs.forEach(([a, b]) => {
      // Entangled particles affect each other's coherence
      const avgCoherence = (a.coherence + b.coherence) / 2;
      a.coherence = avgCoherence;
      b.coherence = avgCoherence;
    });
  }
}
