import React, { useEffect, useState, useContext } from 'react'
import { LiveChartUserPage } from './LiveChartUserPage'
import { LiveChartAdminPage } from './LiveChartAdminPage'
import { UserChart, ReactWordcloudSettings, ServerWord, WordListResponseFromServer, GrammaticalCategoryColors, GrammaticalCategoryIndex } from '../shared/types'
import { WebsocketContext } from '../shared/PhoenixWebsocketProvider'
import { ALL_CATEGORIES, defaultGrammaticalCategoryColors } from '../shared/defaultChartSettings'

function LiveChartSocketContainer(): React.ReactElement {
  const [newWords, setNewWords] = useState<ServerWord[]>([])
  const [reactWordchartSettings, setReactWordcloudSettings] = useState<ReactWordcloudSettings>({})
  const { channel, adminId } = useContext(WebsocketContext)
  const [wordFilter, setWordFilter] = useState<GrammaticalCategoryIndex[]>(ALL_CATEGORIES)
  const [language, setLanguage] = useState<string>('')
  const [categoryColors, setCategoryColors] = useState<GrammaticalCategoryColors>(defaultGrammaticalCategoryColors)

  // Initialize channel
  useEffect(() => {
    if (channel === undefined) return

    channel.join()
      .receive('ok', (chart: UserChart) => {
        if (chart?.settings?.wordchartSettings !== undefined) setReactWordcloudSettings(chart.settings.wordchartSettings)
        setWordFilter(chart.grammatical_search_filter)
        setCategoryColors(chart?.settings?.grammaticalCategoryColors ?? defaultGrammaticalCategoryColors)
        setLanguage(chart.language ?? 'en')
      })
      .receive('error', (_resp) => { console.log('Unable to join') })

    channel.push('list_words', {})
      .receive('ok', (newWordsFromServer: ServerWord[]) => {
        setNewWords(newWordsFromServer)
      })
  }, [channel])

  // Initialize further callbacks
  useEffect(() => {
    const appendWord = (word: ServerWord): void => {
      setNewWords([...newWords, word])
    }

    const integrateWord = (newWord: ServerWord): void => {
      const matchedWords = newWords.filter((word: ServerWord) => word?.name?.toLowerCase() === newWord?.name?.toLowerCase())
      if (matchedWords.length === 0) {
        appendWord(newWord)
        return
      }

      const changedWord: ServerWord = matchedWords[0]
      changedWord.value = changedWord?.value !== undefined ? changedWord.value + 1 : 1

      const newState = newWords.map((word: ServerWord) => {
        if (word.name === changedWord.name) {
          return changedWord
        }

        return word
      })

      setNewWords(newState)
    }

    if (channel == null) return

    const newWordRef: number = channel.on('new_word', (word: ServerWord) => integrateWord(word))
    const updateWordListRef: number = channel.on('update_word_list', (list: WordListResponseFromServer) => { setNewWords(list.words) })
    const updateChartRef: number = channel.on('update_chart', (chart: UserChart) => {
      setReactWordcloudSettings((previousSettings): ReactWordcloudSettings => {
        return { ...previousSettings, ...chart?.settings?.wordchartSettings ?? {} }
      })
      setWordFilter(chart.grammatical_search_filter)
      setCategoryColors(chart?.settings?.grammaticalCategoryColors ?? defaultGrammaticalCategoryColors)
      setLanguage(chart.language ?? 'en')
    })

    return () => {
      channel.off('new_word', newWordRef)
      channel.off('update_word_list_ref', updateWordListRef)
      channel.off('update_chart', updateChartRef)
    }
  }, [channel, newWords])

  return (
    <div>
      {adminId !== undefined &&
        <LiveChartAdminPage
          reactWordchartSettingsFromServer={reactWordchartSettings}
          filterFromServer={wordFilter}
          colorsFromServer={categoryColors}
          language={language}
          words={newWords}
        />
      }
      {adminId === undefined &&
        <LiveChartUserPage
          reactWordchartSettings={reactWordchartSettings}
          language={language}
          words={newWords}
          currentWordFilter={wordFilter}
          wordColors={categoryColors}
        />
      }
    </div>
  )
}

export { LiveChartSocketContainer }
