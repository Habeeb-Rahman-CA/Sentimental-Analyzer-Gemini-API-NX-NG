import { inject, Injectable } from '@angular/core';
import { NGGC_API_CONFIG } from '../tokens/gemini-api-config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NGGCSentimentAnalysisConfig, NGGCSentimentResponse } from '../types';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {

  geminiApiConfig = inject(NGGC_API_CONFIG)

  genAI: GoogleGenerativeAI

  constructor() {
    if (!this.geminiApiConfig.apiKey) {
      throw new Error('Gemini Api key is not provided')
    }
    if (!this.geminiApiConfig.model) {
      throw new Error('Gemini model is not provided')
    }
    this.genAI = new GoogleGenerativeAI(this.geminiApiConfig.apiKey)
  }

  async analyze(text: string, config: NGGCSentimentAnalysisConfig | null) {
    const model = this.genAI.getGenerativeModel({
      model: config?.model || this.geminiApiConfig.model,
      generationConfig: {
        responseMimeType: 'application/json'
      }
    })
    const prompt = `You are an expert senitmental analyst and I want you to analyse the sentiment of the text i will provide to you. With a rating from 0 = 10 in terms of intensity of the sentiments.
    Give an emoji for particular rating.
    The sentiment can be positive, happy, appreciative, etc. Or negative, toxic, vulgar, etc.
    The response should be a stringified JSON in the following format:
    {
      "sentiment": 'happy' | 'sad' | 'toxic' etc,
      "rating": number,
      "emoji": string,
      "category": "positive" | "negative"
    }
      
    This is the text;
    ${text}`

    const result = await model.generateContent([
      prompt
    ])
    return JSON.parse(result.response.text()) as NGGCSentimentResponse
  }

}
