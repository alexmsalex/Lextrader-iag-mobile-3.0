
import { GoogleGenAI, Type } from '@google/genai';

export class BehavioralAnalytics {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async analyzeBehavior(orderFlow: any) {
    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze these market behavioral patterns for manipulation or trend exhaustion: ${JSON.stringify(orderFlow)}. 
                 Look for "Whale" activity and "Retail Panic" signatures.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            manipulationProbability: { type: Type.NUMBER },
            retailSentiment: { type: Type.STRING },
            whaleActivity: { type: Type.STRING },
            riskLevel: { type: Type.NUMBER }
          },
          required: ["manipulationProbability", "retailSentiment", "whaleActivity", "riskLevel"]
        }
      }
    });

    try {
      return JSON.parse(response.text);
    } catch (e) {
      return { manipulationProbability: 0, retailSentiment: "Neutral", whaleActivity: "None", riskLevel: 0 };
    }
  }
}
