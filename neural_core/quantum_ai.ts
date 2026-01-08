
/**
 * quantum_ai.ts
 * Quantum-inspired simulation and probabilistic sampling for browser environments.
 */

export interface Complex {
  re: number;
  im: number;
}

export const complex = (re: number, im: number = 0): Complex => ({ re, im });
export const cAdd = (a: Complex, b: Complex): Complex => complex(a.re + b.re, a.im + b.im);
export const cMul = (a: Complex, b: Complex): Complex => complex(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
export const phase = (theta: number): Complex => complex(Math.cos(theta), Math.sin(theta));

export const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));

export const choice = <T>(arr: T[], probs: number[] | null = null): T => {
  if (!probs) return arr[Math.floor(Math.random() * arr.length)];
  const s = probs.reduce((a, b) => a + b, 0);
  let r = Math.random() * s;
  for (let i = 0; i < arr.length; i++) {
    r -= probs[i];
    if (r <= 0) return arr[i];
  }
  return arr[arr.length - 1];
};

export class QState {
  n: number;
  state: Complex[];

  constructor(n: number) {
    this.n = n;
    const dim = 1 << n;
    this.state = Array(dim).fill(0).map((_, i) => i === 0 ? complex(1, 0) : complex(0, 0));
  }

  clone(): QState {
    const q = new QState(this.n);
    q.state = this.state.map(z => complex(z.re, z.im));
    return q;
  }

  applySingle(qubitIndex: number, U: Complex[][]) {
    const dim = 1 << this.n;
    const bit = 1 << qubitIndex;
    for (let i = 0; i < dim; i++) {
      const j = i ^ bit;
      if (j > i) {
        const a = this.state[i], b = this.state[j];
        const aPrime = cAdd(cMul(U[0][0], a), cMul(U[0][1], b));
        const bPrime = cAdd(cMul(U[1][0], a), cMul(U[1][1], b));
        this.state[i] = aPrime;
        this.state[j] = bPrime;
      }
    }
  }

  applyCNOT(control: number, target: number) {
    const dim = 1 << this.n;
    const cbit = 1 << control;
    const tbit = 1 << target;
    for (let i = 0; i < dim; i++) {
      if (i & cbit) {
        const j = i ^ tbit;
        if (j > i) {
          const a = this.state[i], b = this.state[j];
          this.state[i] = b;
          this.state[j] = a;
        }
      }
    }
  }

  measureAll(): string {
    const probs = this.state.map(z => z.re * z.re + z.im * z.im);
    const indices = Array.from(Array(probs.length).keys());
    const outcome = choice(indices, probs);
    return outcome.toString(2).padStart(this.n, '0');
  }
}

export const GATES = {
  X: [[complex(0, 0), complex(1, 0)], [complex(1, 0), complex(0, 0)]],
  Z: [[complex(1, 0), complex(0, 0)], [complex(0, 0), complex(-1, 0)]],
  H: [[complex(1 / Math.sqrt(2), 0), complex(1 / Math.sqrt(2), 0)],
      [complex(1 / Math.sqrt(2), 0), complex(-1 / Math.sqrt(2), 0)]],
  RZ: (theta: number) => [[phase(0), complex(0, 0)], [complex(0, 0), phase(theta)]],
  RX: (theta: number) => {
    const c = Math.cos(theta / 2), s = Math.sin(theta / 2);
    return [[complex(c, 0), complex(0, -s)], [complex(0, -s), complex(c, 0)]];
  },
  RY: (theta: number) => {
    const c = Math.cos(theta / 2), s = Math.sin(theta / 2);
    return [[complex(c, 0), complex(-s, 0)], [complex(s, 0), complex(c, 0)]];
  }
};
