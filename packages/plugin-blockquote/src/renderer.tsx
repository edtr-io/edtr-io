import { StatefulPluginEditorProps } from '@edtr-io/core'
import * as React from 'react'

import { blockquoteState } from '.'

export function BlockquoteRenderer(
  props: StatefulPluginEditorProps<typeof blockquoteState>
) {
  return <blockquote>{props.state.render()}</blockquote>
}
