import { EditorInput } from '@edtr-io/editor-ui'
import { Icon, faLink, styled } from '@edtr-io/ui'
import * as React from 'react'

import { AnchorProps } from '.'
import { useAnchorConfig } from './config'
import { AnchorRenderer } from './renderer'

const StyledIcon = styled(Icon)({ marginRight: '5px' })

export const AnchorEditor = (props: AnchorProps) => {
  const { editable, focused, state, config } = props
  const { i18n } = useAnchorConfig(config)

  return (
    <>
      {editable ? <StyledIcon icon={faLink} /> : null}
      <AnchorRenderer {...props} />
      {focused ? (
        <EditorInput
          label={i18n.label}
          placeholder={i18n.placeholder}
          value={state.value}
          onChange={(e) => {
            state.set(e.target.value)
          }}
          ref={props.autofocusRef}
        />
      ) : null}
    </>
  )
}
