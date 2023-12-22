import { Row } from 'react-bootstrap'
import { wordsAsTableRows } from '../wordsMappingUtils'
import { ServerWord } from '../types'

export function WordTable({ words, deleteWord }: { words: ServerWord[], deleteWord: (event: React.MouseEvent<HTMLElement>) => void }): React.ReactElement {
  return (
    <Row xs={1} md={2} xl={3} className="g-1 pb-5">
      {words !== undefined && words.length > 0 &&
        wordsAsTableRows(words, deleteWord)
      }

    </Row>
  )
}
