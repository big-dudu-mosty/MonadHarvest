import { useMutation, useQuery } from '@tanstack/react-query'
import { okxGet } from '@/services/okx/client'
import type { OkxSwapQuote, OkxSwapTransaction } from '@/services/okx/types'
import { OKX_SWAP_DEFAULT } from '@/constants/okx'

export function useOkxSwapQuote(enabled = true) {
  return useQuery({
    queryKey: ['okx-swap-quote', OKX_SWAP_DEFAULT],
    enabled,
    staleTime: 30_000,
    refetchInterval: 60_000,
    queryFn: async () => {
      const data = await okxGet<OkxSwapQuote[]>('/dex/aggregator/quote', {
        chainIndex: OKX_SWAP_DEFAULT.chainIndex,
        fromTokenAddress: OKX_SWAP_DEFAULT.fromToken,
        toTokenAddress: OKX_SWAP_DEFAULT.toToken,
        amount: OKX_SWAP_DEFAULT.amountWei,
        slippagePercent: OKX_SWAP_DEFAULT.slippagePercent,
        swapMode: 'exactIn',
      })
      return data[0]
    },
  })
}

export function useOkxSwapTransaction() {
  return useMutation({
    mutationFn: async (userWalletAddress: string) => {
      const data = await okxGet<OkxSwapTransaction[]>('/dex/aggregator/swap', {
        chainIndex: OKX_SWAP_DEFAULT.chainIndex,
        fromTokenAddress: OKX_SWAP_DEFAULT.fromToken,
        toTokenAddress: OKX_SWAP_DEFAULT.toToken,
        amount: OKX_SWAP_DEFAULT.amountWei,
        userWalletAddress,
        slippagePercent: OKX_SWAP_DEFAULT.slippagePercent,
        swapMode: 'exactIn',
      })
      return data[0]
    },
  })
}
