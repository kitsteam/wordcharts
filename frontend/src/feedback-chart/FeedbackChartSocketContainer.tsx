import React, { useEffect, useState, useContext } from 'react'
import { UserChart, ReactWordcloudSettings, ServerWord, WordListResponseFromServer, GrammaticalCategoryColors } from '../shared/types'
import { WebsocketContext } from '../shared/PhoenixWebsocketProvider'
import { defaultGrammaticalCategoryColors } from '../shared/defaultChartSettings'
import { FeedbackChartAdminPage } from './FeedbackChartAdminPage'

function FeedbackChartSocketContainer(): React.ReactElement {
  const [newWords, setNewWords] = useState<ServerWord[]>([])
  const [reactWordchartSettings, setReactWordcloudSettings] = useState<ReactWordcloudSettings>({})
  const { channel, adminId } = useContext(WebsocketContext)
  const [categoryColors, setCategoryColors] = useState<GrammaticalCategoryColors>(defaultGrammaticalCategoryColors)

  // Initialize channel
  useEffect(() => {
    if (channel === undefined) return

    channel.join()
      .receive('ok', (chart: UserChart) => {
        if (chart?.settings?.wordchartSettings !== undefined) setReactWordcloudSettings(chart.settings.wordchartSettings)
        setCategoryColors(chart?.settings?.grammaticalCategoryColors ?? defaultGrammaticalCategoryColors)
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
      setCategoryColors(chart?.settings?.grammaticalCategoryColors ?? defaultGrammaticalCategoryColors)
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
        <FeedbackChartAdminPage
          reactWordchartSettingsFromServer={reactWordchartSettings}
          colorsFromServer={categoryColors}
          words={newWords}
        />
      }
    </div>
  )
}

export { FeedbackChartSocketContainer }
