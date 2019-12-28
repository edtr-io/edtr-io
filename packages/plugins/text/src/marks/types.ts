import React from 'react'

export interface Mark {
  Component: React.ComponentType<{ children: React.ReactNode }>
  hotkey?: string | ReadonlyArray<string>
}
