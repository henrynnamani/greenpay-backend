import { Module } from '@nestjs/common';
import { OffsetService } from './provider/offset.service';
import { OffsetController } from './offset.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Offset, OffsetSchema } from './schema/offset.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Offset.name, schema: OffsetSchema }]),
  ],
  providers: [OffsetService],
  controllers: [OffsetController],
  exports: [OffsetService]
})
export class OffsetModule {}
