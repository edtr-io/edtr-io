import { StatefulPluginEditorProps } from '@edtr-io/core'
import { styled } from '@edtr-io/renderer-ui'
import * as React from 'react'

import { importantStatementState } from '.'

const Box = styled.div({
  borderLeft: '#bedfed solid 5px',
  paddingLeft: '15px'
})

export function ImportantStatementRenderer(
  props: StatefulPluginEditorProps<typeof importantStatementState>
) {
  return <Box>{props.state.render()}</Box>
}
