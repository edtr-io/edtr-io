import * as React from 'react'

import { NodeRendererProps } from '../..'
import { Math } from './math-component'

export const DefaultRendererComponent: React.FunctionComponent<
  NodeRendererProps
> = props => {
  const { node } = props

  const { data } = node

  if (!data) {
    return null
  }

  const formula = data.formula as string
  const inline = data.inline as boolean

  return <Math formula={formula} inline={inline} />
}
