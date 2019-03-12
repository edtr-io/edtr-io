import * as React from 'react'

import { EditorContext } from '../editor-context'
import { getDocument, getPlugin } from '../store'

import { DocumentProps } from '.'

export const DocumentRenderer: React.FunctionComponent<
  DocumentProps
> = props => {
  const store = React.useContext(EditorContext)

  const document = getDocument(store.state, props.id)
  if (!document) {
    return null
  }

  const plugin = getPlugin(store.state, document.plugin)

  if (!plugin) {
    // TODO:
    // eslint-disable-next-line no-console
    console.log('Plugin does not exist')
    return null
  }

  return (
    // @ts-ignore
    <plugin.Component state={plugin.state(document.state, () => {})} />
  )
}
