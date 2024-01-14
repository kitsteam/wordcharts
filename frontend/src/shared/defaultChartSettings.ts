import { MinMaxPair } from 'react-wordcloud'
import { GrammaticalCategoryColors, GrammaticalCategoryIndex, ReactWordcloudSettings } from './types'
import { DEFAULT_COLOR } from './colors'

export const MAX_SIZE = 100
export const MIN_SIZE = 15

export const VERB_CATEGORIES: GrammaticalCategoryIndex[] = ['verb']
export const ADJ_CATEGORIES: GrammaticalCategoryIndex[] = ['adjective']
export const NOUN_CATEGORIES: GrammaticalCategoryIndex[] = ['noun']
export const ADVERB_CATEGORIES: GrammaticalCategoryIndex[] = ['adverb']
export const PRONOUN_CATEGORIES: GrammaticalCategoryIndex[] = ['pronoun']
export const ARTICLE_CATEGORIES: GrammaticalCategoryIndex[] = ['article']
export const PREPOSITION_CATEGORIES: GrammaticalCategoryIndex[] = ['preposition']
export const CONJUNCTURE_CATEGORIES: GrammaticalCategoryIndex[] = ['conjuncture']
export const MISC_CATEGORIES: GrammaticalCategoryIndex[] = ['misc']

export const ALL_CATEGORIES: GrammaticalCategoryIndex[] = [...VERB_CATEGORIES, ...ADJ_CATEGORIES, ...NOUN_CATEGORIES, ...ADVERB_CATEGORIES, ...PRONOUN_CATEGORIES, ...ARTICLE_CATEGORIES, ...PREPOSITION_CATEGORIES, ...CONJUNCTURE_CATEGORIES, ...MISC_CATEGORIES]

export const calculateMaxSize = (rotationAngles: MinMaxPair | undefined): number => {
  // reduce the max font size a bit when the angles can be greater than 0,
  // otherwise the library sometimes fails to layout everything
  const maxFontSize = (rotationAngles !== undefined && rotationAngles[1] > 0) ? MAX_SIZE * 0.75 : MAX_SIZE
  const max = Math.min(window.innerWidth, 1024) / 1024 * maxFontSize
  return Math.max(MIN_SIZE, max)
}

export const defaultWordchartSettings: ReactWordcloudSettings = {
  colors: [],
  enableTooltip: false,
  deterministic: true,
  fontFamily: 'Fira Sans Extra Condensed',
  fontSizes: [MIN_SIZE, calculateMaxSize([0, 90])],
  fontStyle: 'normal',
  fontWeight: 'bold',
  padding: 1,
  rotations: 3,
  rotationAngles: [0, 90],
  scale: 'sqrt',
  spiral: 'archimedean',
  transitionDuration: 1000,
  enableOptimizations: true
}

export const defaultGrammaticalCategoryColors: GrammaticalCategoryColors = {
  verb: '#E53935',
  adjective: '#303F9F',
  noun: '#000000',
  preposition: '#388E3C',
  default: DEFAULT_COLOR,
  adverb: '#F57C00',
  pronoun: '#7B1FA2',
  article: '#0288D1',
  conjuncture: '#EC187A',
  misc: DEFAULT_COLOR
}

export const defaultPaginationCount = 21
