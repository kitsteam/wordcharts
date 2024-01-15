import React, { useEffect, useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { Callbacks, ReactWordCloud, Word, defaultCallbacks } from 'react-wordcloud'
import { calculateMaxSize, defaultGrammaticalCategoryColors, MIN_SIZE } from '../defaultChartSettings'
import { useWindowWidth } from '../hooks/screenWidthHook'
import { mapWords } from '../mapWords'
import { GrammaticalCategoryColors, ReactWordcloudSettings, ServerWord } from '../types'
import { colorByCategory } from '../wordsMappingUtils'

export function SizableWordChart({ options, words, categoryColors }: { options: ReactWordcloudSettings, words: ServerWord[], categoryColors?: GrammaticalCategoryColors }): React.ReactElement {
  const width = useWindowWidth()
  const [wordChartSettings, setWordChartSettings] = useState<ReactWordcloudSettings>(options)

  useEffect(() => {
    setWordChartSettings({ ...options, ...{ fontSizes: [MIN_SIZE, calculateMaxSize(options.rotationAngles)] } })
  }, [width, options])

  const callbacks: Callbacks = (() => {
    if ((options.colors != null) && options.colors.length === 0 && (categoryColors != null)) {
      const colors: GrammaticalCategoryColors = { ...defaultGrammaticalCategoryColors, ...categoryColors }

      return {
        getWordColor: (word: Word) => colorByCategory(word.categories, colors),
        getWordTooltip: defaultCallbacks.getWordTooltip,
        onWordMouseOut: defaultCallbacks.onWordMouseOut
      } as Callbacks
    } else {
      return defaultCallbacks as Callbacks
    }
  })()

  return (
    <div id="word-chart">
      <Row className="min-vh-60">
        <Col className="d-flex align-items-center justify-content-center">
          {(words === undefined || words.length === 0) &&
            <p className="text-center fs-1 align-middle">
              <FormattedMessage
                id="wordchart.empty"
                defaultMessage="This word chart is currently empty."
              />
            </p>
          }
          {words !== undefined && words.length > 0 &&
            <ReactWordCloud words={mapWords(words)} options={wordChartSettings} callbacks={callbacks} data-testid="react-word-cloud" />
          }
        </Col>
      </Row>
      <Row>
        <Col>

        </Col>
      </Row>
    </div>
  )
}
