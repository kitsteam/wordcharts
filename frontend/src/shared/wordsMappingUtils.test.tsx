import { describe, expect, test, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { mapCategoriesAsLabels, wordsAsTableRows } from './wordsMappingUtils'
import { IntlProvider } from 'react-intl'

describe('AdminOptionToolbar', () => {
  describe('wordsAsTableRows', () => {
    const setup = (mock = vi.fn()): void => {
      render(
        <IntlProvider locale={'en'} defaultLocale="en">
          {wordsAsTableRows([{ name: 'Test', value: 4, grammatical_categories: ['noun'] }], mock)}
        </IntlProvider>
      )
    }

    test('renders the table with the name of the word and the value', () => {
      setup()
      expect(screen.getByText(/^Test/).textContent).toBe(
        '4 Test'
      )
    })

    test('renders the table with the category', () => {
      setup()
      expect(screen.getByText(/^noun/).textContent).toBe(
        'noun'
      )
    })

    test('renders the table with the trash icon', async () => {
      setup()
      expect(await screen.findByTestId('delete-word')).toBeDefined()
    })

    test('callback is triggered on delete press', async () => {
      const mock = vi.fn()
      setup(mock)
      const button = await screen.findByTestId('delete-word')
      fireEvent.click(button)

      expect(mock).toBeCalled()
    })
  })

  describe('mapCategoriesAsLabels', () => {
    const setup = (): void => {
      render(<IntlProvider locale={'en'} defaultLocale="en">{mapCategoriesAsLabels(['noun', 'adjective'], { adjective: '#FF0000', noun: '#000000', verb: '#FFFFFF', default: '#000000' })}</IntlProvider>)
    }

    test('renders the noun pill', () => {
      setup()
      expect(screen.getByTestId('test-pill-0').textContent).toBe(
        'noun'
      )
    })

    test('renders the noun pill with specified color', () => {
      setup()
      expect(screen.getByTestId('test-pill-0')).toHaveProperty(
        'style',
        (expect.objectContaining({ backgroundColor: 'rgb(0, 0, 0)' }))
      )
    })

    test('renders the adjective pill', () => {
      setup()
      expect(screen.getByTestId('test-pill-1').textContent).toBe(
        'adjective'
      )
    })

    test('renders the noun pill with specified color', () => {
      setup()
      expect(screen.getByTestId('test-pill-1')).toHaveProperty(
        'style',
        (expect.objectContaining({ backgroundColor: 'rgb(255, 0, 0)' }))
      )
    })

    test('when no categories are given', () => {
      render(<IntlProvider locale={'en'} defaultLocale="en">{mapCategoriesAsLabels([], { default: '#000000' })}</IntlProvider>)
      expect(screen.getByTestId('test-pill-all').textContent).toBe(
        'All categories'
      )
    })
  })
})
