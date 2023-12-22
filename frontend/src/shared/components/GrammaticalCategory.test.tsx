import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { WebsocketContext } from '../PhoenixWebsocketProvider'
import { GrammaticalCategory } from './GrammaticalCategory'
import { Channel } from 'phoenix'
import { IntlProvider } from 'react-intl'

describe('GrammaticalCategory', () => {
  vi.mock('phoenix', () => {
    const Socket = vi.fn()
    Socket.prototype.connect = vi.fn()
    Socket.prototype.channel = vi.fn()
    Socket.prototype.disconnect = vi.fn()

    const Channel = vi.fn()
    Channel.prototype.push = vi.fn(() => ({ receive: vi.fn() }))
    return { Socket, Channel }
  })

  let channel: Channel

  beforeEach(() => {
    channel = new Channel('chart:123')
    channel.state = 'joined'
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  test('changing grammatical category when a channel is given', async () => {
    render(
      <IntlProvider locale={'en'} defaultLocale="en">
        <WebsocketContext.Provider value={{ adminId: 'adminId', id: 'id', socket: undefined, channel }}>
          <GrammaticalCategory word="Example" category="noun" />
        </WebsocketContext.Provider>
      </IntlProvider>
    )

    // open dropdown:
    fireEvent.click(screen.getByText('noun'))

    // expect button with verb to be present in the dropdown:
    expect(await screen.findByText('verb')).toBeDefined()

    // select the verb button:
    fireEvent.click(screen.getByTestId('test-category-dropdown-button-verb'))

    // button-1 is verb
    expect(channel.push).toBeCalledWith('change_grammatical_category', { word_name: 'Example', admin_url_id: 'adminId', grammatical_category: 'verb' })
  })
})
