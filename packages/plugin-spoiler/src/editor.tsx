import { SpoilerRenderer } from './renderer'
import styled from 'styled-components'
import * as React from 'react'
import { StatefulPluginEditorProps } from '@edtr-io/core'
import { spoilerState } from '.'

const Input = styled.input({
  '&:active': {
    color: '#ffffff'
  }
})

export const SpoilerEditor = (
  props: StatefulPluginEditorProps<typeof spoilerState>
) => {
  const { editable } = props
  return (
    <SpoilerRenderer
      state={props.state}
      shown={!editable}
      title={
        <Input
          onChange={e => {
            props.state.value.title.set(e.target.value)
          }}
          value={props.state.value.title.value}
          placeholder="Your Title Here"
        />
      }
    />
  )
}
export interface SpoilerPluginState {
  title: string
  content: React.ReactNode
}
