import { Card, Collapse } from 'react-bootstrap'
import { GrammaticalCategoryColors, ReactWordcloudSettings } from '../types'
import { RotationAngleSetting } from './settings/RotationAngleSetting'
import { LanguageSetting } from './settings/LanguageSetting'
import { ColorSetting } from './settings/ColorSetting'

interface SettingsComponentProps {
  openSettings: boolean
  setColorThemeGrey?: () => void
  setColorThemeFancy?: () => void
  setColorThemeByCategory?: () => void
  setColorForCategory?: (category: string, value: string) => void
  categoryColors?: GrammaticalCategoryColors
  language?: string | undefined
  setLanguage?: ((language: string) => void) | undefined
  setRotationAngle: (angle: number) => void
  wordChartSettings: ReactWordcloudSettings
}

export function SettingsComponent({ openSettings, setColorThemeGrey, setColorThemeFancy, categoryColors, setColorThemeByCategory, setRotationAngle, setLanguage, setColorForCategory, language, wordChartSettings }: SettingsComponentProps): React.ReactElement {
  return (<Collapse in={openSettings} className="mt-2">
    <Card id="color-pickers-card">
      <Card.Body>
        <RotationAngleSetting setRotationAngle={setRotationAngle} />
        <LanguageSetting setLanguage={setLanguage} language={language} />
        <ColorSetting setColorForCategory={setColorForCategory} setColorThemeByCategory={setColorThemeByCategory} setColorThemeFancy={setColorThemeFancy} setColorThemeGrey={setColorThemeGrey} categoryColors={categoryColors} wordChartSettings={wordChartSettings} />
      </Card.Body>
    </Card>
  </Collapse>)
}
