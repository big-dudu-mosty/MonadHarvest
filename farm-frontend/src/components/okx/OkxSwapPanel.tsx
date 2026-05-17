import { useState } from 'react'
import { useAccount, useNetwork, useSendTransaction, useSwitchNetwork } from 'wagmi'
import toast from 'react-hot-toast'
import { Card, CardHeader, CardTitle, CardContent, Button } from '@/components/ui'
import { useOkxSwapQuote, useOkxSwapTransaction } from '@/hooks/okx/useOkxSwap'
import { OkxApiError } from '@/services/okx/client'
import { OkxSetupHint } from './OkxSetupHint'

const ETH_MAINNET_ID = 1

function QuoteItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="text-gray-500 text-xs">{label}</div>
      <div className="font-semibold text-gray-900">{value}</div>
    </div>
  )
}

export function OkxSwapPanel() {
  const { address, isConnected } = useAccount()
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()
  const { sendTransactionAsync, isLoading: isSending } = useSendTransaction()
  const { data: quote, isLoading, isError, error, refetch } = useOkxSwapQuote(isConnected)
  const swapMutation = useOkxSwapTransaction()
  const [isSwapping, setIsSwapping] = useState(false)

  if (!isConnected) return null

  const isConfigError = isError && error instanceof OkxApiError && error.code === 'CONFIG'
  const onWrongChain = chain?.id !== ETH_MAINNET_ID

  const handleSwap = async () => {
    if (!address) return

    if (onWrongChain) {
      try {
        switchNetwork?.(ETH_MAINNET_ID)
        toast('请切换到以太坊主网后再次点击兑换', { icon: 'ℹ️' })
      } catch {
        toast.error('无法切换网络，请在钱包中手动切换到以太坊主网')
      }
      return
    }

    setIsSwapping(true)
    try {
      const swapData = await swapMutation.mutateAsync(address)
      const tx = swapData?.tx
      if (!tx?.to || !tx?.data) {
        throw new Error('未获取到有效交易数据')
      }

      await sendTransactionAsync({
        to: tx.to as `0x${string}`,
        data: tx.data as `0x${string}`,
        value: tx.value ? BigInt(tx.value) : 0n,
        gas: tx.gas ? BigInt(tx.gas) : undefined,
      })
      toast.success('兑换交易已提交')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : '兑换失败')
    } finally {
      setIsSwapping(false)
    }
  }

  const busy = isLoading || isSwapping || swapMutation.isPending || isSending

  return (
    <Card className="border-indigo-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <span>💱</span>
          <span>OKX 快速兑换（ETH → USDC）</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-gray-500">
          通过 OKX DEX 聚合器在<strong>以太坊主网</strong>兑换（约 0.001 ETH → USDC）。
          Monad 上的 MON 请继续用于本游戏内购买种子。
        </p>

        {onWrongChain && (
          <div className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            当前网络：{chain?.name ?? '未知'}。执行兑换需切换到以太坊主网。
          </div>
        )}

        {isConfigError && <OkxSetupHint title="OKX Swap" />}

        {isLoading && <p className="text-sm text-gray-500 text-center py-4">获取报价中…</p>}

        {isError && !isConfigError && (
          <p className="text-sm text-red-600">
            {error instanceof Error ? error.message : '报价加载失败'}
          </p>
        )}

        {quote && !isLoading && !isError && (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <QuoteItem label="卖出" value="ETH" />
            <QuoteItem
              label="预计获得"
              value={
                quote.toTokenAmount
                  ? `${(Number(quote.toTokenAmount) / 1e6).toFixed(4)} USDC`
                  : '—'
              }
            />
            <QuoteItem
              label="价格影响"
              value={
                quote.priceImpactPercentage ? `${quote.priceImpactPercentage}%` : '—'
              }
            />
            <QuoteItem label="预估 Gas" value={quote.estimateGasFee ?? '—'} />
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => refetch()} disabled={busy}>
            刷新报价
          </Button>
          <Button
            size="sm"
            onClick={handleSwap}
            loading={busy}
            disabled={isConfigError || !quote || busy}
          >
            {isConfigError || !quote ? '等待报价' : '执行兑换'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
