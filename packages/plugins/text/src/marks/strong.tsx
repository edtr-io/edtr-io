import * as React from 'react'

import { Mark } from './types'

function StrongMark({ children }: { children: React.ReactNode }) {
  return <strong>{children}</strong>
}

export const strongMark: Mark = {
  Component: StrongMark,
  hotkey: 'mod+b'
}
