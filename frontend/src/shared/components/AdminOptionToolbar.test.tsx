import { describe, expect, test, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { AdminOptionToolbar } from './AdminOptionToolbar'
import { MemoryRouter } from 'react-router-dom'
import { IntlProvider } from 'react-intl'

describe('AdminOptionToolbar', () => {
  const route = '/live/charts/123'
  test('renders color filters if option is active within the toolbar', async () => {
    render(
      <IntlProvider locale={'en'} defaultLocale="en">
        <MemoryRouter initialEntries={[route]}>
          <AdminOptionToolbar
            id={'123'}
            adminId={'456'}
            clearChart={vi.fn()}
            setColorThemeGrey={vi.fn()}
            setColorThemeByCategory={vi.fn()}
            setColorThemeFancy={vi.fn()}
            setRotationAngle={vi.fn()}
            setColorForCategory={vi.fn()}
            setWordFilter={vi.fn()}
            categoryColors={{ default: '#fff' }}
            showSharingOption={false}
            wordChartSettings={{}}
            filterFromServer={[]}
          />
        </MemoryRouter>
      </IntlProvider>
    )

    await waitFor(() => {
      expect(screen.getByText(/^Change to grammatical category/).textContent).toBe(
        'Change to grammatical category'
      )
    })
  })

  test('renders option card if pressed', async () => {
    render(
      <IntlProvider locale={'en'} defaultLocale="en">
        <MemoryRouter initialEntries={[route]}>
          <AdminOptionToolbar
            id={'123'}
            adminId={'456'}
            clearChart={vi.fn()}
            setColorThemeGrey={vi.fn()}
            setColorThemeByCategory={vi.fn()}
            setColorThemeFancy={vi.fn()}
            setRotationAngle={vi.fn()}
            setColorForCategory={vi.fn()}
            setWordFilter={vi.fn()}
            categoryColors={{ default: '#fff' }}
            showSharingOption={false}
            wordChartSettings={{}}
            filterFromServer={[]}
          />
        </MemoryRouter>
      </IntlProvider>
    )

    fireEvent.click(screen.getByTestId('settings-button'))

    await waitFor(() => {
      expect(screen.getByText(/^Colors/).textContent).toBeTruthy()
    })
  })

  test('does not render grammatic color selection button if no color functions are given', () => {
    render(
      <IntlProvider locale={'en'} defaultLocale="en">
        <MemoryRouter initialEntries={[route]}>
          <AdminOptionToolbar
            id={'123'}
            adminId={'456'}
            clearChart={vi.fn()}
            setColorThemeGrey={vi.fn()}
            setRotationAngle={vi.fn()}
            setWordFilter={vi.fn()}
            showSharingOption={false}
            wordChartSettings={{}}
            filterFromServer={[]}
          />
        </MemoryRouter>
      </IntlProvider>
    )
    fireEvent.click(screen.getByTestId('settings-button'))

    expect(screen.queryByText(/^Change to Grammatical Category/)).toBeNull()
    expect(screen.queryByTestId('settings-admin-settings-option-filter-category')).toBeNull()
  })

  test('calls clear chart when clear button is pressed', () => {
    const clearChartMock = vi.fn()
    clearChartMock.mockImplementationOnce(() => { })

    render(
      <IntlProvider locale={'en'} defaultLocale="en">
        <MemoryRouter initialEntries={[route]}>
          <AdminOptionToolbar
            id={'123'}
            adminId={'456'}
            clearChart={clearChartMock}
            setColorThemeGrey={vi.fn()}
            setColorThemeFancy={vi.fn()}
            setRotationAngle={vi.fn()}
            setWordFilter={vi.fn()}
            showSharingOption={false}
            wordChartSettings={{}}
            filterFromServer={[]}
          />
        </MemoryRouter>
      </IntlProvider>
    )

    expect(screen.getByText(/^Clear/)).toBeDefined()
    fireEvent.click(screen.getByText(/Clear/i))
    expect(clearChartMock).toHaveBeenCalled()
  })
})
