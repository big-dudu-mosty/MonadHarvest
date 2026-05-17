import type { OkxApiResponse } from './types'

export class OkxApiError extends Error {
  constructor(
    message: string,
    public readonly code?: string
  ) {
    super(message)
    this.name = 'OkxApiError'
  }
}

export async function okxGet<T>(path: string, params?: Record<string, string | number | boolean>) {
  const search = params
    ? `?${new URLSearchParams(
        Object.entries(params).map(([k, v]) => [k, String(v)])
      ).toString()}`
    : ''

  const response = await fetch(`/api/okx${path}${search}`)
  const json = (await response.json()) as OkxApiResponse<T> & { msg?: string; code?: string }

  if (!response.ok) {
    throw new OkxApiError(json.msg || `HTTP ${response.status}`, json.code)
  }

  if (json.code !== '0') {
    throw new OkxApiError(json.msg || 'OKX API error', json.code)
  }

  return json.data
}
