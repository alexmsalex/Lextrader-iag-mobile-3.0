#!/usr/bin/env node
/**
 * neural_net.js
 * Framework minimalista de rede neural em JavaScript (Node.js) em um único arquivo.
 * Rodar: node neural_net.js
 *
 * Objetivo: didático. Implementa Tensores simples, camadas densas, ativações, perdas, otimizadores
 * e exemplos de treino. Sem dependências externas.
 */

/* =========================
   UTILIDADES
========================= */
const randn = (() => {
  // Box-Muller
  let spare, hasSpare = false;
  return () => {
    if (hasSpare) { hasSpare = false; return spare; }
    let u, v, s;
    do { u = Math.random()*2 - 1; v = Math.random()*2 - 1; s = u*u + v*v; } while (s === 0 || s >= 1);
    const mul = Math.sqrt(-2 * Math.log(s) / s);
    spare = v * mul; hasSpare = true;
    return u * mul;
  };
})();
const zeros = (r,c) => Array(r).fill(0).map(()=>Array(c).fill(0));
const ones = (r,c) => Array(r).fill(0).map(()=>Array(c).fill(1));
const clone = (A) => A.map(row=>row.slice());
const shape = (A) => [A.length, A[0].length];
const assert = (cond, msg) => { if (!cond) throw new Error(msg); };

/* =========================
   TENSOR 2D (MATRIZ)
========================= */
const T = {
  add(A,B){ const [r,c]=shape(A); const C=zeros(r,c);
    for(let i=0;i<r;i++) for(let j=0;j<c;j++) C[i][j]=A[i][j]+B[i][j]; return C; },
  sub(A,B){ const [r,c]=shape(A); const C=zeros(r,c);
    for(let i=0;i<r;i++) for(let j=0;j<c;j++) C[i][j]=A[i][j]-B[i][j]; return C; },
  mulElem(A,B){ const [r,c]=shape(A); const C=zeros(r,c);
    for(let i=0;i<r;i++) for(let j=0;j<c;j++) C[i][j]=A[i][j]*B[i][j]; return C; },
  scale(A,s){ const [r,c]=shape(A); const C=zeros(r,c);
    for(let i=0;i<r;i++) for(let j=0;j<c;j++) C[i][j]=A[i][j]*s; return C; },
  dot(A,B){ const [r,c]=shape(A); const [r2,c2]=shape(B);
    assert(c===r2,'dot: shapes incompatíveis');
    const C=zeros(r,c2);
    for(let i=0;i<r;i++) for(let k=0;k<c2;k++){
      let s=0; for(let j=0;j<c;j++) s+=A[i][j]*B[j][k]; C[i][k]=s;
    } return C; },
  sumRows(A){ const [r,c]=shape(A); const v=zeros(1,c);
    for(let j=0;j<c;j++){ let s=0; for(let i=0;i<r;i++) s+=A[i][j]; v[0][j]=s; }
    return v; },
  sumCols(A){ const [r,c]=shape(A); const v=zeros(r,1);
    for(let i=0;i<r;i++){ let s=0; for(let j=0;j<c;j++) s+=A[i][j]; v[i][0]=s; }
    return v; },
  transpose(A){ const [r,c]=shape(A); const C=zeros(c,r);
    for(let i=0;i<r;i++) for(let j=0;j<c;j++) C[j][i]=A[i][j]; return C; },
  apply(A,fn){ const [r,c]=shape(A); const C=zeros(r,c);
    for(let i=0;i<r;i++) for(let j=0;j<c;j++) C[i][j]=fn(A[i][j],i,j); return C; },
  concatCols(A,B){ const [r,c]=shape(A); const [r2,c2]=shape(B);
    assert(r===r2,'concatCols: linhas incompatíveis'); const C=zeros(r,c+c2);
    for(let i=0;i<r;i++){ for(let j=0;j<c;j++) C[i][j]=A[i][j]; for(let j=0;j<c2;j++) C[i][c+j]=B[i][j]; }
    return C; },
  mean(A){ const [r,c]=shape(A); let s=0; for(let i=0;i<r;i++) for(let j=0;j<c;j++) s+=A[i][j];
    return s/(r*c); },
};

/* =========================
   INICIALIZAÇÃO DE PESOS
========================= */
function xavierInit(inDim, outDim){
  const std = Math.sqrt(2/(inDim+outDim));
  const W = zeros(inDim, outDim);
  for(let i=0;i<inDim;i++) for(let j=0;j<outDim;j++) W[i][j]=randn()*std;
  const b = zeros(1,outDim);
  return {W, b};
}
function heInit(inDim, outDim){
  const std = Math.sqrt(2/inDim);
  const W = zeros(inDim, outDim);
  for(let i=0;i<inDim;i++) for(let j=0;j<outDim;j++) W[i][j]=randn()*std;
  const b = zeros(1,outDim);
  return {W, b};
}

/* =========================
   CAMADAS
========================= */
class Dense {
  constructor(inDim, outDim, init='xavier'){
    const {W,b} = init==='he' ? heInit(inDim,outDim) : xavierInit(inDim,outDim);
    this.W = W; this.b = b;
    // Gradientes
    this.gW = zeros(inDim,outDim);
    this.gb = zeros(1,outDim);
    // Cache forward
    this.X = null; this.out = null;
  }
  forward(X){
    this.X = X;
    const Z = T.add(T.dot(X, this.W), this.bBroadcast(X));
    this.out = Z; return Z;
  }
  bBroadcast(X){ // replica b por linhas
    const [r,_] = shape(X); const B = zeros(r, this.b[0].length);
    for(let i=0;i<r;i++) for(let j=0;j<this.b[0].length;j++) B[i][j]=this.b[0][j];
    return B;
  }
  backward(dOut){
    // dW = X^T * dOut; db = sumRows(dOut)
    const XT = T.transpose(this.X);
    this.gW = T.dot(XT, dOut);
    this.gb = T.sumRows(dOut);
    // dX = dOut * W^T
    const WT = T.transpose(this.W);
    const dX = T.dot(dOut, WT);
    return dX;
  }
  step(opt){ const upd = opt.update(this.W, this.gW, this.b, this.gb);
    this.W = upd.W; this.b = upd.b;
  }
}

/* =========================
   ATIVAÇÕES
========================= */
class ReLU {
  constructor(){ this.mask = null; }
  forward(X){
    this.mask = T.apply(X, x=> x>0 ? 1 : 0);
    return T.apply(X, x=> x>0 ? x : 0);
  }
  backward(dOut){
    return T.mulElem(dOut, this.mask);
  }
}
class Sigmoid {
  constructor(){ this.out = null; }
  forward(X){ this.out = T.apply(X, x=> 1/(1+Math.exp(-x))); return this.out; }
  backward(dOut){
    return T.mulElem(dOut, T.apply(this.out, y=> y*(1-y)));
  }
}
class Tanh {
  constructor(){ this.out = null; }
  forward(X){ this.out = T.apply(X, x=> Math.tanh(x)); return this.out; }
  backward(dOut){
    return T.mulElem(dOut, T.apply(this.out, y=> 1 - y*y));
  }
}
class Softmax {
  constructor(){ this.out = null; }
  forward(X){
    // Estável numericamente: subtrai max por linha
    const [r,c]=shape(X); const Y=zeros(r,c);
    for(let i=0;i<r;i++){
      const m = Math.max(...X[i]);
      let s = 0;
      for(let j=0;j<c;j++){ Y[i][j] = Math.exp(X[i][j]-m); s += Y[i][j]; }
      for(let j=0;j<c;j++) Y[i][j] /= (s+1e-12);
    }
    this.out = Y; return Y;
  }
  backward(dOut){
    // Para uso geral; para CE com logits, preferir atalho na Loss (ver abaixo)
    const [r,c]=shape(this.out); const dX=zeros(r,c);
    for(let i=0;i<r;i++){
      for(let j=0;j<c;j++){
        let s = 0;
        for(let k=0;k<c;k++){
          const jac = (j===k ? this.out[i][j]*(1-this.out[i][k]) : -this.out[i][j]*this.out[i][k]);
          s += dOut[i][k]*jac;
        }
        dX[i][j] = s;
      }
    }
    return dX;
  }
}

/* =========================
   PERDAS
========================= */
const Loss = {
  mse(pred, target){
    const [r,c]=shape(pred); let s=0;
    for(let i=0;i<r;i++) for(let j=0;j<c;j++){
      const d = pred[i][j]-target[i][j]; s += d*d;
    }
    return s/(r*c);
  },
  mseGrad(pred, target){
    const [r,c]=shape(pred); const g=zeros(r,c);
    for(let i=0;i<r;i++) for(let j=0;j<c;j++) g[i][j] = 2*(pred[i][j]-target[i][j])/(r*c);
    return g;
  },
  crossEntropyWithLogits(logits, targetOneHot){
    // softmax + CE integrados
    const [r,c]=shape(logits); let loss=0;
    const probs = new Softmax().forward(logits);
    for(let i=0;i<r;i++){
      for(let j=0;j<c;j++){
        if (targetOneHot[i][j]===1){
          loss += -Math.log(Math.max(probs[i][j],1e-12));
        }
      }
    }
    return {loss: loss/r, probs};
  },
  crossEntropyGradLogits(probs, targetOneHot){
    // gradiente simplificado: (probs - onehot)/batch
    const [r,c]=shape(probs); const g=zeros(r,c);
    for(let i=0;i<r;i++) for(let j=0;j<c;j++) g[i][j] = (probs[i][j] - targetOneHot[i][j]) / r;
    return g;
  }
};

/* =========================
   OTIMIZADORES
========================= */
class SGD {
  constructor(lr=0.01, momentum=0){
    this.lr = lr; this.m = momentum;
    this.vW = null; this.vb = null;
  }
  update(W,gW,b,gb){
    if (!this.vW) this.vW = zeros(W.length, W[0].length);
    if (!this.vb) this.vb = zeros(1, b[0].length);
    const nW = clone(W), nb = clone(b);
    for(let i=0;i<W.length;i++) for(let j=0;j<W[0].length;j++){
      this.vW[i][j] = this.m*this.vW[i][j] + this.lr*gW[i][j];
      nW[i][j] = W[i][j] - this.vW[i][j];
    }
    for(let j=0;j<b[0].length;j++){
      this.vb[0][j] = this.m*this.vb[0][j] + this.lr*gb[0][j];
      nb[0][j] = b[0][j] - this.vb[0][j];
    }
    return {W:nW, b:nb};
  }
}
class Adam {
  constructor(lr=0.001, b1=0.9, b2=0.999, eps=1e-8){
    this.lr=lr; this.b1=b1; this.b2=b2; this.eps=eps;
    this.mW=null; this.vW=null; this.mb=null; this.vb=null; this.t=0;
  }
  update(W,gW,b,gb){
    this.t += 1;
    if (!this.mW){ this.mW=zeros(W.length,W[0].length); this.vW=zeros(W.length,W[0].length); }
    if (!this.mb){ this.mb=zeros(1,b[0].length); this.vb=zeros(1,b[0].length); }
    const nW = clone(W), nb = clone(b);
    const b1t = Math.pow(this.b1,this.t), b2t = Math.pow(this.b2,this.t);
    for(let i=0;i<W.length;i++) for(let j=0;j<W[0].length;j++){
      this.mW[i][j] = this.b1*this.mW[i][j] + (1-this.b1)*gW[i][j];
      this.vW[i][j] = this.b2*this.vW[i][j] + (1-this.b2)*gW[i][j]*gW[i][j];
      const mhat = this.mW[i][j]/(1-b1t);
      const vhat = this.vW[i][j]/(1-b2t);
      nW[i][j] = W[i][j] - this.lr * mhat / (Math.sqrt(vhat)+this.eps);
    }
    for(let j=0;j<b[0].length;j++){
      this.mb[0][j] = this.b1*this.mb[0][j] + (1-this.b1)*gb[0][j];
      this.vb[0][j] = this.b2*this.vb[0][j] + (1-this.b2)*gb[0][j]*gb[0][j];
      const mhat = this.mb[0][j]/(1-b1t);
      const vhat = this.vb[0][j]/(1-b2t);
      nb[0][j] = b[0][j] - this.lr * mhat / (Math.sqrt(vhat)+this.eps);
    }
    return {W:nW, b:nb};
  }
}

/* =========================
   MODELO SEQUENCIAL
========================= */
class Sequential {
  constructor(){ this.layers=[]; this.activations=[]; this.opt=null; }
  addDense(inDim, outDim, init='xavier'){ const dense=new Dense(inDim,outDim,init); this.layers.push(dense); return dense; }
  addActivation(type){
    const act = type==='relu' ? new ReLU()
               : type==='sigmoid' ? new Sigmoid()
               : type==='tanh' ? new Tanh()
               : type==='softmax' ? new Softmax()
               : null;
    assert(act, 'Ativação desconhecida: '+type);
    this.activations.push(act);
    return act;
  }
  setOptimizer(opt){ this.opt = opt; }
  forward(X){
    let out = X;
    for(let i=0;i<this.layers.length;i++){
      out = this.layers[i].forward(out);
      if (this.activations[i]) out = this.activations[i].forward(out);
    }
    return out;
  }
  backward(dLoss){
    let grad = dLoss;
    for(let i=this.layers.length-1;i>=0;i--){
      if (this.activations[i]) grad = this.activations[i].backward(grad);
      grad = this.layers[i].backward(grad);
    }
  }
  step(){
    assert(this.opt, 'Defina um otimizador com setOptimizer');
    for(const layer of this.layers) layer.step(this.opt);
  }
}

/* =========================
   DADOS DE EXEMPLO
========================= */
function makeXOR(){
  const X = [[0,0],[0,1],[1,0],[1,1]];
  const Y = [[0],[1],[1],[0]];
  return {X,Y};
}
function oneHotFromLabels(labels, numClasses){
  const Y = zeros(labels.length, numClasses);
  for(let i=0;i<labels.length;i++) Y[i][labels[i]] = 1;
  return Y;
}
function makeTwoClassBlobs(n=200, spread=0.8){
  const A=[], B=[];
  for(let i=0;i<n;i++){ A.push([randn()*spread - 1.5, randn()*spread + 1.5]); }
  for(let i=0;i<n;i++){ B.push([randn()*spread + 1.5, randn()*spread - 1.5]); }
  const X = A.concat(B);
  const y = Array(n).fill(0).concat(Array(n).fill(1));
  const Y = oneHotFromLabels(y, 2);
  return {X,Y};
}

/* =========================
   TREINO
========================= */
function shuffleInPlace(X,Y){
  for(let i=X.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [X[i],X[j]] = [X[j],X[i]];
    [Y[i],Y[j]] = [Y[j],Y[i]];
  }
}
function batchify(X,Y,batchSize){
  const batches=[];
  for(let i=0;i<X.length;i+=batchSize){
    const xb = X.slice(i,i+batchSize);
    const yb = Y.slice(i,i+batchSize);
    batches.push({X:xb, Y:yb});
  }
  return batches;
}
function accuracy(probs, Yonehot){
  let correct=0;
  for(let i=0;i<probs.length;i++){
    const pred = probs[i].indexOf(Math.max(...probs[i]));
    const trueL = Yonehot[i].indexOf(1);
    if (pred===trueL) correct++;
  }
  return correct/probs.length;
}

/* =========================
   DEMOS
========================= */
function trainXOR(){
  console.log('--- Treino XOR ---');
  const {X,Y} = makeXOR(); // 4 amostras
  // Modelo: 2 -> 8 -> 1 (sigmoid)
  const net = new Sequential();
  net.addDense(2,8,'he'); net.addActivation('relu');
  net.addDense(8,1,'xavier'); net.addActivation('sigmoid');
  net.setOptimizer(new Adam(0.03));

  const epochs = 2000;
  for(let e=1;e<=epochs;e++){
    const out = net.forward(X);
    const loss = Loss.mse(out, Y);
    const dLoss = Loss.mseGrad(out, Y);
    net.backward(dLoss);
    net.step();
    if (e%200===0){
      console.log(`epoch ${e} | loss ${loss.toFixed(4)}`);
    }
  }
  console.log('Predições XOR:');
  const pred = net.forward(X).map(r=>r.map(v=>Number(v.toFixed(3))));
  console.log(pred);
}

function trainBlobs(){
  console.log('--- Treino classificação 2 classes ---');
  const {X,Y} = makeTwoClassBlobs(300, 0.9);
  const net = new Sequential();
  net.addDense(2,16,'he'); net.addActivation('relu');
  net.addDense(16,8,'he'); net.addActivation('relu');
  net.addDense(8,2,'xavier'); // logits
  // Softmax será na loss (cross-entropy com logits)
  net.activations.push(null); // placeholder para alinhamento (sem ativação após última Dense)
  net.setOptimizer(new Adam(0.01));

  const epochs = 200;
  const batchSize = 32;

  for(let e=1;e<=epochs;e++){
    shuffleInPlace(X,Y);
    const batches = batchify(X,Y,batchSize);
    let runningLoss = 0, count = 0;
    for(const {X:xb, Y:yb} of batches){
      const logits = net.forward(xb);
      const {loss, probs} = Loss.crossEntropyWithLogits(logits, yb);
      const dLogits = Loss.crossEntropyGradLogits(probs, yb);
      net.backward(dLogits);
      net.step();
      runningLoss += loss; count++;
    }
    if (e%20===0){
      const logits = net.forward(X);
      const {probs} = Loss.crossEntropyWithLogits(logits, Y);
      const acc = accuracy(probs, Y);
      console.log(`epoch ${e} | loss ${ (runningLoss/count).toFixed(4) } | acc ${ (acc*100).toFixed(2) }%`);
    }
  }
}

/* =========================
   CLI (opcional)
========================= */
function main(){
  trainXOR();
  trainBlobs();
}
if (require.main === module) main();