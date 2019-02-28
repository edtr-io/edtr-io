import { Hint } from '@edtr-io/ui'
import { Document, StatefulPluginEditorProps } from '@edtr-io/core'
import * as React from 'react'

import { solutionState } from '.'

export class SolutionRenderer extends React.Component<
  StatefulPluginEditorProps<typeof solutionState>
> {
  public render(): React.ReactNode {
    const { state } = this.props

    return (
      <Hint kind="Lösung" title={state.value.title.value}>
        <Document state={state.value.content.$$value} />
      </Hint>
    )
  }
}
