import { GoogleGenAI } from "@google/genai";
import { config } from 'dotenv';

config({ path: '.env.local' });

const API_KEY = process.env.GEMINI_API_KEY || '';
console.log('Using API key:', API_KEY ? `${API_KEY.substring(0, 10)}...` : 'NOT FOUND');

const ai = new GoogleGenAI({ apiKey: API_KEY });

async function testModel(modelName) {
  try {
    console.log(`\nTesting model: ${modelName}`);
    const response = await ai.models.generateContent({
      model: modelName,
      contents: "Say hello in one word",
    });
    console.log(`✅ ${modelName} works!`);
    console.log(`Response: ${response.text}\n`);
  } catch (error) {
    console.log(`❌ ${modelName} failed: ${error.message}\n`);
  }
}

async function testModels() {
  const modelsToTest = [
    'gemini-1.5-flash',
    'gemini-1.5-flash-8b',
    'gemini-1.5-pro',
    'gemini-2.0-flash-exp',
    'gemini-pro',
  ];

  for (const model of modelsToTest) {
    await testModel(model);
  }
}

testModels();
