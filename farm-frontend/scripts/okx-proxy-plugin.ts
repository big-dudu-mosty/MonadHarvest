import crypto from 'node:crypto'
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'
import { loadEnv } from 'vite'

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks).toString()))
    req.on('error', reject)
  })
}

export function okxProxyPlugin(): Plugin {
  return {
    name: 'okx-dev-proxy',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/okx/')) {
          return next()
        }

        const env = loadEnv(server.config.mode, server.config.root, '')
        const apiKey = env.OKX_API_KEY
        const secretKey = env.OKX_SECRET_KEY
        const passphrase = env.OKX_API_PASSPHRASE || env.OKX_PASSPHRASE

        if (!apiKey || !secretKey || !passphrase) {
          writeJson(res, 503, {
            code: 'CONFIG',
            msg: '请在 farm-frontend/.env 配置 OKX_API_KEY、OKX_SECRET_KEY、OKX_API_PASSPHRASE',
          })
          return
        }

        try {
          const incoming = new URL(req.url, 'http://localhost')
          const okxPath = incoming.pathname.replace(/^\/api\/okx/, '/api/v6') + incoming.search
          const requestPath = okxPath.split('?')[0] ?? okxPath
          const queryString = incoming.search || ''
          const method = (req.method || 'GET').toUpperCase()

          let body = ''
          if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
            body = await readBody(req)
          }

          const timestamp = new Date().toISOString()
          const signPayload =
            method === 'GET' || method === 'DELETE'
              ? timestamp + method + requestPath + queryString
              : timestamp + method + requestPath + body

          const sign = crypto
            .createHmac('sha256', secretKey)
            .update(signPayload)
            .digest('base64')

          const response = await fetch(`https://web3.okx.com${okxPath}`, {
            method,
            headers: {
              'Content-Type': 'application/json',
              'OK-ACCESS-KEY': apiKey,
              'OK-ACCESS-SIGN': sign,
              'OK-ACCESS-TIMESTAMP': timestamp,
              'OK-ACCESS-PASSPHRASE': passphrase,
            },
            body: method === 'GET' || method === 'DELETE' ? undefined : body || undefined,
          })

          const text = await response.text()
          res.statusCode = response.status
          res.setHeader('Content-Type', 'application/json')
          res.end(text)
        } catch (error) {
          writeJson(res, 500, {
            code: '500',
            msg: error instanceof Error ? error.message : 'OKX proxy error',
          })
        }
      })
    },
  }
}

function writeJson(res: ServerResponse, status: number, payload: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(payload))
}
