import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { useOkxHotTokens } from '@/hooks/okx/useOkxHotTokens'
import { OkxApiError } from '@/services/okx/client'
import { OkxSetupHint } from './OkxSetupHint'

export function OkxHotTokensPanel() {
  const { data, isLoading, isError, error, refetch } = useOkxHotTokens()

  const isConfigError = isError && error instanceof OkxApiError && error.code === 'CONFIG'

  return (
    <Card className="border-orange-100">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2 text-base">
          <span className="flex items-center gap-2">
            <span>🔥</span>
            <span>OKX 链上热门（以太坊）</span>
          </span>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-xs text-gray-500 hover:text-gray-800"
          >
            刷新
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-gray-500 mb-4">
          来自 OKX 市场 API 的趋势代币，可作为链上「聪明钱在关注什么」的参考侧栏。
        </p>

        {isConfigError && <OkxSetupHint title="OKX 市场数据" />}

        {isLoading && (
          <div className="text-center py-6 text-sm text-gray-500">加载热门代币…</div>
        )}

        {isError && !isConfigError && (
          <p className="text-sm text-red-600">
            {error instanceof Error ? error.message : '加载失败'}
          </p>
        )}

        {data && data.length > 0 && !isLoading && !isError && (
          <div className="space-y-2">
            {data.map((token) => (
              <div
                key={`${token.tokenContractAddress}-${token.tokenSymbol}`}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 text-sm"
              >
                <div>
                  <span className="font-medium">{token.tokenSymbol}</span>
                  <span
                    className={`ml-2 text-xs ${
                      Number(token.change) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {Number(token.change) >= 0 ? '+' : ''}
                    {Number(token.change).toFixed(2)}%
                  </span>
                </div>
                <div className="text-right text-xs text-gray-500">
                  <div>Vol ${formatCompact(token.volume)}</div>
                  {token.inflowUsd && (
                    <div className="text-green-600">
                      净流入 ${formatCompact(token.inflowUsd)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {data?.length === 0 && !isLoading && !isError && (
          <p className="text-sm text-gray-500 text-center py-4">暂无热门数据</p>
        )}
      </CardContent>
    </Card>
  )
}

function formatCompact(value: string) {
  const n = Number(value)
  if (Number.isNaN(n)) return value
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toFixed(0)
}
