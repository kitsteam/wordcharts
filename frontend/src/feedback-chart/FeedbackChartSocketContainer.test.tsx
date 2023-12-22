import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'

import { WebsocketContext } from '../shared/PhoenixWebsocketProvider'
import { FeedbackChartSocketContainer } from './FeedbackChartSocketContainer'
import { MemoryRouter } from 'react-router-dom'
import { IntlProvider } from 'react-intl'

describe('FeedackSocketContainer', () => {
  test('without adminId renders admin component', () => {
    const route = '/feedback/charts/123'

    render(
      <IntlProvider locale={'en'} defaultLocale="en">
        <MemoryRouter initialEntries={[route]}>
          <WebsocketContext.Provider value={{ adminId: undefined, id: 'id', socket: undefined, channel: undefined }}>
            <FeedbackChartSocketContainer />
          </WebsocketContext.Provider>
        </MemoryRouter>
      </IntlProvider>
    )

    expect(screen.queryByTestId('settings-button')).toBeNull()
  })

  test('with adminId available renders admin component', () => {
    const route = '/feedback/charts/123'

    render(
      <IntlProvider locale={'en'} defaultLocale="en">
        <MemoryRouter initialEntries={[route]}>
          <WebsocketContext.Provider value={{ adminId: 'adminId', id: 'id', socket: undefined, channel: undefined }}>
            <FeedbackChartSocketContainer />
          </WebsocketContext.Provider>
        </MemoryRouter>
      </IntlProvider>
    )

    expect(screen.getByTestId('share-feedback-button')).toBeDefined()
  })
})
