import { getDocument, getFocused, getFocusPath, replace } from '@edtr-io/store'
import * as R from 'ramda'
import * as React from 'react'

import { TextEditorPlugin } from '../types'

export function createBlockquotePlugin({
  plugin,
  control
}: {
  plugin: string
  control?: {
    title: string
    icon: React.ReactNode
  }
}): TextEditorPlugin {
  return function(editor, store) {
    const { controls } = editor
    if (control) {
      editor.controls = [
        ...controls,
        {
          title: control.title,
          renderIcon() {
            return control.icon
          },
          isActive,
          onClick() {
            isActive() ? unwrap() : wrap()
          }
        }
      ]
    }

    return editor

    function isActive() {
      return findNearest() !== undefined
    }

    function wrap() {
      const id = getFocused()(store.getState())
      if (!id) return
      store.dispatch(
        replace({
          id,
          document(id) {
            return {
              plugin,
              state: id
            }
          }
        })
      )
    }

    function unwrap() {
      const id = getFocused()(store.getState())
      if (!id) return
      const document = getDocument(id)(store.getState())
      if (!document) return
      const blockqouoteId = findNearest()
      if (!id || !blockqouoteId) return
      store.dispatch(
        replace({
          id: blockqouoteId,
          document() {
            return document
          }
        })
      )
    }

    function findNearest() {
      return R.findLast(id => {
        const document = getDocument(id)(store.getState())
        return document ? document.plugin === plugin : false
      }, getFocusPath()(store.getState()) || [])
    }
  }
}
