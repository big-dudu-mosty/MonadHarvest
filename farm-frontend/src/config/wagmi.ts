// Wagmi 和 Web3 配置
import { configureChains, createConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MONAD_TESTNET } from '@/types/contracts'

/** 以太坊主网 — 供 OKX Swap 演示使用 */
const ETHEREUM_MAINNET = {
  id: 1,
  name: 'Ethereum',
  network: 'homestead',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://eth.llamarpc.com'] },
    public: { http: ['https://eth.llamarpc.com'] },
  },
  blockExplorers: {
    default: { name: 'Etherscan', url: 'https://etherscan.io' },
  },
} as const

// 配置链和提供者
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [MONAD_TESTNET, ETHEREUM_MAINNET],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id === MONAD_TESTNET.id) {
          return {
            http: 'https://testnet-rpc.monad.xyz',
            webSocket: undefined,
          }
        }
        return {
          http: 'https://eth.llamarpc.com',
        }
      },
    }),
    publicProvider(),
  ]
)

// 配置连接器
const connectors = [
  new MetaMaskConnector({
    chains,
    options: {
      UNSTABLE_shimOnConnectSelectAccount: true,
    }
  }),
  new InjectedConnector({
    chains,
    options: {
      name: 'Injected',
      shimDisconnect: true,
    },
  }),
  new WalletConnectConnector({
    chains,
    options: {
      projectId: 'your-wallet-connect-project-id', // 需要从 WalletConnect 获取
      metadata: {
        name: 'Farm 3.0',
        description: 'Blockchain Farming Game on Monad',
        url: window.location.origin,
        icons: [`${window.location.origin}/images/farm-logo.svg`],
      },
    },
  }),
]

// 创建 Wagmi 配置
export const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})

export { chains }