
/**
 * synthetic_nn.ts
 * Minimalist neural network framework for the AGI core.
 * Features: Tensors, Dense layers, Activations, Losses, and Optimizers.
 */

/* =========================
   UTILITIES
========================= */
export const randn = (() => {
  let spare: number, hasSpare = false;
  return () => {
    if (hasSpare) { hasSpare = false; return spare; }
    let u, v, s;
    do { u = Math.random() * 2 - 1; v = Math.random() * 2 - 1; s = u * u + v * v; } while (s === 0 || s >= 1);
    const mul = Math.sqrt(-2 * Math.log(s) / s);
    spare = v * mul; hasSpare = true;
    return u * mul;
  };
})();

export const zeros = (r: number, c: number) => Array(r).fill(0).map(() => Array(c).fill(0));
export const clone = (A: number[][]) => A.map(row => row.slice());
export const shape = (A: number[][]) => [A.length, A[0].length];

/* =========================
   TENSOR 2D (MATRIZ)
========================= */
export const T = {
  add(A: number[][], B: number[][]) { 
    const [r, c] = shape(A); 
    const C = zeros(r, c);
    for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) C[i][j] = A[i][j] + B[i][j]; 
    return C; 
  },
  sub(A: number[][], B: number[][]) { 
    const [r, c] = shape(A); 
    const C = zeros(r, c);
    for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) C[i][j] = A[i][j] - B[i][j]; 
    return C; 
  },
  mulElem(A: number[][], B: number[][]) { 
    const [r, c] = shape(A); 
    const C = zeros(r, c);
    for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) C[i][j] = A[i][j] * B[i][j]; 
    return C; 
  },
  scale(A: number[][], s: number) { 
    const [r, c] = shape(A); 
    const C = zeros(r, c);
    for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) C[i][j] = A[i][j] * s; 
    return C; 
  },
  dot(A: number[][], B: number[][]) { 
    const [r, c] = shape(A); 
    const [r2, c2] = shape(B);
    if (c !== r2) throw new Error('dot: shapes incompatíveis');
    const C = zeros(r, c2);
    for (let i = 0; i < r; i++) for (let k = 0; k < c2; k++) {
      let s = 0; for (let j = 0; j < c; j++) s += A[i][j] * B[j][k]; C[i][k] = s;
    } return C; 
  },
  sumRows(A: number[][]) { 
    const [r, c] = shape(A); 
    const v = zeros(1, c);
    for (let j = 0; j < c; j++) { let s = 0; for (let i = 0; i < r; i++) s += A[i][j]; v[0][j] = s; }
    return v; 
  },
  transpose(A: number[][]) { 
    const [r, c] = shape(A); 
    const C = zeros(c, r);
    for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) C[j][i] = A[i][j]; 
    return C; 
  },
  apply(A: number[][], fn: (v: number, i: number, j: number) => number) { 
    const [r, c] = shape(A); 
    const C = zeros(r, c);
    for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) C[i][j] = fn(A[i][j], i, j); 
    return C; 
  }
};

/* =========================
   LAYERS & OPTIMIZERS
========================= */
export class Dense {
  W: number[][]; b: number[][];
  gW: number[][]; gb: number[][];
  X: number[][] | null = null;
  
  constructor(inDim: number, outDim: number) {
    const std = Math.sqrt(2 / (inDim + outDim));
    this.W = zeros(inDim, outDim).map(row => row.map(() => randn() * std));
    this.b = zeros(1, outDim);
    this.gW = zeros(inDim, outDim);
    this.gb = zeros(1, outDim);
  }

  forward(X: number[][]) {
    this.X = X;
    const [r] = shape(X);
    const B = zeros(r, this.b[0].length);
    for (let i = 0; i < r; i++) for (let j = 0; j < this.b[0].length; j++) B[i][j] = this.b[0][j];
    return T.add(T.dot(X, this.W), B);
  }

  backward(dOut: number[][]) {
    if (!this.X) return dOut;
    const XT = T.transpose(this.X);
    this.gW = T.dot(XT, dOut);
    this.gb = T.sumRows(dOut);
    const WT = T.transpose(this.W);
    return T.dot(dOut, WT);
  }
}

export class Adam {
  t = 0;
  mW: number[][] | null = null; vW: number[][] | null = null;
  mb: number[][] | null = null; vb: number[][] | null = null;

  constructor(public lr = 0.001, public b1 = 0.9, public b2 = 0.999, public eps = 1e-8) {}

  update(layer: Dense) {
    this.t += 1;
    const [rW, cW] = shape(layer.W);
    if (!this.mW) { this.mW = zeros(rW, cW); this.vW = zeros(rW, cW); }
    if (!this.mb) { this.mb = zeros(1, layer.b[0].length); this.vb = zeros(1, layer.b[0].length); }
    
    const b1t = 1 - Math.pow(this.b1, this.t);
    const b2t = 1 - Math.pow(this.b2, this.t);

    for (let i = 0; i < rW; i++) for (let j = 0; j < cW; j++) {
      this.mW![i][j] = this.b1 * this.mW![i][j] + (1 - this.b1) * layer.gW[i][j];
      this.vW![i][j] = this.b2 * this.vW![i][j] + (1 - this.b2) * layer.gW[i][j] * layer.gW[i][j];
      const mhat = this.mW![i][j] / b1t;
      const vhat = this.vW![i][j] / b2t;
      layer.W[i][j] -= this.lr * mhat / (Math.sqrt(vhat) + this.eps);
    }

    for (let j = 0; j < layer.b[0].length; j++) {
      this.mb![0][j] = this.b1 * this.mb![0][j] + (1 - this.b1) * layer.gb[0][j];
      this.vb![0][j] = this.b2 * this.vb![0][j] + (1 - this.b2) * layer.gb[0][j] * layer.gb[0][j];
      const mhat = this.mb![0][j] / b1t;
      const vhat = this.vb![0][j] / b2t;
      layer.b[0][j] -= this.lr * mhat / (Math.sqrt(vhat) + this.eps);
    }
  }
}

export class Sequential {
  layers: any[] = [];
  activations: string[] = [];
  optimizer: Adam | null = null;

  addDense(inDim: number, outDim: number, act: string = 'relu') {
    this.layers.push(new Dense(inDim, outDim));
    this.activations.push(act);
  }

  forward(X: number[][]) {
    let out = X;
    for (let i = 0; i < this.layers.length; i++) {
      out = this.layers[i].forward(out);
      if (this.activations[i] === 'relu') out = T.apply(out, x => x > 0 ? x : 0);
      else if (this.activations[i] === 'sigmoid') out = T.apply(out, x => 1 / (1 + Math.exp(-x)));
    }
    return out;
  }
}
