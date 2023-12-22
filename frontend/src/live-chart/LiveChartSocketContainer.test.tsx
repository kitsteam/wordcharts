import { describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

import { WebsocketContext } from '../shared/PhoenixWebsocketProvider'
import { LiveChartSocketContainer } from './LiveChartSocketContainer'
import { MemoryRouter } from 'react-router-dom'
import { IntlProvider } from 'react-intl'

describe('LiveChartSocketContainer', () => {
  test('without adminId renders admin component', () => {
    const route = '/feedback/charts/123'
    const ResizeObserverMock = vi.fn(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn()
    }))

    vi.stubGlobal('ResizeObserver', ResizeObserverMock)

    render(
      <IntlProvider locale={'en'} defaultLocale="en">
        <MemoryRouter initialEntries={[route]}>
          <WebsocketContext.Provider value={{ adminId: undefined, id: 'id', socket: undefined, channel: undefined }}>
            <LiveChartSocketContainer />
          </WebsocketContext.Provider>
        </MemoryRouter>
      </IntlProvider>
    )

    expect(screen.queryByText(/Clear/i)).toBeNull()
  })

  test('with adminId available renders admin component', () => {
    const route = '/feedback/charts/123'

    render(
      <IntlProvider locale={'en'} defaultLocale="en">
        <MemoryRouter initialEntries={[route]}>
          <WebsocketContext.Provider value={{ adminId: 'adminId', id: 'id', socket: undefined, channel: undefined }}>
            <LiveChartSocketContainer />
          </WebsocketContext.Provider>
        </MemoryRouter>
      </IntlProvider>
    )

    expect(screen.getByText(/Clear/i)).toBeDefined()
  })
})
