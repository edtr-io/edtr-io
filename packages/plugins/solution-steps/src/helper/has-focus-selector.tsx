import { useScopedSelector } from '@edtr-io/core'
import { isFocused, hasFocusedDescendant } from '@edtr-io/store'

export function useHasFocusSelector(id: string) {
  const elementFocused = useScopedSelector(isFocused(id))
  const descendantFocused = useScopedSelector(hasFocusedDescendant(id))
  return elementFocused || descendantFocused
}
