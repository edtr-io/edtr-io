import { StatefulPluginEditorProps } from '@edtr-io/core'
import { Overlay, AutoFocusInput, ContainerWithConfigButton } from '@edtr-io/ui'
import * as React from 'react'

import { H5pRenderer } from './renderer'
import { h5pState } from '.'

export class H5pEditor extends React.Component<
  StatefulPluginEditorProps<typeof h5pState>
> {
  public render() {
    const { focused, state } = this.props

    return (
      <React.Fragment>
        <ContainerWithConfigButton>
          <H5pRenderer key={state.src()} state={state} />
        </ContainerWithConfigButton>
        {focused ? (
          <Overlay>
            <AutoFocusInput
              label="serlo.h5p.com ID"
              placeholder="1221221"
              onChange={this.handleChange}
              value={state.src()}
            />
          </Overlay>
        ) : null}
      </React.Fragment>
    )
  }

  private handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target
    this.props.state.src.set(target.value)
  }
}
