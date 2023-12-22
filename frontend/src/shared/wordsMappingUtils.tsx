import React from 'react'
import { Badge, ButtonGroup } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import { GrammaticalCategoryColors, GrammaticalCategoryIndex, ServerWord } from './types'
import { FormattedMessage } from 'react-intl'
import { GrammaticalCategory } from './components/GrammaticalCategory'
import { Trash2 } from 'react-feather'

const wordsAsTableRows = (words: ServerWord[], deleteWord: (event: React.MouseEvent<HTMLElement>) => void): React.ReactNode => {
  return words.sort((wordOne: ServerWord, wordTwo: ServerWord) => wordTwo.value - wordOne.value).map((wordEntry: ServerWord, index: number) => {
    return (
      <div key={`word-card-col-${index}`}>
        <ButtonGroup className="d-flex">
          <Button variant="outline-primary" className="w-100 d-flex justify-content-start word-options">
            <div>
              <Badge bg="primary">
                {wordEntry.value}
              </Badge> {wordEntry.name}
            </div>
          </Button>

          <GrammaticalCategory word={wordEntry.name} category={wordEntry.grammatical_categories[0]}></GrammaticalCategory>

          <Button variant="danger" onClick={deleteWord} value={wordEntry.name} className="d-flex" data-testid="delete-word">
            <Trash2 />
          </Button>
        </ButtonGroup>
      </div >
    )
  })
}

const mapCategoriesAsLabels = (categories: GrammaticalCategoryIndex[], categoryColors: GrammaticalCategoryColors): React.ReactElement[] => {
  if (categories === null || categories.length === 0) {
    return [
      <Badge pill={true} key={'category-badge-1'} className="rounded-pill text-bg-primary ms-1" data-testid="test-pill-all">
        <FormattedMessage
          id="filter.all"
          defaultMessage="All categories"
        />
      </Badge>
    ]
  }

  return categories.map((category: GrammaticalCategoryIndex, index: number) => {
    const color: string = colorByCategory([category], categoryColors)
    return <Badge pill={true} key={`category-badge-${index}`} className={'rounded-pill ms-1'} style={{ backgroundColor: `${color}` }} data-testid={`test-pill-${index}`}>
      <FormattedMessage
        id={`toolbar.buttons.dropdown.filter.${category.toLowerCase()}`}
        defaultMessage={category}
      />
    </Badge>
  })
}

// currently the data model supports multpiple categories per word, however we dont need that currently
const colorByCategory = (categories: GrammaticalCategoryIndex[], categoryColors: GrammaticalCategoryColors): string => {
  const mainCategory: GrammaticalCategoryIndex = categories[0] !== undefined ? categories[0] : 'misc'
  return categoryColors[mainCategory] ?? categoryColors.default
}

export { wordsAsTableRows, mapCategoriesAsLabels, colorByCategory }
