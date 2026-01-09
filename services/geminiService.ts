
import { GoogleGenAI, Type } from "@google/genai";
import { InterviewMode } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateInitialQuestion(role: string, level: string, mode: InterviewMode) {
  const prompt = `Act as a senior ${mode} interviewer. Generate one highly relevant, unique first question for a ${level} level candidate applying for a ${role} position. Format your response as a simple string.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { temperature: 0.8 }
  });
  
  return response.text;
}

export async function generateFollowUpQuestion(history: string, role: string, mode: InterviewMode) {
  const prompt = `Based on the following interview transcript, generate the next logical ${mode} follow-up question for a ${role} role. 
  Transcript: ${history}
  Ensure the question is adaptive and tests either depth of knowledge or behavioral consistency.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { temperature: 0.7 }
  });

  return response.text;
}

export async function analyzePerformance(history: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze this interview transcript and provide feedback in JSON format: ${history}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER, description: "Score from 0 to 100" },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
          overallSummary: { type: Type.STRING }
        },
        required: ["score", "strengths", "improvements", "overallSummary"]
      }
    }
  });

  return JSON.parse(response.text);
}
