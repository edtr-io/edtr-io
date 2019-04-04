import { StatefulPluginEditorProps } from '@edtr-io/core'
import * as React from 'react'
import { styled, createPluginTheme, EditorThemeProps } from '@edtr-io/ui'
import { blockquoteState } from '.'

const createBlockquoteTheme = createPluginTheme<BlockquoteTheme>(theme => {
  return {
    borderColor: theme.backgroundColor,
    borderStyle: '5px solid',
    padding: '100px'
  }
})
const Blockquote = styled.blockquote((props: EditorThemeProps) => {
  const theme = createBlockquoteTheme('blockquote', props.theme)

  return {
    borderLeft: `${theme.borderStyle} ${theme.borderColor}`,
    padding: '5px'
  }
})

export function BlockquoteRenderer(
  props: StatefulPluginEditorProps<typeof blockquoteState>
) {
  return <Blockquote>{props.state.render()}</Blockquote>
}

export interface BlockquoteTheme {
  borderColor: string
  borderStyle: string
}
