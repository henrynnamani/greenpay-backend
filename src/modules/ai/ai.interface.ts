export interface AiProvider {
  //   analyzeTransaction(
  //     description: string,
  //     amount: number,
  //     currency: string,
  //   ): Promise<{
  //     category: string;
  //     merchant: string | null;
  //     estimatedEmissionKg: number;
  //   }>;
  analyzeTransaction(
    description: string,
    amount: number,
    currency: string,
  ): Promise<any>;
}
