import { useContext } from 'react'
import { ButtonGroup, Dropdown, DropdownButton } from 'react-bootstrap'
import { WebsocketContext } from '../PhoenixWebsocketProvider'
import { ALL_CATEGORIES } from '../defaultChartSettings'
import { FormattedMessage, useIntl } from 'react-intl'

interface GrammaticalCategoryProps {
  category: string
  word: string
}

export const GrammaticalCategory = ({ word, category }: GrammaticalCategoryProps): React.ReactElement => {
  const { channel, adminId } = useContext(WebsocketContext)

  const intl = useIntl()

  if (category === undefined || word === undefined) return (<div></div>)

  const changeCategory = (eventKey: any, event: Object): any => {
    if (channel === undefined || channel.state !== 'joined') return

    channel.push('change_grammatical_category', { word_name: word, grammatical_category: eventKey, admin_url_id: adminId })
      .receive('error', () => {
        console.error('There was an error while changing the grammatical category.')
      })
  }

  const categoryDropdownItems = ALL_CATEGORIES.map((category, index) => {
    return <Dropdown.Item key={index} eventKey={category} data-testid={`test-category-dropdown-button-${category}`}>
      <FormattedMessage
        id={`toolbar.buttons.dropdown.filter.${category}`}
        defaultMessage={category}
      />
    </Dropdown.Item >
  })

  return (<DropdownButton
    as={ButtonGroup}
    title={intl.formatMessage({ id: `toolbar.buttons.dropdown.filter.${category}`, defaultMessage: category })}
    variant='primary'
    className="grammatical-dropdown-button"
    onSelect={changeCategory}>
    {categoryDropdownItems}
  </DropdownButton>)
}
