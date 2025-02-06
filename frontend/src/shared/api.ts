import { ServerChart } from './types'

export interface FeedbackWords {
  1?: string
  2?: string
  3?: string
  4?: string
  5?: string
}

export const WEBSOCKET_URL = '/socket'

export const NAVIGATION_PATH_PREFIX = ''

export const restFetchResource = async (id: string, adminId: string): Promise<ServerChart> => {
  const serverResponse: Response = await fetch(`/api/charts/${id}`, {
    method: 'GET',
    headers: createRequestHeaders(adminId)
  })
  const json: ServerChart = await serverResponse.json()

  return json
}

export const restClear = async (id: string, adminId: string): Promise<boolean> => {
  const serverResponse = await fetch(`/api/charts/${id}/words`, {
    method: 'DELETE',
    headers: createRequestHeaders(adminId)
  })

  return serverResponse.status === 204
}

export const restUpdateReactWordcloudSettings = async (id: string, adminId: string, chart: ServerChart): Promise<boolean> => {
  const serverResponse = await fetch(`/api/charts/${id}`, {
    method: 'PUT',
    headers: createRequestHeaders(adminId),
    body: JSON.stringify({ chart })
  })

  return serverResponse.status === 200
}

export const restSendFeedback = async (id: string, feedbackWords: FeedbackWords): Promise<boolean> => {
  const serverResponse: Response = await fetch(`/api/charts/${id}/words`, {
    method: 'POST',
    body: JSON.stringify({ words: Object.values(feedbackWords) }),
    headers: { 'Content-Type': 'application/json' }
  })

  return serverResponse.status === 201
}

const createRequestHeaders = (adminId: string): Headers => {
  const requestHeaders = new Headers()
  requestHeaders.set('Content-Type', 'application/json')
  requestHeaders.set('admin-url-id', adminId)
  return requestHeaders
}
