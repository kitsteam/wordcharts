import { Row, Col, Form } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

interface LanguageSettingProps {
  language?: string | undefined
  setLanguage?: ((language: string) => void) | undefined
}

export function LanguageSetting({ language, setLanguage }: LanguageSettingProps): React.ReactElement {
  if (setLanguage === undefined) return <></>

  return <Row className="m-2">
    <Col className="col-auto mx-auto">
      <h6 className="text-center">
        <FormattedMessage defaultMessage="Language" id="toolbar.settings.language" />
      </h6>
      <Row>
        <Col className="col-auto mx-auto">
          <Form.Control as="select" className="form-select" value={language} onChange={(event) => setLanguage(event?.target.value)}>
            <option value="en">
              <FormattedMessage
                defaultMessage="English" id="languages.en" />
            </option>
            <option value="de">
              <FormattedMessage
                defaultMessage="German" id="languages.de" />
            </option>
          </Form.Control>
        </Col>
      </Row>
    </Col>
  </Row>
}
