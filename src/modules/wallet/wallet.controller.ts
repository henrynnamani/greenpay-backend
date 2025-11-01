import { Body, Controller, Post, Req } from '@nestjs/common';
import { WalletService } from './provider/wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}
}
