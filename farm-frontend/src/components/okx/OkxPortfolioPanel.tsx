import { useAccount } from 'wagmi'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { useOkxPortfolio } from '@/hooks/okx/useOkxPortfolio'
import { OkxApiError } from '@/services/okx/client'
import { OkxSetupHint } from './OkxSetupHint'

export function OkxPortfolioPanel() {
  const { address } = useAccount()
  const { data, isLoading, isError, error } = useOkxPortfolio(address)

  if (!address) return null

  const isConfigError = isError && error instanceof OkxApiError && error.code === 'CONFIG'

  return (
    <Card className="border-blue-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <span>🔗</span>
          <span>OKX 链上资产（以太坊）</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-gray-500 mb-4">
          通过 OKX Onchain OS 查询该地址在以太坊主网的持仓（与 Monad 农场资产分开显示）。
        </p>

        {isConfigError && <OkxSetupHint />}

        {isLoading && (
          <div className="text-center py-6 text-sm text-gray-500">加载 OKX 持仓中…</div>
        )}

        {isError && !isConfigError && (
          <p className="text-sm text-red-600">
            {error instanceof Error ? error.message : '加载失败'}
          </p>
        )}

        {data && !isLoading && !isError && (
          <>
            {data.assets.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                该地址在以太坊主网暂无显著持仓
              </p>
            ) : (
              <>
                <PortfolioTotalBar totalUsd={data.totalUsd} />
                <div className="space-y-2">
                  {data.assets.map((asset) => (
                    <div
                      key={`${asset.symbol}-${asset.tokenContractAddress}`}
                      className="flex justify-between items-center text-sm py-2 border-b border-gray-100 last:border-0"
                    >
                      <span className="font-medium">{asset.symbol}</span>
                      <div className="text-right">
                        <div className="text-gray-900">
                          {Number(asset.balance).toLocaleString(undefined, {
                            maximumFractionDigits: 6,
                          })}
                        </div>
                        <div className="text-xs text-gray-500">
                          ≈ $
                          {asset.usdValue.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

function PortfolioTotalBar({ totalUsd }: { totalUsd: number }) {
  return (
    <div className="mb-4 p-3 bg-blue-50 rounded-lg flex justify-between items-center">
      <span className="text-sm text-gray-600">预估总价值</span>
      <span className="text-lg font-bold text-blue-800">
        ${totalUsd.toLocaleString(undefined, { maximumFractionDigits: 2 })}
      </span>
    </div>
  )
}
