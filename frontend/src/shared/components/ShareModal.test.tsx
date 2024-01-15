import { describe, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { IntlProvider } from 'react-intl'
import { ShareModal } from './ShareModal'

describe('ShareModal', () => {
  test('renders the share modal', () => {
    render(
      <IntlProvider locale={'en'} defaultLocale="en">
        <ShareModal handleClose={vi.fn()} adminId={'123'} />
      </IntlProvider>
    )

    expect(screen.getByText(/^Share/).textContent).toBe(
      'Share'
    )
  })
})
