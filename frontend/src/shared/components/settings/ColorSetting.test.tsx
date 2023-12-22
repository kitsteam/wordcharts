import { describe, expect, test, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { ColorSetting } from './ColorSetting'
import { IntlProvider } from 'react-intl'
import { themeGreyColors, themeMixedColors } from '../../colors'

describe('ColorSetting', () => {
  const reactWordchartSettings = {}

  test('renders color filters if grammar option is active', async () => {
    render(
      <IntlProvider locale={'en'} defaultLocale="en">
        <ColorSetting
          setColorThemeGrey={vi.fn()}
          setColorThemeByCategory={vi.fn()}
          setColorThemeFancy={vi.fn()}
          setColorForCategory={vi.fn()}
          categoryColors={{ default: '#fff' }}
          wordChartSettings={reactWordchartSettings}
        />
      </IntlProvider>
    )

    await waitFor(() => {
      expect(screen.getByText(/^Please select a color/)).toBeDefined()
    })
  })

  test('does not render color filters if grey option is active', async () => {
    render(
      <IntlProvider locale={'en'} defaultLocale="en">
        <ColorSetting
          setColorThemeGrey={vi.fn()}
          setColorThemeByCategory={vi.fn()}
          setColorThemeFancy={vi.fn()}
          setColorForCategory={vi.fn()}
          categoryColors={{ default: '#fff' }}
          wordChartSettings={{ colors: themeGreyColors }}
        />
      </IntlProvider>
    )

    await waitFor(() => {
      expect(screen.queryByText(/^Please select a color/)).toBeNull()
    })
  })

  test('does not render color filters if colorful option is active', async () => {
    render(
      <IntlProvider locale={'en'} defaultLocale="en">
        <ColorSetting
          setColorThemeGrey={vi.fn()}
          setColorThemeByCategory={vi.fn()}
          setColorThemeFancy={vi.fn()}
          setColorForCategory={vi.fn()}
          categoryColors={{ default: '#fff' }}
          wordChartSettings={{ colors: themeMixedColors }}
        />
      </IntlProvider>
    )

    await waitFor(() => {
      expect(screen.queryByText(/^Please select a color/)).toBeNull()
    })
  })
})
