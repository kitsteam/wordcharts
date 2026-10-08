import { describe, expect, test } from 'vitest'
import { sanitizeWordchartSettings } from './sanitizeWordchartSettings'

describe('sanitizeWordchartSettings', () => {
  test('keeps known settings with valid values', () => {
    const settings = { colors: ['#ffffff'], rotationAngles: [0, 90], scale: 'sqrt', fontFamily: 'Arial', enableTooltip: false }
    expect(sanitizeWordchartSettings(settings)).toEqual(settings)
  })

  test('drops unknown settings and invalid values', () => {
    const settings = {
      textAttributes: { onmouseover: 'alert(1)' },
      svgAttributes: { onload: 'alert(1)' },
      tooltipOptions: { allowHTML: true },
      colors: ['#000', 'javascript:alert(1)'],
      fontFamily: 'Arial" onload="alert(1)',
      rotationAngles: [0, '90'],
      scale: 'evil',
      rotations: 1e9,
      padding: -1
    }
    expect(sanitizeWordchartSettings(settings)).toEqual({ colors: ['#000'] })
  })

  test('returns empty settings for non objects', () => {
    expect(sanitizeWordchartSettings(null)).toEqual({})
    expect(sanitizeWordchartSettings('settings')).toEqual({})
  })
})
