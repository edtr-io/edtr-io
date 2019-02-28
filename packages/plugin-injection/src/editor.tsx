import { InjectionRenderer } from './renderer'
// TODO: replace import { Input, renderIntoSidebar } from '@splish-me/editor-ui'
import * as React from 'react'
import { StatefulPluginEditorProps } from '@edtr-io/core'
import { injectionState } from '.'

export class InjectionEditor extends React.Component<
  StatefulPluginEditorProps<typeof injectionState>
> {
  public render() {
    const { focused, editable, state } = this.props

    return (
      <React.Fragment>
        <InjectionRenderer disableCursorEvents={editable} state={state} />
        {focused ? (
          //TODO: render into overlay
          <React.Fragment>
            <hr />
            Injection Element
            <input
              placeholder="/12345"
              onChange={this.handleChange}
              value={state.value.src.value}
            />
          </React.Fragment>
        ) : null}
      </React.Fragment>
    )
  }

  private handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.state.value.src.set(e.target.value)
  }
}
