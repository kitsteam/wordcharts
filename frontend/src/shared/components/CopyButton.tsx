import { useState } from 'react'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

interface CopyProps {
  contentToCopy: string
}

export const CopyButton = ({ contentToCopy }: CopyProps): React.ReactElement => {
  const [copied, setCopied] = useState(false)

  const copyUrl = async (): Promise<void> => {
    if ('share' in (window.navigator)) {
      await (window.navigator as any)?.share({
        title: 'wordcharts',
        url: contentToCopy
      })
    } else if ('clipboard' in (window.navigator)) {
      await navigator.clipboard.writeText(contentToCopy)
      setCopied(true)
    }
  }

  const copyText = (copied) ? { id: 'copied', defaultMessage: 'Copied' } : { id: 'copy', defaultMessage: 'Copy' }

  return (<Button onClick={copyUrl}>
    <FormattedMessage
      id={copyText.id}
      defaultMessage={copyText.defaultMessage}
    />
  </Button>)
}
