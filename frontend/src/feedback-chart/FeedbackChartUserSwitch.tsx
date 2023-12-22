import { FeedbackChartUserPage } from './FeedbackChartUserPage'
import { FeedbackChartSocketContainer } from './FeedbackChartSocketContainer'
import { PhoenixWebsocketProvider } from '../shared/PhoenixWebsocketProvider'
import { RestChartProvider } from './RestChartProvider'
import { useLocation } from 'react-router-dom'
import { parseAdminId } from '../shared/utils'

function FeedbackChartUserSwitch(): React.ReactElement {
  const { hash } = useLocation()
  const adminId = parseAdminId(hash)

  // Admins get a phoenix websoket provider to receive updates to the chart in realtime.
  // Users (-> people who give feedback) get a RestChartProvider, because they only need to add words.
  return (
    <div>
      {adminId !== undefined &&
        <PhoenixWebsocketProvider><FeedbackChartSocketContainer /></PhoenixWebsocketProvider>
      }
      {adminId === undefined &&
        <RestChartProvider><FeedbackChartUserPage /></RestChartProvider>
      }
    </div>
  )
}

export { FeedbackChartUserSwitch }
