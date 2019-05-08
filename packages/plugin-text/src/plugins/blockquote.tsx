import { Editor } from 'slate'
import { SlatePluginClosure } from '../factory/types'

export const isBlockquote = (
  editor: Editor,
  pluginClosure: SlatePluginClosure
) => {
  return !!(
    pluginClosure.current &&
    pluginClosure.current.parent &&
    pluginClosure.current.parent.name === 'blockquote'
  )
}

export const createBlockquote = (editor: Editor, name: string) => {
  editor.command('replaceWithPlugin', {
    plugin: 'blockquote',
    state: {
      plugin: name,
      state: editor.value.toJSON()
    }
  })
}

export const removeBlockquote = (
  editor: Editor,
  pluginClosure: SlatePluginClosure
) => {
  if (pluginClosure.current && isBlockquote(editor, pluginClosure)) {
    return editor.command('unwrapParent')
  }
}
