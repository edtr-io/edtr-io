import { Document, StatefulPluginEditorProps } from '@edtr-io/core'
import * as React from 'react'
import { blockquoteState } from '.'

export const BlockquoteRenderer = (
  props: StatefulPluginEditorProps<typeof blockquoteState>
) => {
  return (
    <blockquote>
      <Document state={props.state.$$value} />
    </blockquote>
  )
}
