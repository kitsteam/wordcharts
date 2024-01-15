import { Badge, Button, ButtonGroup, ButtonToolbar, Col, Dropdown, DropdownButton, Overlay, Row, Tooltip } from 'react-bootstrap'
import { useRef, useState } from 'react'
import { GrammaticalCategoryColors, ReactWordcloudSettings } from '../types'
import { ALL_CATEGORIES } from '../defaultChartSettings'
import { FormattedMessage, useIntl } from 'react-intl'
import { ShareModal } from './ShareModal'
import { Share2, Settings } from 'react-feather'
import FiraSansBold from '../../assets/fonts/FiraSansExtraCondensed-Bold.ttf'
import { fileUrlToBase64 } from '../utils'
import { SettingsComponent } from './SettingsComponent'

interface AdminOptionToolbarProps {
  id: string | undefined
  adminId: string | undefined
  language?: string | undefined
  filterFromServer?: string[]
  setWordFilter?: ((wordFilter: string[]) => void) | undefined
  setColorThemeGrey?: () => void
  setColorThemeFancy?: () => void
  setColorThemeByCategory?: () => void
  setColorForCategory?: (category: string, value: string) => void
  setLanguage?: ((language: string) => void) | undefined
  setRotationAngle: (angle: number) => void
  clearChart: () => Promise<void>
  categoryColors?: GrammaticalCategoryColors
  showSharingOption: boolean
  wordChartSettings: ReactWordcloudSettings
}

export function AdminOptionToolbar({ id, adminId, language, filterFromServer, setColorThemeFancy, setColorThemeGrey, setColorThemeByCategory, setRotationAngle, clearChart, setWordFilter, setColorForCategory, setLanguage, categoryColors, showSharingOption, wordChartSettings }: AdminOptionToolbarProps): React.ReactElement {
  const [openSettings, setSettingsOpen] = useState(false)
  const [openShareModal, setShareModalOpen] = useState(false)
  const intl = useIntl()
  const shareModalToolTipTarget = useRef(null)

  const triggerDownload = (url: string): void => {
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.download = 'WordChart'
    document.body.appendChild(link)
    link.click()

    setTimeout(() => {
      URL.revokeObjectURL(link.href)
      link.parentNode?.removeChild(link)
    }, 0)
  }

  const handleFilterClick = (name: string): void => {
    if (setWordFilter === undefined) {
      return
    }

    if (name === 'all') {
      setWordFilter([])
    } else if (filterFromServer?.includes(name) === true) {
      setWordFilter(filterFromServer.filter((e) => e !== name))
    } else {
      setWordFilter([...(filterFromServer ?? []), name])
    }
  }

  const createCategoryFiltersForLgScreens = (): React.ReactNode[] => {
    if (filterFromServer === undefined) return [<div key={'filter-empty'}></div>]

    const normalizedFilterList = filterFromServer !== null && filterFromServer.length > 0 ? filterFromServer : ['all']

    return ['all', ...ALL_CATEGORIES].map((categoryName: string, index: number) => {
      return (<Button key={`filter-lg-category-id-${index}`} variant="" onClick={(event) => handleFilterClick(categoryName)}>
        <Badge pill={true} bg={normalizedFilterList.includes(categoryName) ? 'secondary' : 'primary'} className={'rounded-pill'}>
          <FormattedMessage
            id={`toolbar.buttons.dropdown.filter.${categoryName}`}
            defaultMessage={categoryName}
          />
        </Badge>
      </Button>)
    })
  }

  const createCategoryFiltersForSmScreens = (): React.ReactNode[] => {
    if (filterFromServer === undefined) return [<Dropdown.Item key={'filter-empty'}></Dropdown.Item>]

    const normalizedFilterList = filterFromServer !== null && filterFromServer.length > 0 ? filterFromServer : ['all']

    return ['all', ...ALL_CATEGORIES].map((categoryName: string, index: number) => {
      return (<Dropdown.Item key={`filter-sm-category-id-${index}`} active={normalizedFilterList.includes(categoryName)} variant="" onClick={(event) => handleFilterClick(categoryName)}>
        <FormattedMessage
          id={`toolbar.buttons.dropdown.filter.${categoryName}`}
          defaultMessage={categoryName}
        />
      </Dropdown.Item>)
    })
  }

  const download = async (imageType: string = 'image/svg+xml'): Promise<void> => {
    const svg = document.querySelector('#word-chart svg')
    if (svg === null) return

    // work on a copy otherwise we modify the existing chart
    const copySVG: SVGSVGElement = svg.cloneNode(true) as SVGSVGElement

    // inline fonts as base64 encodeded
    const styleTag = document.createElement('style')
    styleTag.setAttribute('type', 'text/css')
    const base64font = await fileUrlToBase64(FiraSansBold)

    if (styleTag !== null) {
      styleTag.textContent = `
      @font-face {
        font-family: 'Fira Sans Extra Condensed';
        font-weight: bold;
        src: url(${base64font});
      }
      `
      copySVG.prepend(styleTag)
    }
    const data = (new XMLSerializer()).serializeToString(copySVG)

    const image = new Image()
    const svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' })
    const url = window.URL.createObjectURL(svgBlob)

    if (imageType === 'image/svg+xml') {
      triggerDownload(url)
      return
    }

    image.src = url
    image.onload = () => {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      if (context === null) return

      canvas.width = image.width
      canvas.height = image.height
      context.drawImage(image, 0, 0)
      window.URL.revokeObjectURL(url)

      triggerDownload(canvas.toDataURL(imageType))
    }
  }

  return (
    <div>
      <Row className="mt-2">
        <Col className="d-flex">
          {(setWordFilter != null) &&
          <>
            <ButtonToolbar aria-label="Chart settings" data-testid="feedback-chart-admin-settings" className="d-none d-lg-block">
              {createCategoryFiltersForLgScreens()}
            </ButtonToolbar>
          </>
          }
          <div className="ms-auto">
            <ButtonGroup>
              <Button
                onClick={() => setSettingsOpen(!openSettings)}
                aria-controls="color-pickers-card"
                aria-expanded={openSettings}
                data-testid="settings-button">
                <Settings aria-label={intl.formatMessage({ id: 'toolbar.buttons.settings', defaultMessage: 'Toggle Settings' })}></Settings>
              </Button>
              <Overlay target={shareModalToolTipTarget.current} show={(showSharingOption && !openShareModal)} placement="bottom">
                {(props) => (<Tooltip id="share-feedback-tooltip" {...props}>
                  {intl.formatMessage({ defaultMessage: 'Share a link to your feedback chart to allow others to add new words.', id: 'chart.buttons.share.feedback' })}
                </Tooltip>
                )}
              </Overlay>
              <Button
                onClick={() => setShareModalOpen(!openShareModal)}
                aria-expanded={openShareModal}
                ref={shareModalToolTipTarget}
                data-testid="share-feedback-button"
              >
                <Share2 />
              </Button>
              <DropdownButton
                as={ButtonGroup}
                id="bg-nested-dropdown"
                title={intl.formatMessage({
                  defaultMessage: 'Filter', id: 'live.filter'
                })}
                className="d-lg-none"
              >
                {createCategoryFiltersForSmScreens()}
              </DropdownButton>
              <DropdownButton
                as={ButtonGroup}
                id="bg-nested-dropdown"
                title={intl.formatMessage({
                  defaultMessage: 'Download', id: 'chart.buttons.download'
                })}
              >
                <Dropdown.Item eventKey="None" onClick={async (event) => await download()}>
                  <FormattedMessage
                    id="chart.buttons.download.svg"
                    defaultMessage="svg"
                  />
                </Dropdown.Item>
                <Dropdown.Item eventKey="None" onClick={async (event) => await download('image/png')}>
                  <FormattedMessage
                    id="chart.buttons.download.png"
                    defaultMessage="png"
                  />
                </Dropdown.Item>
              </DropdownButton>
              <Button className="me-4" onClick={async (event) => await clearChart()} variant="danger" title={intl.formatMessage({
                defaultMessage: 'Danger', id: 'toolbar.buttons.danger'
              })}>
                <FormattedMessage
                  defaultMessage="Clear" id="toolbar.buttons.clear"
                />
              </Button>
            </ButtonGroup>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <SettingsComponent wordChartSettings={wordChartSettings} categoryColors={categoryColors} openSettings={openSettings} setRotationAngle={setRotationAngle} language={language} setLanguage={setLanguage} setColorThemeGrey={setColorThemeGrey} setColorForCategory={setColorForCategory} setColorThemeByCategory={setColorThemeByCategory} setColorThemeFancy={setColorThemeFancy} />
        </Col>
      </Row>
      {
        (openShareModal) &&
        <ShareModal
          handleClose={() => setShareModalOpen(false)}
          adminId={adminId}
        />
      }
    </div >
  )
}
