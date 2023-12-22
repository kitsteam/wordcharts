import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FeedbackChartAdminPage } from './FeedbackChartAdminPage'
import { MemoryRouter } from 'react-router-dom'
import { IntlProvider } from 'react-intl'
import { WebsocketContext } from '../shared/PhoenixWebsocketProvider'
import { GrammaticalCategoryColors, ServerWord } from '../shared/types'

describe('FeedbackChartAdminPage', () => {
  const route = '/feedback/charts/123'
  const reactWordchartSettings = {}
  const categoryColors: GrammaticalCategoryColors = {
    noun: '#ff0000',
    verb: '#c0c0c0',
    adjective: '#000000',
    default: '000000'
  }
  const words: ServerWord[] = []

  test('if component has loaded and chart is present', () => {
    render(
      <IntlProvider locale={'en'} defaultLocale="en">
        <MemoryRouter initialEntries={[route]}>
          <WebsocketContext.Provider value={{ adminId: 'adminId', id: 'id', socket: undefined, channel: undefined }}>
            <FeedbackChartAdminPage
              reactWordchartSettingsFromServer={reactWordchartSettings}
              colorsFromServer={categoryColors}
              words={words}
            />
          </WebsocketContext.Provider>
        </MemoryRouter>
      </IntlProvider>
    )
    expect(screen.getByText(/This word chart is currently empty./i)).toBeDefined()
  })
})
