import { getDocument, getParent, unwrap, wrap } from '@edtr-io/store'
import { Editor } from 'slate-react'

import { SlatePluginClosure } from '../factory/types'

export const isBlockquote = (
  editor: Editor,
  pluginClosure: SlatePluginClosure
) => {
  if (!pluginClosure.current) return false
  const { config, id, store } = pluginClosure.current
  const parent = getParent(id)(store.getState())
  if (!parent) return false
  const parentDocument = getDocument(parent.id)(store.getState())
  if (!parentDocument) return false
  return parentDocument.plugin === config.blockquote
}

export const createBlockquote = (
  editor: Editor,
  pluginClosure: SlatePluginClosure
) => {
  if (!pluginClosure.current) return
  const { config, id, store } = pluginClosure.current
  if (!config.blockquote) return
  const { blockquote } = config
  store.dispatch(
    wrap({
      id,
      document(id) {
        return {
          plugin: blockquote,
          state: id
        }
      }
    })
  )
}

export const removeBlockquote = (
  editor: Editor,
  pluginClosure: SlatePluginClosure
) => {
  if (isBlockquote(editor, pluginClosure)) {
    if (!pluginClosure.current) return
    const { config, id, store } = pluginClosure.current
    if (!config.blockquote) return
    const parent = getParent(id)(store.getState())
    if (!parent) return
    store.dispatch(
      unwrap({
        id: parent.id,
        oldId: id
      })
    )
  }
}
