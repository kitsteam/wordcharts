import { Word } from 'react-wordcloud'
import { ServerWord } from './types'

export const mapWords = (words: ServerWord[] | undefined): Word[] => {
  if (words === undefined) return []

  return words.map((wordEntry: ServerWord) => { return { text: wordEntry.name, categories: wordEntry.grammatical_categories, value: wordEntry.value !== undefined ? wordEntry.value : 1 } })
}
