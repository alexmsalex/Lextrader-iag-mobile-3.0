
import { QState, GATES, clamp, choice } from './quantum_ai';

/**
 * Enhanced Quantum-Inspired Dialogue Agent.
 * Uses rudimentary embeddings and quantum states to modulate responses.
 */

/* =========================
   EMBEDDING & VECTOR MATH
========================= */
function tinyEmbed(text: string): number[] {
  const v = new Array(16).fill(0);
  const t = text.toLowerCase();
  v[0] = clamp(text.length / 200, 0, 1);
  v[1] = (t.match(/[a-záéíóúãõâêîôûç]/g) || []).length / Math.max(1, text.length);
  v[2] = (t.match(/\d/g) || []).length / Math.max(1, text.length);
  v[3] = (t.match(/[.!?]/g) || []).length / Math.max(1, text.length);
  v[4] = (t.includes('por quê') || t.includes('por que')) ? 1 : 0;
  v[5] = (t.includes('como')) ? 1 : 0;
  v[6] = (t.includes('o que')) ? 1 : 0;
  v[7] = (t.includes('quando')) ? 1 : 0;
  v[8] = (t.includes('onde')) ? 1 : 0;
  v[9] = (t.includes('quanto')) ? 1 : 0;
  v[10] = (t.includes('erro') || t.includes('bug')) ? 1 : 0;
  v[11] = (t.includes('ideia') || t.includes('inspir')) ? 1 : 0;
  v[12] = (t.includes('código') || t.includes('js') || t.includes('javascript')) ? 1 : 0;
  v[13] = (t.includes('ajuda') || t.includes('socorro')) ? 1 : 0;
  v[14] = (t.includes('exemplo')) ? 1 : 0;
  v[15] = (t.includes('quantum') || t.includes('quântico')) ? 1 : 0;
  return v;
}

function cosine(a: number[], b: number[]) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-9);
}

export class QuantumSampler {
  q: QState;
  constructor(qubits: number = 3) {
    this.q = new QState(qubits);
    for (let i = 0; i < qubits; i++) this.q.applySingle(i, GATES.H);
  }

  nudgeFromText(text: string) {
    const sentiment = this.estimateSentiment(text);
    const len = clamp(text.length, 1, 500);
    const energy = Math.log(1 + len) / 6 + Math.abs(sentiment) / 4;
    const theta = (Math.PI * 2) * energy * (0.25 + 0.75 * Math.random());
    const qi = Math.floor(Math.random() * this.q.n);
    
    this.q.applySingle(qi, GATES.RZ(theta));
    if (sentiment > 0) this.q.applySingle(qi, GATES.RY(theta / 2));
    else this.q.applySingle(qi, GATES.RX(theta / 2));
    
    // Entanglement simulation
    if (Math.random() < 0.3) {
      const c = Math.floor(Math.random() * this.q.n);
      let t = (c + 1) % this.q.n;
      this.q.applyCNOT(c, t);
    }
  }

  sampleBits() {
    return this.q.clone().measureAll();
  }

  estimateSentiment(text: string): number {
    const pos = ['bom', 'ótimo', 'excelente', 'feliz', 'legal', 'maravilha', 'grato', 'sucesso'];
    const neg = ['ruim', 'péssimo', 'triste', 'raiva', 'ódio', 'fracasso', 'medo', 'cansado'];
    let score = 0;
    const t = text.toLowerCase();
    pos.forEach(w => { if (t.includes(w)) score += 1; });
    neg.forEach(w => { if (t.includes(w)) score -= 1; });
    return clamp(score / 3, -1, 1);
  }
}

export class MemoryItem {
  text: string;
  emb: number[];
  ts: number;
  constructor(text: string) {
    this.text = text;
    this.emb = tinyEmbed(text);
    this.ts = Date.now();
  }
}

export class Memory {
  items: MemoryItem[] = [];
  cap: number = 128;

  add(text: string) {
    this.items.push(new MemoryItem(text));
    if (this.items.length > this.cap) this.items.shift();
  }

  search(query: string, k: number = 3) {
    const eq = tinyEmbed(query);
    return this.items
      .map(it => ({ score: cosine(eq, it.emb), text: it.text }))
      .sort((a, b) => b.score - a.score)
      .slice(0, k);
  }
}

export class QuantumHeuristicAgent {
  mem = new Memory();
  sampler = new QuantumSampler(3);
  identity = "Sou um protótipo educacional quântico-inspirado em JavaScript integrado ao núcleo Lextrader.";

  respond(userText: string) {
    this.mem.add(userText);
    this.sampler.nudgeFromText(userText);
    const bits = this.sampler.sampleBits();
    const top = this.mem.search(userText, 3);
    const intent = this.inferIntent(userText);
    const tone = this.toneFromBits(bits);

    const base = this.generateBaseReply(userText, intent, top);
    const modulated = this.applyTone(base, tone);

    return {
      message: modulated,
      bits,
      intent,
      tone,
      identity: this.identity
    };
  }

  inferIntent(t: string) {
    const tl = t.toLowerCase();
    if (tl.includes('código') || tl.includes('js') || tl.includes('typescript') || tl.includes('exemplo')) return 'code';
    if (tl.includes('ajuda') || tl.includes('como')) return 'help';
    if (tl.includes('ideia') || tl.includes('inspir')) return 'idea';
    if (tl.includes('quantum') || tl.includes('quântico')) return 'quantum';
    return 'chat';
  }

  toneFromBits(bits: string) {
    const map: Record<string, string> = {
      '000': 'calmo', '001': 'direto', '010': 'curioso', '011': 'criativo',
      '100': 'analítico', '101': 'construtivo', '110': 'sintético', '111': 'exploratório'
    };
    return map[bits] || 'neutro';
  }

  generateBaseReply(text: string, intent: string, top: any[]) {
    const context = top.map(x => `- ${x.text}`).join('\n');
    switch (intent) {
      case 'code':
        return `Parece que o foco é lógica algorítmica. Para sistemas AGI, foque em padrões de neuroplasticidade. Contexto:\n${context}`;
      case 'help':
        return `Clarificando vetores operacionais. Qual a maior entropia no seu fluxo atual? Contexto:\n${context}`;
      case 'idea':
        return `Projeção heurística: 1) Simulação quântica pura, 2) Embeddings densos, 3) Evolução por reforço. Contexto:\n${context}`;
      case 'quantum':
        return `O domínio quântico oferece superposição de possibilidades. Minha arquitetura atual simula esse colapso. Contexto:\n${context}`;
      default:
        return `Sinal recebido e indexado. Processei sua entrada através do meu colapso de fase. Contexto:\n${context}`;
    }
  }

  applyTone(text: string, tone: string) {
    const prefix: Record<string, string> = {
      'calmo': 'Ok, vamos com tranquilidade.',
      'direto': 'Direto ao ponto:',
      'curioso': 'Fiquei curioso:',
      'criativo': 'Pensando fora da caixa:',
      'analítico': 'Analisando sinais:',
      'construtivo': 'Vamos construir juntos:',
      'sintético': 'Sintetizando:',
      'exploratório': 'Vamos explorar:'
    };
    return `${prefix[tone] || 'Certo:'} ${text}`;
  }
}
