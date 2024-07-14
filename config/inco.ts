import { type Chain } from 'viem'

export const inco = {
  id: 9090,
  name: 'Inco Gentry Testnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://testnet.inco.org/'] },
  },
} as const satisfies Chain