
import { GoogleGenAI, Type } from '@google/genai';

export interface AnalysisResult {
  sentiment: number; // 0 to 1
  confidence: number; // 0 to 1
  rationale: string;
}

export interface PatternResult {
  pattern: string;
  probability: number;
  direction: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  timeframe: string;
}

export interface ForexAnalysis {
  pair: string;
  bias: 'BULL' | 'BEAR' | 'NEUTRAL';
  volatility: number;
  macroFactors: string[];
  quantumSignal: number;
}

export class DeepAnalysisEngine {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async analyzeMarketContext(data: any): Promise<AnalysisResult> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this market state: ${JSON.stringify(data)}. 
                 Provide a Bullish/Bearish sentiment score (0-1) and a confidence score (0-1).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: { type: Type.NUMBER, description: "Sentiment from 0 (very bearish) to 1 (very bullish)" },
            confidence: { type: Type.NUMBER, description: "Confidence level from 0 to 1" },
            rationale: { type: Type.STRING, description: "Brief explanation" }
          },
          required: ["sentiment", "confidence", "rationale"]
        }
      }
    });

    try {
      return JSON.parse(response.text);
    } catch (e) {
      console.error("Failed to parse Gemini analysis", e);
      return { sentiment: 0.5, confidence: 0, rationale: "Error in analysis" };
    }
  }

  async analyzeChartPatterns(priceData: any[]): Promise<PatternResult> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Examine the following price action sequence and identify classic crypto chart patterns (e.g., Head and Shoulders, Double Top, Triangle, Flag, Cup and Handle): ${JSON.stringify(priceData)}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pattern: { type: Type.STRING, description: "Detected pattern name" },
            probability: { type: Type.NUMBER, description: "Probability score (0-1)" },
            direction: { type: Type.STRING, enum: ["BULLISH", "BEARISH", "NEUTRAL"] },
            timeframe: { type: Type.STRING }
          },
          required: ["pattern", "probability", "direction", "timeframe"]
        }
      }
    });

    try {
      return JSON.parse(response.text);
    } catch (e) {
      return { pattern: "None", probability: 0, direction: "NEUTRAL", timeframe: "Unknown" };
    }
  }

  async analyzeForexPair(pair: string, data: any): Promise<ForexAnalysis> {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform a detailed AGI macroeconomic and quantum signal analysis on ${pair}. 
                 Base analysis on: ${JSON.stringify(data)}.
                 Evaluate: 1. Central Bank Policy (Interest rates/Hawkishness). 2. Economic Indicators (CPI/GDP/Yield Spreads). 3. Geopolitical Risk.
                 Assign a Quantum Signal (0-100) based on interference between these factors.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pair: { type: Type.STRING },
            bias: { type: Type.STRING, enum: ["BULL", "BEAR", "NEUTRAL"] },
            volatility: { type: Type.NUMBER },
            macroFactors: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key macroeconomic drivers identified" },
            quantumSignal: { type: Type.NUMBER, description: "Quantum interference score 0-100 summarizing multi-dimensional alignment" }
          },
          required: ["pair", "bias", "volatility", "macroFactors", "quantumSignal"]
        }
      }
    });

    try {
      return JSON.parse(response.text);
    } catch (e) {
      return { 
        pair, 
        bias: "NEUTRAL", 
        volatility: 0.5, 
        macroFactors: ["Data link unstable"], 
        quantumSignal: 50 
      };
    }
  }
}
