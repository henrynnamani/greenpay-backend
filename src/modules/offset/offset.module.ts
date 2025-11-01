import { Module } from '@nestjs/common';
import { OffsetService } from './provider/offset.service';
import { OffsetController } from './offset.controller';

@Module({
  providers: [OffsetService],
  controllers: [OffsetController]
})
export class OffsetModule {}
