import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { useWindowWidth } from './screenWidthHook'

const TestComponent = (): React.ReactElement => {
  const width = useWindowWidth()
  return (
    <div>
      Width: {width}
    </div>
  )
}

describe('screenWidthHook', () => {
  test('hook exports width', () => {
    render(<TestComponent />)
    window.innerWidth = 100
    window.innerHeight = 100

    fireEvent(window, new Event('resize'))

    expect(screen.getByText(/^Width:/).textContent).toBe(
      'Width: 100'
    )
  })
})
