import { useState } from 'react'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

interface CopyProps {
  contentToCopy: string
}

export const CopyButton = ({ contentToCopy }: CopyProps): React.ReactElement => {
  const [copied, setCopied] = useState(false)

  const copyUrl = async (): Promise<void> => {
    if ('clipboard' in (window.navigator)) {
      await window.navigator.clipboard.writeText(contentToCopy)
      setCopied(true)
    } else if ('share' in (window.navigator)) {
      await navigator.share({
        title: 'WordCharts',
        url: contentToCopy
      })
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
