import React, { useState, useEffect } from 'react'
import {
  useLocation,
  useParams
} from 'react-router-dom'
import { Socket, Channel } from 'phoenix'
import { ChannelName } from './types'
import { parseAdminId } from './utils'
import { WEBSOCKET_URL } from './api'

export interface WebsocketContextInterface {
  socket: Socket | undefined
  channel: Channel | undefined
  id: string | undefined
  adminId: string | undefined
}

export const WebsocketContext = React.createContext<WebsocketContextInterface>({ socket: undefined, channel: undefined, id: undefined, adminId: undefined })

export const PhoenixWebsocketProvider = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const [socket, setSocket] = useState<Socket>()
  const [channel, setChannel] = useState<Channel>()
  const { id } = useParams()
  const { hash } = useLocation()
  const adminId = parseAdminId(hash)

  useEffect(() => {
    if (id === undefined) return

    const socket = new Socket(WEBSOCKET_URL)
    socket.connect()
    setSocket(socket)

    const channelString: ChannelName = `chart:${id}`
    const newChannel = socket.channel(channelString, {})
    setChannel(newChannel)

    return () => {
      socket.disconnect()
    }
  }, [id])

  return (
    <WebsocketContext.Provider value={{ socket, channel, id, adminId }}>
      {children}
    </WebsocketContext.Provider>
  )
}
