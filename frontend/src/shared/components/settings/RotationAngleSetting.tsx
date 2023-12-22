import { useState } from 'react'
import { Row, Col, Form } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

interface RotationAngleSettingProps {
  setRotationAngle: (angle: number) => void
}

export function RotationAngleSetting({ setRotationAngle }: RotationAngleSettingProps): React.ReactElement {
  const [rotationToggleActive, setRotationToggleActive] = useState(false)

  const toggleRotationAngle = (): void => {
    const newRotationToggleActive = !rotationToggleActive
    setRotationToggleActive(newRotationToggleActive)
    const newAngle = newRotationToggleActive ? 0 : 90
    setRotationAngle(newAngle)
  }

  return <Row className="m-2">
    <Col className="col-auto mx-auto">
      <h6><FormattedMessage
        defaultMessage="Limit rotation angle to 0°" id="toolbar.settings.rotation" /></h6>
      <Row>
        <Col className="col-auto mx-auto">
          <Form.Check
            type="switch"
            id="toggle-check"
            data-testid="toggle-check"
            checked={rotationToggleActive}
            value="0"
            onChange={(_e) => toggleRotationAngle()} />
        </Col>
      </Row>
    </Col>
  </Row>
}
