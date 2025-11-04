import { Module } from '@nestjs/common';
import { SavingsController } from './savings.controller';
import { SavingsService } from './provider/savings.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Saving, SavingSchema } from './schema/saving.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: Saving.name, schema: SavingSchema }]),
  ],
  controllers: [SavingsController],
  providers: [SavingsService],
})
export class SavingsModule {}
