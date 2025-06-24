import { useEffect, useState } from 'react'

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

export function getBreakpoint(width: number): keyof typeof breakpoints | undefined {
  if (width >= breakpoints['2xl']) return '2xl'
  if (width >= breakpoints.xl) return 'xl'
  if (width >= breakpoints.lg) return 'lg'
  if (width >= breakpoints.md) return 'md'
  if (width >= breakpoints.sm) return 'sm'
  return undefined
}

export function useBreakpoint(): keyof typeof breakpoints | undefined {
  const [breakpoint, setBreakpoint] = useState<keyof typeof breakpoints | undefined>(undefined)
  useEffect(() => {
    function handleResize() {
      setBreakpoint(getBreakpoint(window.innerWidth))
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return breakpoint
} 