import { useEffect, useState } from 'react'

export function useWindowWidth(): number {
  const [windowWidth, setWindowWidth] = useState<number>(0)

  const handleWidthChange = (): void => {
    setWindowWidth(window.innerWidth)
  }

  useEffect(() => {
    window.addEventListener('resize', handleWidthChange)
    handleWidthChange()
    return () => window.removeEventListener('resize', handleWidthChange)
  }, [])

  return windowWidth
}
