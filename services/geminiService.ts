import { GoogleGenAI, Type } from "@google/genai";
import { AiAdviceResponse } from '../types';
import { Language } from '../utils/translations';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getPurchaseAdvice = async (
  productName: string,
  price: number,
  hourlyRate: number,
  totalHours: number,
  currency: string,
  language: Language
): Promise<AiAdviceResponse> => {
  try {
    const langName = language === 'hu' ? 'Hungarian' : 'English';
    
    const prompt = `
      A user is considering buying a product defined as "${productName}" for ${price} ${currency}.
      Based on their salary, they earn ${hourlyRate.toFixed(2)} ${currency}/hour.
      This purchase will cost them ${totalHours.toFixed(1)} hours of work (working life).
      
      Act as a "financial conscience" against doomspending.
      1. If the hours are very high (e.g. > 20 hours) for a trivial item, be slightly sarcastic or strictly logical.
      2. If it's a small amount, be encouraging but remind them of value.
      3. Provide a short, punchy advice (max 2 sentences) in ${langName} language.
      4. Determine the sentiment (warning if high cost/low value, positive if good value, etc.).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            advice: { type: Type.STRING, description: `The advice in ${langName}` },
            sentiment: { 
              type: Type.STRING, 
              enum: ['positive', 'negative', 'neutral', 'warning'],
              description: "The tone of the advice" 
            }
          },
          required: ["advice", "sentiment"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AiAdviceResponse;
    }
    
    throw new Error("No response text");
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      advice: language === 'hu' 
        ? "Most nem tudok tanácsot adni, de gondold át: valóban szükséged van erre?" 
        : "I can't give advice right now, but think about it: do you really need this?",
      sentiment: "neutral"
    };
  }
};