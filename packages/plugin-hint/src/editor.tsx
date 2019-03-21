import { ExpandableBox } from '@edtr-io/ui'
import * as React from 'react'
import { StatefulPluginEditorProps } from 'plugin-input-exercise/dist/core/src'
import { hintState } from '.'

export class HintEditor extends React.Component<
  StatefulPluginEditorProps<typeof hintState>
> {
  public render(): React.ReactNode {
    return (
      <ExpandableBox
        state={this.props.state}
        editable={this.props.editable}
        kind="Hinweis"
      />
    )
  }
}
