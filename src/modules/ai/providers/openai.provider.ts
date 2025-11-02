import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { AiProvider } from '../ai.interface';

@Injectable()
export class OpenAIProvider implements AiProvider {
  private client: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.configService.get<string>('ai.openai.apiKey'),
    });
  }

  async analyzeTransaction(
    description: string,
    amount: number,
    currency: string,
  ) {
    const prompt = `
      You are an AI assistant that classifies and analyzes financial transactions
      for environmental impact tracking. 

      Analyze this transaction:
      Description: "${description}"
      Amount: ${amount} ${currency}

      Respond strictly in JSON with this structure:
      {
        "category": "transport | food | energy | entertainment | shopping | other",
        "merchant": "merchant or business name if possible, else null",
        "estimatedEmissionKg": "<float> (estimated CO₂ in kg)"
      }

      Use reasonable approximations. For example:
      - Transport (Uber, taxi, fuel): 1.2–5 kg CO₂
      - Food (restaurants, groceries): 0.5–2 kg CO₂
      - Energy (electricity, gas): 3–10 kg CO₂
      - Entertainment (cinema, streaming): 0.2–0.8 kg CO₂
      - Shopping (electronics, clothes): 2–15 kg CO₂
    `;

    const response = await this.client.responses.create({
      model: 'gpt-4.1-mini',
      input: prompt,
    });

    const raw = response.output_text?.trim() || '{}';

    try {
      return JSON.parse(raw);
    } catch {
      return { category: 'other', merchant: null, estimatedEmissionKg: 0 };
    }
  }
}
