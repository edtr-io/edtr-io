import { styled } from '@edtr-io/renderer-ui'
import * as React from 'react'

import { ImportantStatementProps } from '.'

const Box = styled.div({
  borderLeft: '#bedfed solid 5px',
  paddingLeft: '15px'
})

export function ImportantStatementRenderer(props: ImportantStatementProps) {
  return <Box>{props.state.render()}</Box>
}
