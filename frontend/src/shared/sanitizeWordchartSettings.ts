import { ReactWordcloudSettings } from './types'

// Settings come from the server and are passed into react-wordcloud, which applies some
// options (e.g. textAttributes, svgAttributes, tooltipOptions) as raw DOM attributes / HTML.
// Only pass on known options with values of the expected shape.
const COLOR_REGEX = /^#[0-9a-fA-F]{3,8}$/
const CSS_KEYWORD_REGEX = /^[a-zA-Z0-9 -]{1,50}$/

// Bounds keep admins from setting values that hang the layout in every viewer's browser
const NUMBER_BOUNDS = {
  padding: [0, 20],
  rotations: [0, 10],
  transitionDuration: [0, 5000],
  fontSizes: [1, 200],
  rotationAngles: [-90, 90]
} as const

const isInRange = (value: unknown, [min, max]: readonly [number, number]): value is number =>
  typeof value === 'number' && value >= min && value <= max

const isMinMaxPair = (value: unknown, bounds: readonly [number, number]): value is [number, number] =>
  Array.isArray(value) && value.length === 2 && value.every((entry) => isInRange(entry, bounds))

const isCssKeyword = (value: unknown): value is string => typeof value === 'string' && CSS_KEYWORD_REGEX.test(value)

export const isColor = (value: unknown): value is string => typeof value === 'string' && COLOR_REGEX.test(value)

export const sanitizeWordchartSettings = (settings: unknown): ReactWordcloudSettings => {
  if (settings === null || typeof settings !== 'object') return {}
  const input = settings as Record<string, unknown>
  const sanitized: ReactWordcloudSettings = {}

  if (Array.isArray(input.colors)) sanitized.colors = input.colors.filter(isColor)
  for (const key of ['enableTooltip', 'deterministic', 'enableOptimizations'] as const) {
    if (typeof input[key] === 'boolean') sanitized[key] = input[key]
  }
  for (const key of ['padding', 'rotations', 'transitionDuration'] as const) {
    if (isInRange(input[key], NUMBER_BOUNDS[key])) sanitized[key] = input[key]
  }
  for (const key of ['fontFamily', 'fontStyle', 'fontWeight'] as const) {
    if (isCssKeyword(input[key])) sanitized[key] = input[key]
  }
  if (isMinMaxPair(input.fontSizes, NUMBER_BOUNDS.fontSizes)) sanitized.fontSizes = input.fontSizes
  if (isMinMaxPair(input.rotationAngles, NUMBER_BOUNDS.rotationAngles)) sanitized.rotationAngles = input.rotationAngles
  if (input.scale === 'linear' || input.scale === 'log' || input.scale === 'sqrt') sanitized.scale = input.scale
  if (input.spiral === 'archimedean' || input.spiral === 'rectangular') sanitized.spiral = input.spiral

  return sanitized
}
