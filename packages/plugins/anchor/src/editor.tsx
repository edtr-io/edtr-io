import { EditorInput } from '@edtr-io/editor-ui'
import { Icon, faLink, styled } from '@edtr-io/ui'
import * as React from 'react'

import { AnchorProps } from '.'
import { AnchorRenderer } from './renderer'

const StyledIcon = styled(Icon)({ marginRight: '5px' })

export const AnchorEditor = (props: AnchorProps) => {
  const { editable, focused, state } = props
  return (
    <React.Fragment>
      {editable ? <StyledIcon icon={faLink} /> : null}
      <AnchorRenderer {...props} />
      {focused ? (
        <EditorInput
          label="Identifier:"
          placeholder="Name der Sprungmarke"
          value={state.value}
          onChange={e => {
            state.set(e.target.value)
          }}
          ref={props.defaultFocusRef}
        />
      ) : null}
    </React.Fragment>
  )
}
