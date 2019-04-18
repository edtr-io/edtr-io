import { StatefulPluginEditorProps } from '@edtr-io/core'
import { Icon, faLink } from '@edtr-io/editor-ui'
import * as React from 'react'

import { AnchorRenderer } from './renderer'
import { anchorState } from '.'

export const AnchorEditor = (
  props: StatefulPluginEditorProps<typeof anchorState>
) => {
  const { editable, focused, state } = props
  return (
    <React.Fragment>
      {editable ? <Icon icon={faLink} /> : null}
      <AnchorRenderer {...props} />
      {focused ? (
        <React.Fragment>
          <hr />
          <label>
            Identifier:
            <input
              value={state.value}
              onChange={e => {
                state.set(e.target.value)
              }}
            />
          </label>
        </React.Fragment>
      ) : null}
    </React.Fragment>
  )
}
