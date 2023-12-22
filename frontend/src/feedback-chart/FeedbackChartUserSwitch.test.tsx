import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FeedbackChartUserSwitch } from './FeedbackChartUserSwitch'
import { IntlProvider } from 'react-intl'
import { MemoryRouter } from 'react-router-dom'

describe('FeedbackChartUserSwitch', () => {
  test('with adminId available', async () => {
    render(
      <IntlProvider locale={'en'} defaultLocale="en">
        <MemoryRouter initialEntries={[{ pathname: '/feedback/charts/abc', hash: '#adminId=123' }]} >
          <FeedbackChartUserSwitch />
        </MemoryRouter>
      </IntlProvider>
    )

    expect(screen.getByTestId('share-feedback-button')).toBeDefined()
  })

  test('without adminId available', () => {
    render(
      <IntlProvider locale={'en'} defaultLocale="en">
        <MemoryRouter initialEntries={[{ pathname: '/feedback/charts/abc', hash: '' }]} >
          <FeedbackChartUserSwitch />
        </MemoryRouter>
      </IntlProvider>
    )
    expect(screen.getByText(/Please enter Feedback/i)).toBeDefined()
  })
})
