import { describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WebsocketContext } from '../shared/PhoenixWebsocketProvider'
import { LiveChartAdminPage } from './LiveChartAdminPage'
import { defaultWordchartSettings } from '../shared/defaultChartSettings'
import { MemoryRouter } from 'react-router-dom'
import { GrammaticalCategoryColors } from '../shared/types'
import { IntlProvider } from 'react-intl'

describe('LiveChartAdminPage', () => {
  test('renders the word chart', () => {
    const ResizeObserverMock = vi.fn(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn()
    }))

    vi.stubGlobal('ResizeObserver', ResizeObserverMock)

    const route = '/feedback/charts/123'
    const categoryColors: GrammaticalCategoryColors = {
      noun: '#ff0000',
      verb: '#c0c0c0',
      adjective: '#000000',
      default: '000000'
    }
    render(
      <IntlProvider locale={'en'} defaultLocale="en">
        <MemoryRouter initialEntries={[route]}>
          <WebsocketContext.Provider value={{ adminId: 'adminId', id: 'id', socket: undefined, channel: undefined }}>
            <LiveChartAdminPage
              reactWordchartSettingsFromServer={defaultWordchartSettings}
              words={[{ name: 'word', value: 1, grammatical_categories: [] }]}
              filterFromServer={[]}
              colorsFromServer={categoryColors}
              language="de"
            />
          </WebsocketContext.Provider>
        </MemoryRouter>
      </IntlProvider>
    )
    expect(screen.getByTestId('react-word-cloud')).toBeDefined()
  })
})
