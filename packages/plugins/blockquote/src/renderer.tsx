import { StatefulPluginEditorProps } from '@edtr-io/plugin'
import * as React from 'react'

import { BlockquotePluginState } from '.'

export function BlockquoteRenderer(
  props: StatefulPluginEditorProps<BlockquotePluginState>
) {
  return <blockquote>{props.state.render()}</blockquote>
}
