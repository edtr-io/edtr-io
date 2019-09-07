import { StatefulPluginEditorProps } from '@edtr-io/plugin'
import * as React from 'react'

import { blockquoteState } from '.'

export function BlockquoteRenderer(
  props: StatefulPluginEditorProps<typeof blockquoteState>
) {
  return <blockquote>{props.state.render()}</blockquote>
}
