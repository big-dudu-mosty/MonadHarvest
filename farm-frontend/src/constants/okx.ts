/** OKX Onchain OS — 以太坊主网演示（Monad 暂不在 OKX DEX 聚合列表） */
export const OKX_ETH_CHAIN_INDEX = '1'

export const OKX_TOKENS = {
  nativeEth: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  usdc: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
} as const

export const OKX_SWAP_DEFAULT = {
  chainIndex: OKX_ETH_CHAIN_INDEX,
  fromToken: OKX_TOKENS.nativeEth,
  toToken: OKX_TOKENS.usdc,
  /** 0.001 ETH */
  amountWei: '1000000000000000',
  slippagePercent: '0.5',
} as const
