import React, { useState, useEffect } from 'react'
import {
  useParams,
  useLocation
} from 'react-router-dom'
import { parseAdminId } from '../shared/utils'
import { ServerChart } from '../shared/types'
import { restFetchResource } from '../shared/api'

export interface RestChartContextInterface {
  adminId: string | undefined
  id: string | undefined
  chart: ServerChart | undefined
  chartLoaded: boolean
}

export const RestChartContext = React.createContext<RestChartContextInterface>({ adminId: undefined, id: undefined, chart: undefined, chartLoaded: false })

export const RestChartProvider = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const { hash } = useLocation()
  const adminId = parseAdminId(hash)
  const { id } = useParams()
  const [chart, setChart] = useState<ServerChart>()
  const [chartLoaded, setChartLoaded] = useState<boolean>(false)

  useEffect(() => {
    const fetchChart = async (): Promise<void> => {
      if (adminId === undefined) return
      if (id === undefined) return

      const json: ServerChart = await restFetchResource(id, adminId)

      setChart(json)
      setChartLoaded(true)
    }

    fetchChart().catch((reason) => {
      console.log(reason)
    })
  }, [adminId, id])

  return (
    <RestChartContext.Provider value={{ id, adminId, chart, chartLoaded }}>
      {children}
    </RestChartContext.Provider>
  )
}
