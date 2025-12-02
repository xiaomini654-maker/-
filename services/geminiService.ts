import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateLuxuryWish = async (recipientName: string, mood: string): Promise<string> => {
  if (!apiKey) {
    return "May your holidays be filled with golden moments and emerald dreams. (API Key missing)";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a short, sophisticated, and poetic Christmas wish for someone named "${recipientName}". 
      The tone should be "Arix Signature" style: opulent, elegant, warm, and high-fashion. 
      Avoid cliché generic phrases. Use words related to gold, light, stars, and timelessness.
      Keep it under 30 words.
      Context/Mood: ${mood}`,
    });

    return response.text || "Wishing you a season of splendor and grace.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Wishing you a season of splendor and grace.";
  }
};
