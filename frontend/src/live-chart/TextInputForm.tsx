import React, { useState, useContext } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import { WebsocketContext } from '../shared/PhoenixWebsocketProvider'
import { FormattedMessage, useIntl } from 'react-intl'

const MAX_LENGTH = import.meta.env.VITE_NLP_WORD_TAGGER_MAX_INPUT !== undefined ? parseInt(import.meta.env.VITE_NLP_WORD_TAGGER_MAX_INPUT, 10) : 500

// See https://github.com/spencermountain/compromise/blob/master/types/misc.ts
export interface Term {
  text: string
  pre: string
  post: string
  normal: string

  // in /two
  tags?: Set<string>
  index?: [n?: number, start?: number]
  id?: string
  chunk?: string
  dirty?: boolean

  // other things you may find...
  syllables?: string[]
}

function TextInputForm(): React.ReactElement {
  const intl = useIntl()
  const [inputText, setInputText] = useState<string>('')
  const { channel } = useContext(WebsocketContext)
  const [waitingForChannelPush, setWaitingForChannelPush] = useState<boolean>(false)
  const [errorChannelPush, setErrorChannelPush] = useState<boolean>(false)
  const [completedChannelPush, setCompletedChannelPush] = useState<boolean>(false)
  const [remainingTextInput, setRemainingTextInput] = useState<number>(MAX_LENGTH)
  const [taggerActive, setTaggerActive] = useState<boolean>(true)

  const handleChange = (text: string): void => {
    setInputText(text)
    setRemainingTextInput(text.length < MAX_LENGTH ? MAX_LENGTH - text.length : 0)
  }

  const handleToggleTaggerChange = (): void => {
    setTaggerActive(!taggerActive)
  }

  const submit = (event: React.SyntheticEvent<HTMLFormElement>): void => {
    if (channel === undefined) return

    (event.target as HTMLFormElement).reset()
    event.preventDefault()

    setWaitingForChannelPush(true)
    setCompletedChannelPush(false)
    setErrorChannelPush(false)
    channel.push('new_words', { words: inputText, taggerActive })
      .receive('ok', () => {
        setWaitingForChannelPush(false)
        setCompletedChannelPush(true)
        setRemainingTextInput(MAX_LENGTH)
      }).receive('error', () => {
        setWaitingForChannelPush(false)
        setErrorChannelPush(true)
      })
  }

  return (
    <div>
      {waitingForChannelPush && !completedChannelPush &&
        <Alert key="primary" variant="primary">
          <FormattedMessage
            id="live.text.loading"
            defaultMessage="Request is being processed..."
          />

        </Alert>
      }
      {completedChannelPush &&
        <Alert key="primary" variant="primary">
          <FormattedMessage
            id="live.text.success"
            defaultMessage="Words added. Depending on the chosen filter they might not be visible yet."
          />

        </Alert>
      }
      {errorChannelPush &&
        <Alert key="danger" variant="danger">
          <FormattedMessage
            id="live.text.error"
            defaultMessage="There has been an erorr tagging the words. Please try again with a shorter text."
          />

        </Alert>
      }
      {!waitingForChannelPush &&
        <Form onSubmit={submit} className="w-full">
          <Form.Group className="mb-3 w-full">
            <Form.Control
              as="textarea"
              placeholder="Text"
              maxLength={taggerActive ? MAX_LENGTH : undefined}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => { handleChange((e.target as HTMLTextAreaElement).value) }}
              onKeyPress={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  // add word with form submit:
                  e.currentTarget.form?.requestSubmit()
                } else {
                  // dont interfere with input:
                  return null
                }
              }}
              data-testid="test-input-control-text"
            />
          </Form.Group>
          <Form.Check
            type="switch"
            checked={taggerActive}
            onChange={(_e: React.ChangeEvent<HTMLInputElement>) => { handleToggleTaggerChange() }}
            label={
              intl.formatMessage(
                {
                  id: 'live.text.toggler.tokenizerActive',
                  defaultMessage: 'Tag grammar cateogries of input'
                }
              )
            }
          />
          <div className="d-flex w-full">
            {taggerActive &&
              <div className="flex-grow-1">{`${remainingTextInput} / ${MAX_LENGTH}`}</div>
            }
            {
              !taggerActive &&
              <div className="flex-grow-1"></div>
            }
            <div>
              <Button type="submit" variant="secondary" className="mt-1 text-white">
                <FormattedMessage
                  id="live.text.button.submit"
                  defaultMessage="Add Text"
                />
              </Button>
            </div>
          </div>
        </Form>
      }
    </div>
  )
}

export { TextInputForm }
