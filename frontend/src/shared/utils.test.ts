import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest'
import { parseAdminId, cleanUrlFromAdminId, fileUrlToBase64 } from './utils'

describe('parseAdminId', () => {
  test('parsing admin id when given', () => {
    expect(parseAdminId('#adminId=123')).toEqual('123')
  })

  test('parsing undefined admin id if none given', () => {
    expect(parseAdminId('')).toBeUndefined()
  })
})

describe('cleanUrlFromAdminId', () => {
  test('removing admin id when given', () => {
    expect(cleanUrlFromAdminId('http://localhost/live/charts/123#adminId=123')).toEqual('http://localhost/live/charts/123')
  })

  test('does not crash without admin Id', () => {
    expect(cleanUrlFromAdminId('http://localhost/live/charts/123')).toEqual('http://localhost/live/charts/123')
  })
})

describe('fileUrlToBase64', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  beforeAll(async () => {
    const blob = new Blob(['a'], { type: 'plain/txt' })

    const fetchMock = vi.fn(() => ({
      blob: vi.fn(() => blob)
    }))

    vi.stubGlobal('fetch', fetchMock)
  })

  test('removing admin id when given', async () => {
    expect(await fileUrlToBase64('')).toEqual('data:plain/txt;base64,YQ==')
  })
})
