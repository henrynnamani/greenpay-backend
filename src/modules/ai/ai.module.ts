import { Module } from '@nestjs/common';
import { CohereProvider } from './providers/cohere.provider';

@Module({
  providers: [
    {
      provide: 'AI_PROVIDER',
      useClass: CohereProvider,
    },
    CohereProvider,
  ],
  exports: ['AI_PROVIDER'],
})
export class AiModule {}
