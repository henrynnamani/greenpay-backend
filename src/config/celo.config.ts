import { registerAs } from '@nestjs/config';

export default registerAs('celo', () => ({
  rpcUrl: process.env.RPC_URL,
  privateKey: process.env.PRIVATE_KEY,
  contract: {
    manager: process.env.MANAGER_CONTRACT,
    token: process.env.TOKEN_CONTRACT,
  },
}));
