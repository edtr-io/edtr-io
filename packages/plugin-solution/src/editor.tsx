import { SolutionRenderer } from './renderer'
import { Hint } from '@edtr-io/ui'
import { Document, StatefulPluginEditorProps } from '@edtr-io/core'
import * as React from 'react'
import { solutionState } from '.'

export class SolutionEditor extends React.Component<
  StatefulPluginEditorProps<typeof solutionState>
> {
  public render(): React.ReactNode {
    const { state, editable } = this.props

    if (!editable) {
      return <SolutionRenderer state={state} />
    }

    return (
      <Hint
        kind="Lösung"
        shown
        title={
          <input
            onChange={e => state.value.title.set(e.target.value)}
            value={state.value.title.value}
            placeholder="Optionaler Lösungstitel"
          />
        }
      >
        <Document state={state.value.content.$$value} />
      </Hint>
    )
  }
}
