import { SpoilerRenderer } from './renderer'
import styled from 'styled-components'
import * as React from 'react'
import { Blackbox, createObject, createLeaf, createChild } from '@edtr-io/core'

const Input = styled.input({
  '&:active': {
    color: '#ffffff'
  }
})

export function SpoilerEditor(props: Blackbox) {
  const { editable } = props
  const state = createObject([
    { key: 'title', hook: createLeaf('') },
    { key: 'content', hook: createChild() }
  ])

  return (
    <SpoilerRenderer
      state={state}
      shown={!editable}
      title={
        <Input
          onChange={e => {
            state.title.setValue(e.target.value)
          }}
          value={state.title.value}
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
