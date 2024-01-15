import QRCodeStyling from 'qr-code-styling'
import { useEffect, useState, useRef } from 'react'
import { Form } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import InputGroup from 'react-bootstrap/InputGroup'
import { FormattedMessage, useIntl } from 'react-intl'
import { cleanUrlFromAdminId } from '../utils'
import { CopyButton } from './CopyButton'
import { Share2 } from 'react-feather'

interface ShareModalProps {
  handleClose: () => void
  adminId: string | undefined
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

export function ShareModal({ handleClose, adminId }: ShareModalProps): React.ReactElement {
  const intl = useIntl()
  const [url] = useState(cleanUrlFromAdminId(window.location.href))
  const [sharableUrl, setSharableUrl] = useState('')
  const ref = useRef(null)
  const [showAdminLink, setShowAdminLink] = useState(false)

  useEffect(() => {
    if (ref.current === null) return

    qrCode.append(ref.current)
  }, [])

  useEffect(() => {
    qrCode.update({
      data: sharableUrl
    })
  }, [sharableUrl])

  useEffect(() => {
    const newUrl = showAdminLink && adminId !== undefined ? `${url}#adminId=${adminId}` : url
    setSharableUrl(newUrl)
  }, [showAdminLink, url, adminId])

  const share = async (): Promise<void> => {
    if ('share' in (window.navigator)) {
      await (window.navigator as any)?.share({
        title: 'WordCharts',
        url: sharableUrl
      })
    }
  }

  const onDownload = async (): Promise<void> => {
    await qrCode.download({
      extension: 'png'
    })
  }

  const toggleShowAdminLink = (): void => {
    setShowAdminLink(!showAdminLink)
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
          {adminId !== undefined &&
            <Form.Switch
              onChange={(_e: React.ChangeEvent<HTMLInputElement>) => { toggleShowAdminLink() }}
              className="mb-2"
              checked={showAdminLink}
              label={
                intl.formatMessage(
                  {
                    id: 'sharemodal.toggler.showAdminLink',
                    defaultMessage: 'Use admin link'
                  }
                )
              }
            />
          }
          <InputGroup className="mb-3">
            <Form.Control disabled placeholder={sharableUrl} />
            <CopyButton contentToCopy={sharableUrl} />
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
          { ('share' in (window.navigator)) &&
            <Button variant="primary" onClick={share}>
              <Share2 />
            </Button>
          }
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
