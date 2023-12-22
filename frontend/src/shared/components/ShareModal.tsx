import QRCodeStyling from 'qr-code-styling'
import { useEffect, useState, useRef } from 'react'
import { Form } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import InputGroup from 'react-bootstrap/InputGroup'
import { FormattedMessage } from 'react-intl'
import { cleanUrlFromAdminId } from '../utils'
import { CopyButton } from './CopyButton'

interface ShareModalProps {
  handleClose: () => void
}

const qrCode = new QRCodeStyling({
  width: 300,
  height: 300,
  type: 'svg',
  image: '',
  dotsOptions: {
    color: '#000000',
    type: 'dots'
  },
  cornersSquareOptions: {
    type: 'square'
  },
  cornersDotOptions: {
    type: 'dot'
  },
  backgroundOptions: {
    color: '#fff'
  },
  imageOptions: {
    crossOrigin: 'anonymous',
    margin: 20
  }
})

export function ShareModal({ handleClose }: ShareModalProps): React.ReactElement {
  const [url] = useState(cleanUrlFromAdminId(window.location.href))
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current === null) return

    qrCode.append(ref.current)
  }, [])

  useEffect(() => {
    qrCode.update({
      data: url
    })
  }, [url])

  const onDownload = async (): Promise<void> => {
    await qrCode.download({
      extension: 'png'
    })
  }

  return (
    <>
      <Modal show={true} onHide={handleClose} dialogClassName="modal-340px">
        <Modal.Header>
          <Modal.Title>
            <FormattedMessage
              id="sharemodal.title"
              defaultMessage="Share"
            />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <Form.Control disabled placeholder={url} />
            <CopyButton contentToCopy={url} />
          </InputGroup>
          <div ref={ref} />
          <Button
            onClick={onDownload}
          >
            <FormattedMessage
              id="download"
              defaultMessage="Download"
            />
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            <FormattedMessage
              id="close"
              defaultMessage="Close"
            />
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
