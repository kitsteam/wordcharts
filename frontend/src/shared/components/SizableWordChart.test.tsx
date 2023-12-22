import React from 'react'
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { SizableWordChart } from './SizableWordChart'
import { defaultWordchartSettings } from '../defaultChartSettings'
import { GrammaticalCategoryColors, ReactWordcloudSettings } from '../types'
import { Callbacks, Word } from 'react-wordcloud'
import { IntlProvider } from 'react-intl'

describe('SizableWordChart', () => {
  beforeAll(() => {
    vi.mock('react-wordcloud', () => {
      const ReactWordCloud = ({ options, words, callbacks }: { options: ReactWordcloudSettings, words: Word[], callbacks: Callbacks }): React.ReactElement => {
        const color = callbacks.getWordColor != null ? callbacks.getWordColor(words[0]) : ''
        return (<div data-testid="react-word-cloud">
          <p>Word: {words?.at(0)?.text}</p>
          <p>Font Size Max: {options?.fontSizes?.at(1)}</p>
          {words.length > 0 &&
          <p>
            {`Callback Result: ${color as string}`}
          </p>
          }
        </div>)
      }

      const defaultCallbacks = {
        getWordTooltip: ({ text, value }: { text: string, value: number }) => `${text} (${value})`
      }
      return { ReactWordCloud, defaultCallbacks }
    })
  })
  afterEach(() => {
    vi.clearAllMocks()
  })

  test('renders the word chart words', () => {
    render(
      <IntlProvider locale={'en'} defaultLocale="en">
        <SizableWordChart words={[{ name: 'word', value: 1, grammatical_categories: ['noun'] }]} options={defaultWordchartSettings} />
      </IntlProvider>
    )

    expect(screen.getByText(/^Word:/).textContent).toBe(
      'Word: word'
    )
  })

  test('font size changes depending of page width', () => {
    render(
      <IntlProvider locale={'en'} defaultLocale="en">
        <SizableWordChart words={[{ name: 'word', value: 1, grammatical_categories: ['noun'] }]} options={defaultWordchartSettings} />
      </IntlProvider>
    )
    window.innerWidth = 100
    window.innerHeight = 100

    fireEvent(window, new Event('resize'))

    expect(screen.getByText(/^Font Size Max:/).textContent).toBe(
      'Font Size Max: 15'
    )
  })

  test('renders the word chart with colors', () => {
    const categoryColors: GrammaticalCategoryColors = {
      noun: '#ff0000',
      verb: '#c0c0c0',
      adjective: '#000000',
      default: '#000000'
    }
    const newChartSettings = { ...defaultWordchartSettings, colors: [] }
    render(
      <IntlProvider locale={'en'} defaultLocale="en">
        <SizableWordChart words={[{ name: 'word', value: 1, grammatical_categories: ['noun'] }]} options={newChartSettings} categoryColors={categoryColors} />
      </IntlProvider>
    )

    expect(screen.getByText(/^Callback Result:/).textContent).toBe(
      'Callback Result: #ff0000'
    )
  })
})
