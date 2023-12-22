import React from 'react'
import { ALL_CATEGORIES, defaultGrammaticalCategoryColors } from '../../defaultChartSettings'
import { GrammaticalCategoryColors, ReactWordcloudSettings } from '../../types'
import { Col, Row, ToggleButton, ToggleButtonGroup } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { ColorTheme, themeGreyColors, themeMixedColors } from '../../colors'

interface ColorSettingProps {
  setColorThemeGrey?: () => void
  setColorThemeFancy?: () => void
  setColorThemeByCategory?: () => void
  setColorForCategory?: (category: string, value: string) => void
  categoryColors?: GrammaticalCategoryColors
  wordChartSettings: ReactWordcloudSettings
}

export function ColorSetting({ setColorThemeGrey, setColorThemeFancy, setColorThemeByCategory, setColorForCategory, categoryColors, wordChartSettings }: ColorSettingProps): React.ReactElement {
  const mergedCategoryColors = { ...defaultGrammaticalCategoryColors, ...categoryColors }

  const createColorPickerForms = (): React.ReactNode[] => {
    return ALL_CATEGORIES.map((categoryName, index: number) => {
      return ((setColorForCategory != null) &&
        <Col key={`color-${categoryName}-${index}`}>
          <Row>
            <Col>
              <FormattedMessage
                defaultMessage={`${categoryName}`} id={`toolbar.settings.theme.${categoryName}`}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <input type="color" className="grammatical-color-option" value={mergedCategoryColors[categoryName]} onChange={async (event) => setColorForCategory(categoryName, event.target.value)} />
            </Col>
          </Row>
        </Col>)
    })
  }

  const getActiveColorTheme = (): number => {
    if (wordChartSettings === undefined || wordChartSettings.colors === undefined || wordChartSettings.colors.length === 0) {
      return ColorTheme.Grammar
    } else if (wordChartSettings.colors.every(val => themeGreyColors.includes(val))) {
      return ColorTheme.Grey
    } else if (wordChartSettings.colors.every(val => themeMixedColors.includes(val))) {
      return ColorTheme.Mixed
    }

    // return a resonable default value - we need to make sure that this is actually the default. currently the default is black, but without a theme
    return ColorTheme.Grammar
  }

  return <Row className="m-2">
    <Col className="col-auto mx-auto">
      <h6 className="text-center">
        <FormattedMessage defaultMessage="Colors" id="toolbar.buttons.colors" />
      </h6>
      <Row>
        <Col className="col-auto mx-auto">
          <ToggleButtonGroup type="radio" name="color-button-group" value={getActiveColorTheme()}>
            {(setColorForCategory != null) && <ToggleButton id="color-button-grammar" value={ColorTheme.Grammar} onClick={setColorThemeByCategory} data-testid="admin-settings-option-filter-category">
              <FormattedMessage
                id="toolbar.buttons.dropdown.theme.grammar"
                defaultMessage="Change to grammatical category" />
            </ToggleButton>
            }
            <ToggleButton id="color-button-grey" value={ColorTheme.Grey} onClick={setColorThemeGrey}>
              <FormattedMessage
                id="toolbar.buttons.dropdown.theme.grey"
                defaultMessage="Change to greyscale colors" />
            </ToggleButton>
            <ToggleButton id="color-button-fancy" value={ColorTheme.Mixed} onClick={setColorThemeFancy}>
              <FormattedMessage
                id="toolbar.buttons.dropdown.theme.mix"
                defaultMessage="Change to fancy colors" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Col>
      </Row>
      {
        (setColorForCategory != null && getActiveColorTheme() === ColorTheme.Grammar) &&
        <>

          <Row className="my-2 text-center">
            <Col>
              <FormattedMessage
                defaultMessage="Please select a color for each grammar category" id="toolbar.settings.theme.explanation" />:
            </Col>
          </Row>
          <Row className="text-center fs-6">
            {createColorPickerForms()}
          </Row>
        </>
      }
    </Col>
  </Row>
}
