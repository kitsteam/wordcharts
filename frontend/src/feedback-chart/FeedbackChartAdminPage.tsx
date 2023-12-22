import React, { useEffect, useContext, useState } from 'react'
import { GrammaticalCategoryColors, ReactWordcloudSettings, ServerWord } from '../shared/types'
import { Layout } from '../shared/components/Layout'
import { WebsocketContext } from '../shared/PhoenixWebsocketProvider'
import { SizableWordChart } from '../shared/components/SizableWordChart'
import { AdminOptionToolbar } from '../shared/components/AdminOptionToolbar'
import { WordTable } from '../shared/components/WordTable'
import { defaultWordchartSettings } from '../shared/defaultChartSettings'
import { themeGreyColors, themeMixedColors } from '../shared/colors'
import { FormattedMessage } from 'react-intl'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

interface FeedbackChartAdminPageProps {
  reactWordchartSettingsFromServer: ReactWordcloudSettings
  colorsFromServer: GrammaticalCategoryColors
  words: ServerWord[]
}

function FeedbackChartAdminPage({ words, reactWordchartSettingsFromServer, colorsFromServer }: FeedbackChartAdminPageProps): React.ReactElement {
  const { channel, adminId, id } = useContext(WebsocketContext)

  // Only sending these settings to the server. The update loop from the server will take care of changing props along the way
  const [newReactWordcloudSettings, setNewReactWordcloudSettings] = useState<ReactWordcloudSettings>({})

  useEffect(() => {
    if (channel === undefined || channel.state !== 'joined') return

    channel.push('update_chart', { admin_url_id: adminId, settings: { wordchartSettings: newReactWordcloudSettings } })
  }, [newReactWordcloudSettings, adminId, channel])

  const setRotationAngle = (maxDegree: number): void => {
    setNewReactWordcloudSettings({ ...reactWordchartSettingsFromServer, ...{ rotationAngles: [0, maxDegree] } })
  }

  const clearChart = async (): Promise<void> => {
    if (adminId === undefined) return
    if (channel === undefined) return

    channel.push('clear_words', { admin_url_id: adminId })
  }

  const deleteWord = (event: React.MouseEvent<HTMLElement>): void => {
    if (channel === undefined) return

    channel.push('delete_word', { word_name: (event.currentTarget as HTMLInputElement).value, admin_url_id: adminId })
  }

  const setColorGrey = (): void => {
    setNewReactWordcloudSettings({ ...reactWordchartSettingsFromServer, ...{ colors: themeGreyColors } })
  }

  const setColorFancy = (): void => {
    setNewReactWordcloudSettings({ ...reactWordchartSettingsFromServer, ...{ colors: themeMixedColors } })
  }

  const showSharingOption = channel !== undefined && (words === undefined || words.length === 0)

  return (
    <Layout>
      <div className="mt-2">
        <div>
          <Row className="content-header">
            <Col>
              <h1>
                <FormattedMessage
                  id="feedback.admin.header"
                  defaultMessage="Feedback Chart"
                />
              </h1>
              <span>
                <FormattedMessage
                  id="feedback.admin.header.subline"
                  defaultMessage="Collect feedback and display it in a chart"
                />
              </span>
            </Col>
            <Col>
              <AdminOptionToolbar
                id={id}
                adminId={adminId}
                clearChart={clearChart}
                setRotationAngle={setRotationAngle}
                showSharingOption={showSharingOption}
                setColorThemeGrey={setColorGrey}
                setColorThemeFancy={setColorFancy}
                wordChartSettings={newReactWordcloudSettings}
              />
            </Col>
          </Row>
        </div>
        <SizableWordChart words={words} options={{ ...defaultWordchartSettings, ...reactWordchartSettingsFromServer }} categoryColors={colorsFromServer} data-testid="react-word-cloud" />
      </div>
      <WordTable words={words} deleteWord={deleteWord} />
    </Layout>
  )
}

export { FeedbackChartAdminPage }
