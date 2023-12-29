import React, { useContext, useEffect, useState } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import { GrammaticalCategoryColors, ReactWordcloudSettings, ServerWord } from '../shared/types'
import { Layout } from '../shared/components/Layout'
import { TextInputForm } from './TextInputForm'
import { WebsocketContext } from '../shared/PhoenixWebsocketProvider'
import { SizableWordChart } from '../shared/components/SizableWordChart'
import { AdminOptionToolbar } from '../shared/components/AdminOptionToolbar'
import { WordTable } from '../shared/components/WordTable'
import { defaultGrammaticalCategoryColors, defaultWordchartSettings, defaultPaginationCount } from '../shared/defaultChartSettings'
import { themeGreyColors, themeMixedColors } from '../shared/colors'
import { FormattedMessage } from 'react-intl'
import ResponsivePagination from 'react-responsive-pagination'
import 'bootstrap/dist/css/bootstrap.css'

interface LiveChartAdminPageProps {
  reactWordchartSettingsFromServer: ReactWordcloudSettings
  filterFromServer: string[]
  colorsFromServer: GrammaticalCategoryColors
  words: ServerWord[]
  language: string
}

function LiveChartAdminPage({ words, reactWordchartSettingsFromServer, filterFromServer, colorsFromServer, language }: LiveChartAdminPageProps): React.ReactElement {
  const { channel, adminId, id } = useContext(WebsocketContext)

  // Only sending these settings to the server. The update loop from the server will take care of changing props along the way
  const [newColors, setNewColors] = useState<GrammaticalCategoryColors>(defaultGrammaticalCategoryColors)
  const [newFilter, setNewFilter] = useState<string[]>([])
  const [newLanguage, setNewLanguage] = useState<string>('')
  const [newReactWordcloudSettings, setNewReactWordcloudSettings] = useState<ReactWordcloudSettings>({})

  // local pagination of the component
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const pages = Math.ceil(words.length / defaultPaginationCount)
    setTotalPages(pages)
  }, [words])

  useEffect(() => {
    if (channel === undefined || channel.state !== 'joined') return

    channel.push('update_chart', { admin_url_id: adminId, settings: { wordchartSettings: newReactWordcloudSettings } })
  }, [newReactWordcloudSettings, adminId, channel])

  useEffect(() => {
    if (channel === undefined || channel.state !== 'joined') return

    channel.push('update_chart', { admin_url_id: adminId, language: newLanguage })
  }, [adminId, channel, newLanguage])

  useEffect(() => {
    if (channel === undefined || channel.state !== 'joined') return

    channel.push('update_chart', { admin_url_id: adminId, grammatical_search_filter: newFilter })
  }, [newFilter, adminId, channel])

  useEffect(() => {
    if (channel === undefined || channel.state !== 'joined') return

    channel.push('update_chart', { admin_url_id: adminId, settings: { grammaticalCategoryColors: newColors } })
  }, [newColors, adminId, channel])

  const setColorGrey = (): void => {
    setNewReactWordcloudSettings({ ...reactWordchartSettingsFromServer, ...{ colors: themeGreyColors } })
  }

  const setColorForCategory = (category: string, value: string): void => {
    if (channel === undefined) return

    setNewColors((_prevState: GrammaticalCategoryColors) => {
      return { ...colorsFromServer, ...{ [category]: value } }
    })
  }

  const setColorFancy = (): void => {
    setNewReactWordcloudSettings({ ...reactWordchartSettingsFromServer, ...{ colors: themeMixedColors } })
  }

  const setColorCategory = (): void => {
    setNewReactWordcloudSettings({ ...reactWordchartSettingsFromServer, ...{ colors: [] } })
  }

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

  const paginationWordPositionStart = defaultPaginationCount * currentPage - defaultPaginationCount
  const paginationWordPositionEnd = defaultPaginationCount * currentPage

  return (
    <Layout>
      <div className="mt-2">
        <div>
          <Row >
            <span>
              <FormattedMessage
                id="live.admin.header.subline"
                defaultMessage="Enter text to count and categorize words"
              />
            </span>
          </Row>
          <Row >
            <Col>

              <Card>
                <Card.Body>
                  <TextInputForm />
                </Card.Body>
              </Card>

            </Col>
          </Row>
          <AdminOptionToolbar
            id={id}
            adminId={adminId}
            clearChart={clearChart}
            setColorThemeGrey={setColorGrey}
            setColorThemeByCategory={setColorCategory}
            setColorThemeFancy={setColorFancy}
            setRotationAngle={setRotationAngle}
            setColorForCategory={setColorForCategory}
            setWordFilter={setNewFilter}
            categoryColors={colorsFromServer}
            language={language}
            filterFromServer={filterFromServer}
            setLanguage={setNewLanguage}
            showSharingOption={false}
            wordChartSettings={reactWordchartSettingsFromServer}
          />
        </div>
        <SizableWordChart words={words} options={{ ...defaultWordchartSettings, ...reactWordchartSettingsFromServer }} categoryColors={colorsFromServer} data-testid="react-word-cloud" />
      </div>
      <WordTable words={words.slice(paginationWordPositionStart, paginationWordPositionEnd)} deleteWord={deleteWord} />
      <ResponsivePagination
        current={currentPage}
        total={totalPages}
        onPageChange={setCurrentPage}
      />
    </Layout>
  )
}

export { LiveChartAdminPage }
