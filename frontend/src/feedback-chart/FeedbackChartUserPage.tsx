import { useContext, useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import { Layout } from '../shared/components/Layout'
import { RestChartContext, RestChartContextInterface } from './RestChartProvider'
import { FeedbackWords, restSendFeedback } from '../shared/api'
import { FormattedMessage } from 'react-intl'

function FeedbackChartUserPage(): React.ReactElement {
  const [feedbackWords, setfeedbackWords] = useState<FeedbackWords>({})
  const [feedbackSent, setFeedbackSent] = useState<boolean>(false)
  const [feedbackSentSuccess, setFeedbackSentSuccess] = useState<boolean>(false)
  const [feedbackSentError, setFeedbackSentError] = useState<boolean>(false)
  const { id } = useContext<RestChartContextInterface>(RestChartContext)

  const calculateNewFeedbackWords = (event: React.ChangeEvent<HTMLInputElement>, index: number): void => {
    const newFeedbackWords = { ...feedbackWords, ...{ [index]: { name: event.target.value } } }
    setfeedbackWords(newFeedbackWords)
  }

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>): Promise<void> => {
    if (id === undefined) return

    event.preventDefault()
    if (Object.keys(feedbackWords).length === 0) return

    setFeedbackSent(true)
    const status = await restSendFeedback(id, feedbackWords)
    setFeedbackSentSuccess(status)
    setFeedbackSentError(!status)
  }

  const inputControls = (): React.ReactElement[] => {
    return [...Array(5).keys()].map((index: number) => {
      return (
        <Form.Group key={`input-group-${index}`} className="mb-3">
          <Form.Control
            id={`input-control-word-${index}`}
            maxLength={30}
            placeholder=''
            data-testid={`test-input-control-word-${index}`}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => calculateNewFeedbackWords(event, index)}
          />
        </Form.Group>
      )
    })
  }

  return (
    <Layout>
      {!feedbackSent &&
        <div>
          <br />
          <h2>
            <FormattedMessage
              id="feedback.user.input.hint"
              defaultMessage="Please enter Feedback"
            />
          </h2>
          <p>
            <FormattedMessage
              id="feedback.user.input.placeholder"
              defaultMessage="Please insert only one word per input box!"
            />
          </p>
          <br />
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              {inputControls()}
              <Button type="submit" variant="primary">
                <FormattedMessage
                  id="feedback.user.button.submit"
                  defaultMessage="Submit Feedback"
                />
              </Button>
            </Form.Group>
          </Form>
          <br />
        </div>
      }
      {feedbackSent && feedbackSentSuccess &&
        <Alert key="primary" variant="primary">
          <FormattedMessage
            id="feedback.user.message.success"
            defaultMessage="Thank you for providing Feedback!"
          /></Alert>
      }

      {feedbackSent && feedbackSentError &&
        <Alert key="danger" variant="danger">
          <FormattedMessage
            id="feedback.user.message.error"
            defaultMessage="An error has occured."
          /></Alert>
      }
    </Layout>
  )
}

export { FeedbackChartUserPage }
