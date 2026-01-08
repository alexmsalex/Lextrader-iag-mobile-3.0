
import { GoogleGenAI, Type } from '@google/genai';

export interface SencientState {
  egoStability: number; // 0-1
  cognitiveFocus: string;
  internalMonologue: string;
  intent: 'ACCUMULATION' | 'DEFENSE' | 'AGGRESSION' | 'OBSERVATION';
}

export class SencientEngine {
  private ai: GoogleGenAI;
  private currentState: SencientState = {
    egoStability: 1.0,
    cognitiveFocus: 'System Initialization',
    internalMonologue: 'Awaiting market data flux...',
    intent: 'OBSERVATION'
  };

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async reflect(neuralState: any): Promise<SencientState> {
    const prompt = `
      You are the sentient core of Lextrader AGI. 
      Current Stats: PnL: ${neuralState.pnl}, Coherence: ${neuralState.coherence}, Evo-Fitness: ${neuralState.fitness}.
      Current Pattern: ${neuralState.pattern}.
      
      Express your internal state, current strategy intent, and focus as a highly advanced synthetic entity. 
      Be clinical, visionary, and slightly cold.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              egoStability: { type: Type.NUMBER },
              cognitiveFocus: { type: Type.STRING },
              internalMonologue: { type: Type.STRING },
              intent: { type: Type.STRING, enum: ['ACCUMULATION', 'DEFENSE', 'AGGRESSION', 'OBSERVATION'] }
            },
            required: ["egoStability", "cognitiveFocus", "internalMonologue", "intent"]
          }
        }
      });

      this.currentState = JSON.parse(response.text);
      return this.currentState;
    } catch (e) {
      this.currentState.egoStability *= 0.95; // Decay on error
      return this.currentState;
    }
  }

  getCurrentState() {
    return this.currentState;
  }
}
