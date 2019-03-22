import { StatefulPlugin, StateType } from '@edtr-io/core'
import * as React from 'react'
import { HeadingEditor } from './editor'

export const headingState = StateType.object({
  text: StateType.string(''),
  content: StateType.child('rows')
})

export const headingPlugin: StatefulPlugin<typeof headingState> = {
  Component: HeadingEditor,
  state: headingState
}

export const HeadingContext = React.createContext<{ level: number }>({
  level: 2
})
