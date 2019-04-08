import {
  StatefulPluginEditorProps,
  EditorContext,
  getPlugins,
  Plugin,
  OverlayContext,
  useEditorFocus
} from '@edtr-io/core'
import isHotkey from 'is-hotkey'
import * as React from 'react'
import { Editor, EventHook, findNode } from 'slate-react'
import {
  Editor as CoreEditor,
  Value,
  ValueJSON,
  Range as CoreRange
} from 'slate'

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
        setTimeout(() => {
          if (!editor.current) return
          if (props.focused) {
            editor.current.focus()
          }
        })
      }
    }, [lastValue, props.focused, props.state.value])

    const pluginClosure = React.useRef({ overlayContext })
    const slatePlugins = React.useRef<TextPlugin[]>()
    if (slatePlugins.current === undefined) {
      slatePlugins.current = options.plugins.map(slatePluginFactory =>
        slatePluginFactory(pluginClosure)
      )
    }
    // PLEASE DONT FIX THIS! Closure needed because on* isn't recreated so doesnt use current props
    const slateClosure = React.useRef<SlateClosure>({
      name: props.name || 'text',
      plugins: plugins,
      insert: props.insert,
      focusPrevious: focusPrevious,
      focusNext: focusNext,
      mergeWithNext: props.mergeWithNext,
      mergeWithPrevious: props.mergeWithPrevious
    })
    slateClosure.current = {
      name: props.name || 'text',
      plugins: plugins,
      insert: props.insert,
      focusPrevious: focusPrevious,
      focusNext: focusNext,
      mergeWithNext: props.mergeWithNext,
      mergeWithPrevious: props.mergeWithPrevious
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
        placeholder={props.editable ? options.placeholder : ''}
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

    const { plugins, insert, name } = slateClosure.current
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
            insert({ plugin: name, state: nextSlateState })
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

    if (
      isHotkey('mod+z', e as KeyboardEvent) ||
      isHotkey('mod+y', e as KeyboardEvent) ||
      isHotkey('mod+shift+z', e as KeyboardEvent)
    ) {
      e.preventDefault()
      return
    }

    if (isHotkey('enter', e as KeyboardEvent)) {
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
          insert({ plugin: slateClosure.current.name, state: nextSlateState })
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

    if (key === 'Backspace' && selectionAtStart(editor)) {
      if (!slateClosure.current) return
      const { mergeWithPrevious } = slateClosure.current
      if (typeof mergeWithPrevious !== 'function') return

      mergeWithPrevious(previous => {
        const value = Value.fromJSON(previous)
        const selection = CoreRange.create(editor.value.selection)
        editor
          // hack because empty slate looses focus
          .insertTextAtRange(selection, ' ')
          .insertFragmentAtRange(selection, value.document)
          .moveFocusBackward(1)
          .delete()
      })
      return
    }

    if (key === 'Delete' && selectionAtEnd(editor)) {
      if (!slateClosure.current) return
      const { mergeWithNext } = slateClosure.current
      if (typeof mergeWithNext !== 'function') return

      mergeWithNext(next => {
        const value = Value.fromJSON(next)
        const selection = CoreRange.create(editor.value.selection)
        editor
          .insertFragmentAtRange(selection, value.document)
          .select(selection)
      })
      return
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
  function selectionAtStart(editor: CoreEditor) {
    const { selection } = editor.value
    const startNode = editor.value.document.getFirstText()
    return (
      selection.isCollapsed &&
      startNode &&
      editor.value.startText.key === startNode.key &&
      selection.start.offset === 0
    )
  }
  function selectionAtEnd(editor: CoreEditor) {
    const { selection } = editor.value
    const endNode = editor.value.document.getLastText()
    return (
      selection.isCollapsed &&
      endNode &&
      editor.value.endText.key === endNode.key &&
      selection.end.offset === editor.value.endText.text.length
    )
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
  mergeWithNext?: (merge: (next: ValueJSON) => void) => void
  mergeWithPrevious?: (merge: (previous: ValueJSON) => void) => void
}

interface SlateClosure extends SlateEditorAdditionalProps {
  name: string
  focusPrevious: () => void
  focusNext: () => void
  plugins: Record<string, Plugin>
}
