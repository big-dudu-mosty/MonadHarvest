export interface OkxApiResponse<T> {
  code: string
  msg: string
  data: T
}

export interface OkxTokenAsset {
  chainIndex: string
  tokenContractAddress: string
  symbol: string
  balance: string
  tokenPrice: string
  isRiskToken: boolean
  address: string
}

export interface OkxPortfolioData {
  tokenAssets: OkxTokenAsset[]
}

export interface OkxSwapQuote {
  fromTokenAmount?: string
  toTokenAmount?: string
  estimateGasFee?: string
  tradeFee?: string
  priceImpactPercentage?: string
  routerResult?: {
    fromToken?: { tokenSymbol?: string }
    toToken?: { tokenSymbol?: string }
  }
}

export interface OkxSwapTransaction {
  tx?: {
    to?: string
    data?: string
    value?: string
    gas?: string
    gasPrice?: string
  }
}

export interface OkxHotToken {
  chainIndex: string
  tokenSymbol: string
  tokenContractAddress: string
  price: string
  change: string
  volume: string
  marketCap: string
  inflowUsd?: string
  holders?: string
}
