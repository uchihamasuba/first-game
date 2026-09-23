import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenerativeAI | null = null;

if (apiKey) {
  ai = new GoogleGenerativeAI(apiKey);
}

const fallbackTaunts = [
  "A bold move, but is it enough?",
  "The battle rages on!",
  "A critical strike!",
  "Is that all you've got?",
  "The arena demands more blood!",
  "A tactical blunder, or a masterstroke?",
  "The end draws near!"
];

export interface TauntPayload {
  event: "PLAYER_ATTACK" | "CRITICAL_HIT" | "UNIT_DEFEATED" | "VICTORY" | "DEFEAT";
  unitName: string;
  damage?: number;
  hpRemaining?: number;
}

export const generateTaunt = async (payload: TauntPayload): Promise<string> => {
  if (!ai) {
    return fallbackTaunts[Math.floor(Math.random() * fallbackTaunts.length)];
  }

  try {
    const prompt = `You are a witty, slightly sarcastic fantasy arena dungeon master. Return a single short, punchy sentence (under 25 words) commenting on the battle event. Event: ${payload.event}. Unit: ${payload.unitName}. Damage: ${payload.damage || 0}. HP Remaining: ${payload.hpRemaining || 0}.`;
    // Using gemini-3.6-flash as the fast model
    const model = ai.getGenerativeModel({ model: 'gemini-3.6-flash' });
    const response = await model.generateContent(prompt);
    
    const text = response.response.text();
    return text || fallbackTaunts[Math.floor(Math.random() * fallbackTaunts.length)];
  } catch (error) {
    console.error("Gemini API error:", (error as any).message || error);
    return fallbackTaunts[Math.floor(Math.random() * fallbackTaunts.length)]; // Graceful fallback
  }
};
