// import { Controller, Get, Post, Body, Param } from '@nestjs/common';
// import { BlockchainService } from './blockchain.service';

// @Controller('blockchain')
// export class BlockchainController {
//   constructor(private readonly blockchainService: BlockchainService) {}

//   @Get('projects')
//   async getProjects() {
//     return await this.blockchainService.getProjects();
//   }

//   @Post('register')
//   async registerProject(
//     @Body() dto: { name: string; description: string; impact: string },
//   ) {
//     return await this.blockchainService.registerProject(
//       dto.name,
//       dto.description,
//       dto.impact,
//     );
//   }

//   @Post('offset')
//   async offset(@Body() dto: { projectAddress: string; amount: string }) {
//     return this.blockchainService.offsetToProject(
//       dto.projectAddress,
//       dto.amount,
//     );
//   }

//   @Get('balance/:address')
//   async getBalance(@Param('address') address: string) {
//     return await this.blockchainService.getTokenBalance(address);
//   }
// }
