import { vi, describe, expect, test, beforeAll, afterAll } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

import { RestChartContext } from './RestChartProvider'
import { FeedbackChartUserPage } from './FeedbackChartUserPage'
import { IntlProvider } from 'react-intl'

const chart = { grammatical_search_filter: [], name: 'test', language: 'de', chart_type: 'live', id: '123', admin_url_id: '456', settings: {}, words: [], created_at: new Date(), updated_at: new Date() }

describe('FeedbackChartUserPage', () => {
  beforeAll(() => {
    vi.stubGlobal('fetch', (input: RequestInfo | URL, init: RequestInit | undefined) => {
      return {
        status: 201
      }
    })
  })

  afterAll(() => {
    vi.unstubAllGlobals()
  })

  test('if component has loaded and chart is present', () => {
    render(
      <IntlProvider locale={'en'} defaultLocale="en">
        <RestChartContext.Provider value={{ adminId: 'adminId', id: 'id', chart, chartLoaded: true }}>
          <FeedbackChartUserPage />
        </RestChartContext.Provider>
      </IntlProvider>)
    expect(screen.getByText(/Please enter Feedback/i)).toBeDefined()
  })

  test('with empty answers', () => {
    render(
      <IntlProvider locale={'en'} defaultLocale="en">
        <RestChartContext.Provider value={{ adminId: 'adminId', id: 'id', chart, chartLoaded: true }}>
          <FeedbackChartUserPage />
        </RestChartContext.Provider>
      </IntlProvider>)
    fireEvent.click(screen.getByText(/Submit Feedback/i))
    expect(screen.getByText(/Please enter Feedback/i)).toBeDefined()
  })

  test('with filled in answers', async () => {
    render(
      <IntlProvider locale={'en'} defaultLocale="en">
        <RestChartContext.Provider value={{ adminId: '456', id: '123', chart, chartLoaded: true }}>
          <FeedbackChartUserPage />
        </RestChartContext.Provider>
      </IntlProvider>)

    const element = screen.getByTestId('test-input-control-word-0')
    fireEvent.change(element, { target: { value: 'Answer' } })
    fireEvent.click(screen.getByText(/Submit Feedback/i))

    expect(await screen.findByText(/Thank you for providing Feedback!/i)).toBeDefined()
  })
})
