import { styled } from '@edtr-io/ui'
import * as React from 'react'

import { AnchorProps } from '.'

const Anchor = styled.a({
  visibility: 'hidden',
})

export function AnchorRenderer(props: AnchorProps) {
  return <Anchor id={props.state.value} />
}
