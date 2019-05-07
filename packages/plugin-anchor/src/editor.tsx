import { StatefulPluginEditorProps } from '@edtr-io/core'
import { Icon, faLink, EditorInput, styled } from '@edtr-io/editor-ui'
import * as React from 'react'

import { AnchorRenderer } from './renderer'
import { anchorState } from '.'

const StyledIcon = styled(Icon)({ marginRight: '5px' })
export const AnchorEditor = (
  props: StatefulPluginEditorProps<typeof anchorState>
) => {
  const { editable, focused, state } = props
  return (
    <React.Fragment>
      {editable ? <StyledIcon icon={faLink} /> : null}
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
