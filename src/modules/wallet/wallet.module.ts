import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './provider/wallet.service';

@Module({
  controllers: [WalletController],
  providers: [WalletService]
})
export class WalletModule {}
