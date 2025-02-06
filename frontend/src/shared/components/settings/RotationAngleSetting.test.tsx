import { describe, expect, test } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { IntlProvider } from 'react-intl'
import { RotationAngleSetting } from './RotationAngleSetting'

describe('RotationAngleSetting', () => {
  test('renders rotation angle setting', async () => {
    render(
      <IntlProvider locale={'en'} defaultLocale="en">
        <RotationAngleSetting
          setRotationAngle={(_value: number) => {}}
        />
      </IntlProvider>
    )

    await waitFor(() => {
      expect(screen.getByText(/^Limit rotation angle to 0°/)).toBeDefined()
    })
  })

  test('if toggle is clicked set to 0 degree', async () => {
    let result: number | null = null

    const setResult = (value: number): void => { result = value }
    render(
      <IntlProvider locale={'en'} defaultLocale="en">
        <RotationAngleSetting setRotationAngle={setResult}></RotationAngleSetting>
      </IntlProvider>
    )

    fireEvent.click(screen.getByTestId('toggle-check'))

    expect(result).toEqual(0)
  })
})
