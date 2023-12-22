import { MinMaxPair, Scale, Spiral } from 'react-wordcloud'

// User chart is shared when joining and contains less information than the server chart
interface UserChart {
  id: string
  name: string
  grammatical_search_filter: GrammaticalCategoryIndex[]
  language: string
  settings: {
    wordchartSettings?: ReactWordcloudSettings
    chartType?: string
    grammaticalCategoryColors?: GrammaticalCategoryColors
  }
}

interface ServerChart extends UserChart {
  admin_url_id: string
  chart_type: string
  created_at: Date
  updated_at: Date
  words?: ServerWord[]
}

interface GrammaticalCategoryColors {
  adjective?: string
  adverb?: string
  verb?: string
  noun?: string
  pronoun?: string
  article?: string
  conjuncture?: string
  misc?: string
  preposition?: string
  default: string
}

type GrammaticalCategoryIndex = 'adjective' | 'adverb' | 'verb' | 'noun' | 'pronoun' | 'article' | 'conjuncture' | 'misc' | 'preposition' | 'default'

interface ServerWord {
  name: string
  value: number
  grammatical_categories: GrammaticalCategoryIndex[]
};

type ChannelName = `chart:${string}`

interface WordListResponseFromServer {
  words: ServerWord[]
}

interface ServerChartResponse {
  data: ServerChart
}

// See also https://github.com/b310-digital/react-wordcloud/blob/main/types/index.d.ts
interface ReactWordcloudSettings {
  colors?: string[]
  enableTooltip?: boolean
  deterministic?: boolean
  fontFamily?: string
  fontSizes?: MinMaxPair
  fontStyle?: string
  fontWeight?: string
  padding?: number
  rotations?: number
  rotationAngles?: MinMaxPair
  scale?: Scale
  spiral?: Spiral
  transitionDuration?: number
  enableOptimizations?: boolean
}

export type { ServerChart, ChannelName, ServerWord, WordListResponseFromServer, ReactWordcloudSettings, UserChart, ServerChartResponse, GrammaticalCategoryColors, GrammaticalCategoryIndex }
