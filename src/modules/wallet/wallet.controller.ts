import { Body, Controller, Post, Req } from '@nestjs/common';
import { WalletService } from './provider/wallet.service';
import { ConnectWalletDto } from './dto/connect-wallet.dto';

@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('connect')
  connectWallet(@Body() connectWalletDto: ConnectWalletDto) {
    const userId = '690725cd493079185a74c82b';
    return this.walletService.connectWallet(userId, connectWalletDto.address);
  }
}
