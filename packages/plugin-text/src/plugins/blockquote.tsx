import { Editor } from 'slate'

export const createBlockquote = (editor: Editor, name: string) => {
  editor.command('replaceWithPlugin', {
    plugin: 'blockquote',
    state: {
      plugin: name,
      state: editor.value.toJSON()
    }
  })
}
