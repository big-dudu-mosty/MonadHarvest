import { useQuery } from '@tanstack/react-query'
import { okxGet } from '@/services/okx/client'
import type { OkxPortfolioData, OkxTokenAsset } from '@/services/okx/types'
import { OKX_ETH_CHAIN_INDEX } from '@/constants/okx'

function normalizeAssets(data: OkxPortfolioData[] | OkxPortfolioData): OkxTokenAsset[] {
  if (Array.isArray(data)) {
    return data.flatMap((item) => item.tokenAssets ?? [])
  }
  return data.tokenAssets ?? []
}

export function useOkxPortfolio(address?: string) {
  return useQuery({
    queryKey: ['okx-portfolio', address, OKX_ETH_CHAIN_INDEX],
    enabled: Boolean(address),
    staleTime: 60_000,
    queryFn: async () => {
      const data = await okxGet<OkxPortfolioData[]>(
        '/dex/balance/all-token-balances-by-address',
        {
          address: address!,
          chains: OKX_ETH_CHAIN_INDEX,
          excludeRiskToken: '0',
        }
      )

      const assets = normalizeAssets(data)
        .filter((a) => !a.isRiskToken)
        .filter((a) => Number(a.balance) > 0)
        .map((a) => ({
          ...a,
          usdValue: Number(a.balance) * Number(a.tokenPrice || 0),
        }))
        .sort((a, b) => b.usdValue - a.usdValue)

      const totalUsd = assets.reduce((sum, a) => sum + a.usdValue, 0)

      return { assets: assets.slice(0, 8), totalUsd }
    },
  })
}
