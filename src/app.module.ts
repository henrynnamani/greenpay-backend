import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auths.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { envSchema } from './config/environment.validator';
import jwtConfig from './config/jwt.config';
import { MongooseModule } from '@nestjs/mongoose';
import mongoConfig from './config/mongo.config';
import { z } from 'zod';
import { ProjectsModule } from './modules/projects/projects.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { AiModule } from './modules/ai/ai.module';
import aiConifg from './config/ai.config';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { SavingsModule } from './modules/savings/savings.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ProjectsModule,
    TransactionsModule,
    AiModule,
    SavingsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig, mongoConfig, aiConifg],
      validate: (config) => {
        const parsed = envSchema.safeParse(config);
        if (!parsed.success) {
          console.error('❌ Invalid environment variables:');
          console.error(JSON.stringify(z.treeifyError(parsed.error), null, 2));
          throw new Error('Invalid environment variables');
        }
        return parsed.data;
      },
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get('mongo.uri'),
      }),
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
