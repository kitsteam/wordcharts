import React, { useContext } from 'react'
import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'

import { RestChartContext, RestChartContextInterface, RestChartProvider } from './RestChartProvider'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { IntlProvider } from 'react-intl'

const TestComponent = (): React.ReactElement => {
  const { id, adminId, chart, chartLoaded } = useContext<RestChartContextInterface>(RestChartContext)
  return (
    <div>
      <p>id: {id}</p>
      <p>adminId: {adminId}</p>
      <p>chart: {chart?.name}</p>
      <p>chartLoaded: {chartLoaded ? 'true' : 'false'}</p>
    </div>)
}

describe('RestChartProvider', () => {
  beforeAll(() => {
    vi.stubGlobal('fetch', (_input: RequestInfo | URL, _init: RequestInit | undefined) => {
      return new Response('{"name": "test"}', { status: 200 })
    })
  })

  test('with id provides id', () => {
    const route = '/feedback/charts/123'

    render(
      <IntlProvider locale={'en'} defaultLocale="en">
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path="/feedback/charts/:id" element={<RestChartProvider><TestComponent /></RestChartProvider>} />
          </Routes>
        </MemoryRouter>
      </IntlProvider>
    )
    expect(screen.getByText(/^id:/).textContent).toBe(
      'id: 123'
    )
  })

  test('with adminId provides adminId', () => {
    const route = '/feedback/charts/123#adminId=456'

    render(
      <IntlProvider locale={'en'} defaultLocale="en">
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path="/feedback/charts/:id" element={<RestChartProvider><TestComponent /></RestChartProvider>} />
          </Routes>
        </MemoryRouter>
      </IntlProvider>
    )
    expect(screen.getByText(/^adminId:/).textContent).toBe(
      'adminId: 456'
    )
  })

  test('with adminId provides chart', async () => {
    const route = '/feedback/charts/123#adminId=456'

    vi.stubGlobal('fetch', (_input: RequestInfo | URL, _init: RequestInit | undefined) => {
      return new Response('{"name": "test"}', { status: 200 })
    })

    render(
      <IntlProvider locale={'en'} defaultLocale="en">
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path="/feedback/charts/:id" element={<RestChartProvider><TestComponent /></RestChartProvider>} />
          </Routes>
        </MemoryRouter>
      </IntlProvider>
    )

    await waitFor(() => {
      expect(screen.getByText(/^chart:/).textContent).toBe(
        'chart: test'
      )
    })
  })

  afterAll(() => {
    vi.unstubAllGlobals()
  })
})
