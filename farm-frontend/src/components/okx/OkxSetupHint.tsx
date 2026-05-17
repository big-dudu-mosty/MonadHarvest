import { Card, CardContent } from '@/components/ui'

interface OkxSetupHintProps {
  title?: string
}

export function OkxSetupHint({ title = 'OKX 链上数据' }: OkxSetupHintProps) {
  return (
    <Card className="border-dashed border-blue-200 bg-blue-50/50">
      <CardContent className="py-4 text-sm text-blue-900 space-y-2">
        <p className="font-medium">{title} — 需要本地配置</p>
        <p className="text-blue-800">
          在 <code className="bg-white/80 px-1 rounded">farm-frontend/.env</code> 添加
          OKX API 密钥后重启 <code className="bg-white/80 px-1 rounded">npm run dev</code>：
        </p>
        <pre className="text-xs bg-white/80 p-2 rounded overflow-x-auto">
{`OKX_API_KEY=your_key
OKX_SECRET_KEY=your_secret
OKX_API_PASSPHRASE=your_passphrase`}
        </pre>
        <p className="text-xs text-blue-700">
          申请地址：
          <a
            href="https://web3.okx.com/onchain-os/dev-portal"
            target="_blank"
            rel="noreferrer"
            className="underline ml-1"
          >
            OKX Onchain OS 开发者门户
          </a>
        </p>
      </CardContent>
    </Card>
  )
}
