import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'
import { IntlProvider } from 'react-intl'
import StartPage from './start/StartPage'
import { LiveChartSocketContainer } from './live-chart/LiveChartSocketContainer'
import './scss/styles.scss'
import { PhoenixWebsocketProvider } from './shared/PhoenixWebsocketProvider'
import { FeedbackChartUserSwitch } from './feedback-chart/FeedbackChartUserSwitch'
import { NAVIGATION_PATH_PREFIX } from './shared/api'
import de from '../compiled-lang/de.json'
import en from '../compiled-lang/en.json'
import { detectSupportedLanguage } from './shared/utils'

function loadLocaleData(locale: string): Record<string, string> {
  switch (locale) {
    case 'de':
      return de
    default:
        return en
  }
}

const router = createBrowserRouter([
  {
    path: `${NAVIGATION_PATH_PREFIX}`,
    element: <StartPage />
  },
  {
    path: `${NAVIGATION_PATH_PREFIX}/live/charts/:id`,
    element: <PhoenixWebsocketProvider><LiveChartSocketContainer /></PhoenixWebsocketProvider>
  },
  {
    path: `${NAVIGATION_PATH_PREFIX}/feedback/charts/:id`,
    element: <FeedbackChartUserSwitch />
  }
])

const lang = detectSupportedLanguage(navigator.language)
const messages = loadLocaleData(lang)
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <IntlProvider messages={messages} locale={lang} defaultLocale="en">
      <RouterProvider router={router} />
    </IntlProvider>
  </React.StrictMode>
)
