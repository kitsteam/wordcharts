import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WebsocketContext } from '../shared/PhoenixWebsocketProvider'
import { defaultWordchartSettings } from '../shared/defaultChartSettings'
import { LiveChartUserPage } from './LiveChartUserPage'
import { GrammaticalCategoryColors } from '../shared/types'
import { IntlProvider } from 'react-intl'

describe('LiveChartUserPage', () => {
  test('renders the word chart', () => {
    const categoryColors: GrammaticalCategoryColors = {
      noun: '#ff0000',
      verb: '#c0c0c0',
      adjective: '#000000',
      default: '#fff'
    }
    render(
      <IntlProvider locale={'en'} defaultLocale="en">
        <WebsocketContext.Provider value={{ adminId: 'adminId', id: 'id', socket: undefined, channel: undefined }}>
          <LiveChartUserPage
            reactWordchartSettings={defaultWordchartSettings}
            words={[{ name: 'word', value: 1, grammatical_categories: [] }]}
            currentWordFilter={[]}
            wordColors={categoryColors} language={'en'}
          />
        </WebsocketContext.Provider>
      </IntlProvider>
    )

    expect(screen.getByTestId('react-word-cloud')).toBeDefined()
  })
})
