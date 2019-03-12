import { StatefulPluginEditorProps } from '@edtr-io/core'
import { styled } from '@edtr-io/ui'
import * as React from 'react'

import { SpoilerRenderer } from './renderer'
import { spoilerState } from '.'

const Input = styled.input({
  '&:active': {
    color: '#ffffff'
  }
})

export const SpoilerEditor = ({
  state,
  editable
}: StatefulPluginEditorProps<typeof spoilerState>) => {
  const { title } = state

  return (
    <SpoilerRenderer
      state={state}
      shown={editable}
      title={
        editable ? (
          <Input
            onChange={e => {
              title.set(e.target.value)
            }}
            value={title.value}
            placeholder="Title"
          />
        ) : (
          title.value
        )
      }
    />
  )
}
