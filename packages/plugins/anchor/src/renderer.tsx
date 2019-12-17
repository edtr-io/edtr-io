import { EditorPluginProps } from '@edtr-io/plugin'
import { styled } from '@edtr-io/ui'
import * as React from 'react'

import { anchorState } from '.'

const Anchor = styled.a({
  visibility: 'hidden'
})

export function AnchorRenderer(props: EditorPluginProps<typeof anchorState>) {
  return <Anchor id={props.state.value} />
}
