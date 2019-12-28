import * as React from 'react'

import { Mark } from './types'

function EmMark({ children }: { children: React.ReactNode }) {
  return <em>{children}</em>
}

export const emMark: Mark = {
  Component: EmMark,
  hotkey: 'mod+i'
}
