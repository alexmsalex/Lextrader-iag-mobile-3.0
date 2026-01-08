
export enum QBitState {
  ZERO = '0',
  ONE = '1',
  SUPERPOSITION = 'ψ',
  ENTANGLED = 'ξ',
  HARMONIC = 'λ'
}

export interface QuantumRegister {
  id: string;
  coherence: number;
  probability: number; // probability of being 1
  phase: number; // phase angle in radians
  harmonics: number[]; // frequency components
  flux: number; // rate of phase change
}

export const collapseRegister = (reg: QuantumRegister): QBitState => {
  // Coherence-based observation: higher coherence = more deterministic state based on probability
  const observationNoise = (1 - reg.coherence) * Math.random();
  const adjustedProb = reg.probability + (observationNoise * (Math.random() > 0.5 ? 1 : -1));
  
  if (reg.harmonics.some(h => h > 0.9)) return QBitState.HARMONIC;
  return Math.random() < adjustedProb ? QBitState.ONE : QBitState.ZERO;
};

export const decayCoherence = (reg: QuantumRegister, factor: number = 0.001) => {
  reg.coherence = Math.max(0, reg.coherence - factor);
  // Phase drift also occurs during decoherence, influenced by flux
  reg.phase = (reg.phase + (reg.flux * 0.1) + Math.random() * 0.05) % (2 * Math.PI);
  // Decay harmonics
  reg.harmonics = reg.harmonics.map(h => h * 0.99);
};

export const calculateEntanglement = (regA: QuantumRegister, regB: QuantumRegister): number => {
  const phaseAlignment = Math.cos(regA.phase - regB.phase);
  const sharedCoherence = (regA.coherence + regB.coherence) / 2;
  return sharedCoherence * Math.abs(phaseAlignment);
}
