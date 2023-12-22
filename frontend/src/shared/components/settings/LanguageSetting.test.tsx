import { describe, expect, test } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { IntlProvider } from 'react-intl'
import { LanguageSetting } from './LanguageSetting'

describe('LanguageSetting', () => {
  test('renders language setting', async () => {
    render(
      <IntlProvider locale={'en'} defaultLocale="en">
        <LanguageSetting
          language={'de'}
          setLanguage={() => {}}
        />
      </IntlProvider>
    )

    await waitFor(() => {
      expect(screen.getByText(/^Language/)).toBeDefined()
    })
  })

  test('not renders language settings when handler is missing', async () => {
    render(
      <IntlProvider locale={'en'} defaultLocale="en">
        <LanguageSetting
          language={'de'}
        />
      </IntlProvider>
    )

    await waitFor(() => {
      expect(screen.queryByText(/^Language/)).toBeNull()
    })
  })
})
