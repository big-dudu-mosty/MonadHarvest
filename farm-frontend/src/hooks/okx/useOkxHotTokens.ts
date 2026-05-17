import { useQuery } from '@tanstack/react-query'
import { okxGet } from '@/services/okx/client'
import type { OkxHotToken } from '@/services/okx/types'
import { OKX_ETH_CHAIN_INDEX } from '@/constants/okx'

export function useOkxHotTokens() {
  return useQuery({
    queryKey: ['okx-hot-tokens', OKX_ETH_CHAIN_INDEX],
    staleTime: 120_000,
    refetchInterval: 180_000,
    queryFn: async () => {
      const data = await okxGet<OkxHotToken[]>('/dex/market/token/hot-token', {
        rankingType: '4',
        chainIndex: OKX_ETH_CHAIN_INDEX,
        rankingTimeFrame: '2',
        riskFilter: 'true',
        stableTokenFilter: 'true',
        limit: '8',
      })
      return data ?? []
    },
  })
}
