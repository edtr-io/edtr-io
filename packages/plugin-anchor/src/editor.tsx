import { StatefulPluginEditorProps } from '@edtr-io/core'
import { Icon, faLink, EditorInput } from '@edtr-io/editor-ui'
import * as React from 'react'

import { AnchorRenderer } from './renderer'
import { anchorState } from '.'

export const AnchorEditor = (
  props: StatefulPluginEditorProps<typeof anchorState>
) => {
  const { editable, focused, state } = props
  return (
    <React.Fragment>
      {editable ? <Icon icon={faLink} style={{ marginRight: '5px' }} /> : null}
      <AnchorRenderer {...props} />
      {focused ? (
        <EditorInput
          label="Identifier:"
          value={state.value}
          onChange={e => {
            state.set(e.target.value)
          }}
        />
      ) : null}
    </React.Fragment>
  )
}
