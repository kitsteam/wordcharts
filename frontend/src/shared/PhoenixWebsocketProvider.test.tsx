import React, { useContext } from 'react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { render, RenderResult, screen } from '@testing-library/react'

import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { PhoenixWebsocketProvider, WebsocketContext, WebsocketContextInterface } from './PhoenixWebsocketProvider'
import { Socket } from 'phoenix'

const TestComponent = (): React.ReactElement => {
  const { id, adminId } = useContext<WebsocketContextInterface>(WebsocketContext)
  return (
    <div>
      <p>id: {id}</p>
      <p>adminId: {adminId}</p>
    </div>)
}

vi.mock('phoenix', () => {
  const Socket = vi.fn()
  Socket.prototype.connect = vi.fn()
  Socket.prototype.channel = vi.fn()
  Socket.prototype.disconnect = vi.fn()

  const Channel = vi.fn()
  return { Socket, Channel }
})

describe('PhoenixWebsocketProvider', () => {
  let socket: Socket

  beforeEach(() => {
    socket = new Socket('localhost')
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  const customRender = (route: string): RenderResult =>
    render(
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/live/charts/:id" element={<PhoenixWebsocketProvider><TestComponent /></PhoenixWebsocketProvider>} />
        </Routes>
      </MemoryRouter>
    )

  test('with id provides id', () => {
    const route = '/live/charts/123'

    customRender(route)
    expect(screen.getByText(/^id:/).textContent).toBe(
      'id: 123'
    )
  })

  test('socket has been connected', () => {
    const route = '/live/charts/123'

    customRender(route)
    expect(socket.connect).toHaveBeenCalled()
  })

  test('channel has been created', () => {
    const route = '/live/charts/123'

    customRender(route)
    expect(socket.channel).toBeCalledWith('chart:123', {})
  })
})
