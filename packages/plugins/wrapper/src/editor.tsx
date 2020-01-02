import * as React from 'react'

import { WrapperProps } from '.'

export function WrapperEditor(props: WrapperProps) {
  const { state } = props
  return <div>{state.render()}</div>
}
