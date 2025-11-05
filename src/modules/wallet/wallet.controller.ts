import { Body, Controller, Post, Req } from '@nestjs/common';
import { WalletService } from './provider/wallet.service';
import { ConnectWalletDto } from './dto/connect-wallet.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('connect')
  connectWallet(
    @Body() connectWalletDto: ConnectWalletDto,
    @CurrentUser() loggedInUser,
  ) {
    return this.walletService.connectWallet(
      loggedInUser.sub,
      connectWalletDto.address,
    );
  }
}
