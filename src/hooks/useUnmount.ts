import { useEffect } from 'react'
import { useLatest } from './useLatest'

export function useUnmount(func: () => void) {
  const funcRef = useLatest(func)

  useEffect(
    () => () => {
      funcRef.current()
    },
    []
  )
}
