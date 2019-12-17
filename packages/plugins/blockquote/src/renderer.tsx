import { EditorPluginProps } from '@edtr-io/plugin'
import * as React from 'react'

import { BlockquotePluginState } from '.'

export function BlockquoteRenderer(
  props: EditorPluginProps<BlockquotePluginState>
) {
  return <blockquote>{props.state.render()}</blockquote>
}
