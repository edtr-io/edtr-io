import * as React from 'react'
import { BlockJSON, InlineJSON } from 'slate'

import { NodeRendererProps } from '../..'
import { Math } from './math.component'

export const DefaultRendererComponent: React.FunctionComponent<
  NodeRendererProps
> = props => {
  const { node } = props

  const { data } = node as BlockJSON | InlineJSON

  if (!data) {
    return null
  }

  const formula = data.formula as string
  const inline = data.inline as boolean

  return <Math formula={formula} inline={inline} />
}
