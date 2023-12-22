import { describe, expect, test } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { CopyButton } from './CopyButton'
import { IntlProvider } from 'react-intl'
import { setUpClipboard, tearDownClipboard } from 'jest-clipboard'

describe('CopyButton', () => {
  test('if component is loading', () => {
    render(
      <IntlProvider locale={'en'} defaultLocale="en">
        <CopyButton contentToCopy='Content to copy'></CopyButton>
      </IntlProvider>
    )
    expect(screen.getByText(/Copy/i)).toBeDefined()
  })

  test('if button is clicked', async () => {
    setUpClipboard()
    render(
      <IntlProvider locale={'en'} defaultLocale="en">
        <CopyButton contentToCopy='Content to copy' ></CopyButton>
      </IntlProvider>
    )

    fireEvent.click(screen.getByText('Copy'))

    await waitFor(() => {
      expect(screen.getByText(/copied/i)).toBeDefined()
    })
    tearDownClipboard()
  })
})
