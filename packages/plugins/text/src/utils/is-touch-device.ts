export function isTouchDevice() {
  return (
    typeof window !== 'undefined' &&
    ('ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      // @ts-expect-error TODO: Remove this if IE10 should not be supported
      navigator.msMaxTouchPoints > 0)
  )
}
