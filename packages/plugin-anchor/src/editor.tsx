import { StatefulPluginEditorProps } from '@edtr-io/core'
import { Icon, faLink } from '@edtr-io/ui'
import * as React from 'react'

import { AnchorRenderer } from './renderer'
import { anchorState } from '.'

export const AnchorEditor = ({
  editable,
  focused,
  state
}: StatefulPluginEditorProps<typeof anchorState>) => {
  return (
    <React.Fragment>
      {editable ? <Icon icon={faLink} /> : null}
      <AnchorRenderer state={state} />
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
