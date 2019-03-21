import { ExpandableBox } from '@edtr-io/ui'
import * as React from 'react'
import { StatefulPluginEditorProps } from 'plugin-input-exercise/dist/core/src'
import { solutionState } from '.'

export class SolutionEditor extends React.Component<
  StatefulPluginEditorProps<typeof solutionState>
> {
  public render(): React.ReactNode {
    return (
      <ExpandableBox
        state={this.props.state}
        editable={this.props.editable}
        kind="Lösung"
      />
    )
  }
}
