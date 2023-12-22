import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { WebsocketContext } from '../shared/PhoenixWebsocketProvider'
import { TextInputForm } from './TextInputForm'
import { Channel } from 'phoenix'
import { IntlProvider } from 'react-intl'

describe('TestInputForm', () => {
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
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  test('clicking submit when a channel is given', () => {
    render(
      <IntlProvider locale={'en'} defaultLocale="en">
        <WebsocketContext.Provider value={{ adminId: 'adminId', id: 'id', socket: undefined, channel }}>
          <TextInputForm />
        </WebsocketContext.Provider>
      </IntlProvider>
    )

    const element = screen.getByTestId('test-input-control-text')

    fireEvent.change(element, { target: { value: 'Text' } })
    fireEvent.click(screen.getByText(/Add Text/i))

    expect(channel.push).toBeCalledWith('new_words', { words: 'Text', admin_url_id: 'adminId' })
  })

  test('pressing enter submits the form', () => {
    render(
      <IntlProvider locale={'en'} defaultLocale="en">
        <WebsocketContext.Provider value={{ adminId: 'adminId', id: 'id', socket: undefined, channel }}>
          <TextInputForm />
        </WebsocketContext.Provider>
      </IntlProvider>
    )

    const element = screen.getByTestId('test-input-control-text')

    fireEvent.change(element, { target: { value: 'Text' } })
    fireEvent.keyPress(element, { key: 'Enter', charCode: 13 })
    expect(channel.push).toBeCalledWith('new_words', { words: 'Text', admin_url_id: 'adminId' })
  })
})
