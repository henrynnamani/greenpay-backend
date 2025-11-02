import { Injectable } from '@nestjs/common';
import { CohereClientV2 } from 'cohere-ai';
import { AiProvider } from '../ai.interface';
import { ConfigService } from '@nestjs/config';
import { extractTextFromResponse } from '@/helpers/extract-text';

@Injectable()
export class CohereProvider implements AiProvider {
  private client: CohereClientV2;
  constructor(private readonly configService: ConfigService) {
    this.client = new CohereClientV2({
      token: this.configService.get<string>('ai.cohere.apiKey'),
    });
  }

  async analyzeTransaction(
    description: string,
    amount: number,
    currency: string,
  ) {
    try {
      const prompt = `
          You are an AI that classifies financial transactions.
          Transaction: "${description}" (${amount} ${currency})
          Respond strictly in JSON:
          { "category": "...", "merchant": "...", "estimatedEmissionKg": ... }
        `;

      const response = await this.client.chat({
        model: 'command-a-03-2025',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const text = extractTextFromResponse(response);

      const match = text.match(/```json\s*([\s\S]*?)\s*```/i);
      const jsonStr = match ? match[1] : text;

      try {
        const parsed = JSON.parse(jsonStr);
        return {
          category: parsed.category || 'uncategorized',
          merchant: parsed.merchant || 'unknown',
          estimatedEmissionKg: parsed.estimatedEmissionKg || 0,
        };
      } catch (err) {
        return { category: 'other', merchant: null, estimatedEmissionKg: 0 };
      }
    } catch (err) {
      console.log(err);
    }
  }
}
