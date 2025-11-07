import { Injectable, OnModuleInit } from '@nestjs/common';
import { ethers } from 'ethers';
const managerAbi = require('./abi/Manager.json');
const tokenAbi = require('./abi/ERC20Mock.json');
const projectAbi = require('./abi/Project.json');


@Injectable()
export class BlockchainService implements OnModuleInit {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private managerContract: ethers.Contract;
  private tokenContract: ethers.Contract;

  onModuleInit() {
    this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, this.provider);

    this.managerContract = new ethers.Contract(
      process.env.MANAGER_CONTRACT!,
      managerAbi.abi,
      this.wallet,
    );

    this.tokenContract = new ethers.Contract(
      process.env.TOKEN_CONTRACT!,
      tokenAbi.abi,
      this.wallet,
    );

    // this.managerContract.on('CarbonOffset', (user, project, amount) => {
    //   console.log(
    //     `Offset event → user: ${user}, project: ${project}, amount: ${amount}`,
    //   );
    //   // TODO: Save to DB or notify frontend via WebSocket
    // });
  }

  async getProjects() {
    return await this.managerContract.getProjects();
  }

  async registerProject(name: string, description: string, impact: string) {
    const tx = await this.managerContract.registerProject(
      name,
      description,
      impact,
    );
    return await tx.wait();
  }

  async offsetToProject(projectAddress: string, amount: string) {
    try {
      const project = new ethers.Contract(
        projectAddress,
        projectAbi.abi,
        this.wallet,
      );
      const tx = await project.simulateOffset(ethers.parseUnits(amount, 18)); // simulate for demo
      await tx.wait();
      return tx.hash;
    } catch (err) {
      throw err;
    }
  }

  async getTokenBalance(address: string) {
    const balance = await this.tokenContract.balanceOf(address);
    return ethers.formatUnits(balance, 18);
  }
}
