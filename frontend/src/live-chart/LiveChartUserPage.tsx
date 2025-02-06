import React from 'react'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import { GrammaticalCategoryColors, GrammaticalCategoryIndex, ReactWordcloudSettings, ServerWord } from '../shared/types'
import { Layout } from '../shared/components/Layout'
import { SizableWordChart } from '../shared/components/SizableWordChart'
import { defaultWordchartSettings } from '../shared/defaultChartSettings'
import { TextInputForm } from './TextInputForm'
import { Row } from 'react-bootstrap'
import { mapCategoriesAsLabels } from '../shared/wordsMappingUtils'
import { FormattedMessage } from 'react-intl'

interface LiveChartPageProps {
  reactWordchartSettings: ReactWordcloudSettings
  words: ServerWord[]
  currentWordFilter: GrammaticalCategoryIndex[]
  wordColors: GrammaticalCategoryColors
  language: string
}

function LiveChartUserPage({ words, reactWordchartSettings, currentWordFilter, wordColors }: LiveChartPageProps): React.ReactElement {
  return (
    <Layout>
      <div className="mt-2">
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <TextInputForm />
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormattedMessage
              id="live.filter"
              defaultMessage="Filter"
            />
            {mapCategoriesAsLabels(currentWordFilter, wordColors)}
            <SizableWordChart words={words} options={{ ...defaultWordchartSettings, ...reactWordchartSettings }} categoryColors={wordColors} data-testid="react-word-cloud" />
          </Col>
        </Row>
      </div>
    </Layout>
  )
}

export { LiveChartUserPage }
