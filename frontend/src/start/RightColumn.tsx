
import { ButtonGroup, Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import {
  useNavigate
} from 'react-router-dom'
import { ServerChartResponse } from '../shared/types'
import { NAVIGATION_PATH_PREFIX } from '../shared/api'
import { detectSupportedLanguage } from '../shared/utils'
import kitsLogoUrl from '../assets/images/kits-logo.svg'

function RightColumn(): React.ReactElement {
  const navigate = useNavigate()

  const addChart = async (chartType: string): Promise<void> => {
    const language = detectSupportedLanguage(navigator.language)
    const serverResponse: Response = await fetch('/api/charts', {
      method: 'POST',
      body: JSON.stringify({ chart: { name: 'Test', chart_type: chartType, language } }),
      headers: { 'Content-Type': 'application/json' }
    })
    const json: ServerChartResponse = await serverResponse.json()
    const { id, admin_url_id: adminUrlId } = json.data

    localStorage.setItem(id, JSON.stringify(json))

    navigate(`${NAVIGATION_PATH_PREFIX}/${chartType}/charts/${id}?#adminId=${adminUrlId}`)
    return undefined
  }
  return (
    <div className="w-50 float-end float-end-override d-flex flex-column align-items-stretch justify-content-between vh-100">
      <div className="g-0 d-flex justify-content-end px-3">
        <div className="pt-3">
          <a href="https://kits.blog/tools/"><img src={kitsLogoUrl} className="img-fluid d-block"
            alt="Kits Logo" /></a>
        </div>
      </div>
      <div className="row g-0 h-100">
        <div id="content" className="container w-90 d-flex align-content-center flex-wrap">
          <div id="call-to-action-block">
            <h1 className="fw-bold">
              <a className="text-decoration-none" href="/" title="wordcharts">WordCharts</a>
            </h1>

            <ul className="list-group list-unstyled mb-3">
              <li className="list-group-item pb-2"><FormattedMessage
                id="start.feature.one"
                defaultMessage="Create a WordChart"
              /></li>
              <li className="list-group-item pb-2"><FormattedMessage
                id="start.feature.two"
                defaultMessage="Collaborate with others!"
              /></li>
              <li className="list-group-item pb-2"><FormattedMessage
                id="start.feature.three"
                defaultMessage="Visualise feedback!"
              /></li>
            </ul>
            <ButtonGroup>
              <Button className="border border-white" variant="primary" onClick={() => { void (async () => { await addChart('live') })() }}>
                <FormattedMessage
                  id="start.buttons.live"
                  defaultMessage="Text"
                />
              </Button>
              <Button className="border border-white" variant="primary" onClick={() => { void (async () => { await addChart('feedback') })() }}>
                <FormattedMessage
                  id="start.buttons.feedback"
                  defaultMessage="Feedback"
                />
              </Button>
            </ButtonGroup>

            <p className="form-text text-muted mt-3">
              <FormattedMessage
                id="start.hint.privacy"
                defaultMessage="You may only use this tool in an education context. Entry of personal data is not permitted!"
              />
              <br /><br />
              <FormattedMessage
                id="start.hint.deletion"
                defaultMessage="Attention: Your WordCharts will be deleted 30 days after the last change."
              />
            </p>
          </div>

        </div>
      </div>
    </div >

  )
}

export default RightColumn
