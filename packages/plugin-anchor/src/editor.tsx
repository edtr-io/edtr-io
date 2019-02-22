import { Icon, faLink } from '@edtr-io/ui'
import { AnchorRenderer } from './renderer'
import { anchorState } from '.'
// TODO: replace import { Input, renderIntoSidebar } from '@splish-me/editor-ui'
import * as React from 'react'
import { StatefulPluginEditorProps } from '@edtr-io/core'

export const AnchorEditor = (
  props: StatefulPluginEditorProps<typeof anchorState>
) => {
  const { editable, focused, state } = props
  return (
    <React.Fragment>
      {editable ? <Icon icon={faLink} /> : null}
      <AnchorRenderer state={state} />
      {focused ? (
        // TODO: renderIntoOverlay
        <React.Fragment>
          <hr />
          <label>
            Identifier:
            <input
              value={state.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                state.set(e.target.value)
              }}
            />
          </label>
        </React.Fragment>
      ) : null}
    </React.Fragment>
  )
}
