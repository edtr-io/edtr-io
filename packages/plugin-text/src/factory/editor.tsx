import {
  StatefulPluginEditorProps,
  EditorContext,
  getPlugins,
  Plugin,
  OverlayContext,
  useEditorFocus
} from '@edtr-io/core'
import * as React from 'react'
import { Editor, EventHook, findNode } from 'slate-react'
import { Editor as CoreEditor, Value } from 'slate'

import { TextPlugin } from '..'
import { TextPluginOptions } from './types'

import { textState } from '.'

export const createTextEditor = (
  options: TextPluginOptions
): React.ComponentType<SlateEditorProps> => {
  return function SlateEditor(props: SlateEditorProps) {
    const { focusPrevious, focusNext } = useEditorFocus()
    const editor = React.useRef<Editor>()
    const store = React.useContext(EditorContext)
    const overlayContext = React.useContext(OverlayContext)
    const plugins = getPlugins(store.state)
    const [rawState, setRawState] = React.useState(
      Value.fromJSON(props.state.value)
    )
    const lastValue = React.useRef(props.state.value)
    React.useEffect(() => {
      if (lastValue.current !== props.state.value) {
        setRawState(Value.fromJSON(props.state.value))
        lastValue.current = props.state.value
      }
    }, [lastValue, props.state.value])

    const pluginClosure = React.useRef({ overlayContext })
    const slatePlugins = React.useRef<TextPlugin[]>()
    if (slatePlugins.current === undefined) {
      slatePlugins.current = options.plugins.map(slatePluginFactory =>
        slatePluginFactory(pluginClosure)
      )
    }
    // PLEASE DONT FIX THIS! Closure needed because on* isn't recreated so doesnt use current props
    const slateClosure = React.useRef<SlateClosure>({
      plugins: plugins,
      insert: props.insert,
      focusPrevious: focusPrevious,
      focusNext: focusNext
    })
    slateClosure.current = {
      plugins: plugins,
      insert: props.insert,
      focusPrevious: focusPrevious,
      focusNext: focusNext
    }
    React.useEffect(() => {
      if (!editor.current) return
      if (props.focused) {
        editor.current.focus()
      } else {
        editor.current.blur()
      }
    }, [props.focused])

    return (
      <Editor
        ref={editor as React.RefObject<Editor>}
        onPaste={createOnPaste(slateClosure)}
        onKeyDown={createOnKeyDown(slateClosure)}
        onClick={(e, editor, next): CoreEditor | void => {
          if (e.target) {
            // @ts-ignore
            const node = findNode(e.target as Element, editor)
            if (!node) {
              return editor
            }
          }
          next()
        }}
        onChange={change => {
          const nextValue = change.value.toJSON()
          setRawState(change.value)
          const withoutSelections = change.operations.filter(
            operation =>
              typeof operation !== 'undefined' &&
              operation.type !== 'set_selection'
          )
          if (!withoutSelections.isEmpty()) {
            lastValue.current = nextValue
            props.state.set(nextValue)
          }
        }}
        placeholder={options.placeholder}
        plugins={slatePlugins.current}
        readOnly={!props.focused}
        value={rawState}
      />
    )
  }
}

// PLEASE DONT FIX THIS! Closure needed because onPaste isn't recreated so doesnt use props
function createOnPaste(slateClosure: React.RefObject<SlateClosure>): EventHook {
  return (e, editor, next): void => {
    if (!slateClosure.current) {
      next()
      return
    }

    const { plugins, insert } = slateClosure.current
    if (typeof insert !== 'function') {
      next()
      return
    }

    const { clipboardData } = e as ClipboardEvent

    for (let key in plugins) {
      const { onPaste } = plugins[key]
      if (typeof onPaste === 'function') {
        const result = onPaste(clipboardData)
        if (result !== undefined) {
          const nextSlateState = splitBlockAtSelection(editor)

          setTimeout(() => {
            insert({ plugin: 'text', state: nextSlateState })
            insert({ plugin: key, state: result.state })
          })
          return
        }
      }
    }

    next()
  }
}

// PLEASE DONT FIX THIS! Closure needed because onKeyDown isn't recreated so doesnt use props
function createOnKeyDown(
  slateClosure: React.RefObject<SlateClosure>
): EventHook {
  return (e, editor, next): void => {
    const { key } = (e as unknown) as React.KeyboardEvent

    if (key === 'Enter') {
      if (
        slateClosure.current &&
        typeof slateClosure.current.insert === 'function'
      ) {
        e.preventDefault()
        const nextSlateState = splitBlockAtSelection(editor)

        setTimeout(() => {
          if (!slateClosure.current) return
          const { insert } = slateClosure.current
          if (typeof insert !== 'function') return
          insert({ plugin: 'text', state: nextSlateState })
        })
        return
      }
    }

    if (key === 'ArrowDown' || key === 'ArrowUp') {
      const lastRange = getRange()

      if (lastRange) {
        const lastY = lastRange.getBoundingClientRect().top
        setTimeout(() => {
          if (!slateClosure.current) {
            return
          }
          const currentRange = getRange()
          if (!currentRange) {
            return
          }
          const currentY = currentRange.getBoundingClientRect().top
          if (lastY === currentY) {
            if (key === 'ArrowDown') {
              slateClosure.current.focusNext()
            } else {
              slateClosure.current.focusPrevious()
            }
          }
        })
      }
    }

    next()
  }

  function getRange(): Range | null {
    const selection = window.getSelection()

    if (selection.rangeCount > 0) {
      return selection.getRangeAt(0)
    }

    return null
  }
}

function splitBlockAtSelection(editor: CoreEditor) {
  editor.splitBlock(1)
  const blocks = editor.value.document.getBlocks()

  const afterSelected = blocks.skipUntil(block => {
    if (!block) {
      return false
    }
    return editor.value.blocks.first().key === block.key
  })

  afterSelected.forEach(block => {
    if (!block) return

    editor.removeNodeByKey(block.key)
  })

  return {
    document: {
      nodes: [...afterSelected.map(block => block && block.toJSON()).toJS()]
    }
  }
}

export type SlateEditorProps = StatefulPluginEditorProps<
  typeof textState,
  SlateEditorAdditionalProps
>

export interface SlateEditorAdditionalProps {
  insert?: (options?: { plugin: string; state?: unknown }) => void
}

interface SlateClosure extends SlateEditorAdditionalProps {
  focusPrevious: () => void
  focusNext: () => void
  plugins: Record<string, Plugin>
}
