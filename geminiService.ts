
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export async function generateConfirmationMessage(name: string): Promise<string> {
  if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. Returning mock response.");
    return `Thank you for your interest, ${name}. Your place is reserved. We look forward to welcoming you to a world where nature's finest ingredients are transformed into memories. You'll be the first to know when our doors open.`;
  }
  
  try {
    const prompt = `You are the voice of 'Atelier 560', a new, exclusive fine-dining restaurant inspired by nature and Portuguese roots. The brand is elegant, mysterious, and deeply connected to the earth. A user named "${name}" has just joined the waiting list. Write a short, poetic, and welcoming confirmation message (2-3 sentences) for them. Do not use emojis or markdown. Address them by name. The message should evoke a sense of anticipation and exclusivity.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating confirmation message:", error);
    throw new Error("Failed to generate confirmation message from AI.");
  }
}
