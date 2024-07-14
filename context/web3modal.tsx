'use client'

import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react'

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = 'NEXT_PUBLIC_PROJECT_ID'

// 2. Set chains
const inco = {
  chainId: 9090,
  name: 'Inco Gentry Testnet',
  currency: 'ETH',
  rpcUrl: 'https://testnet.inco.org',
  explorerUrl: ''
}

// 3. Create a metadata object
const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: '', // origin must match your domain & subdomain
  icons: ['https://avatars.mywebsite.com/']
}

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,

  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: false,
})

// 5. Create a Web3Modal instance
createWeb3Modal({
  ethersConfig,
  chains: [inco],
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: true // Optional - false as default
})

export function Web3Modal({ children }) {
  return children
}