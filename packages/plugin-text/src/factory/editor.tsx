import {
  StatefulPluginEditorProps,
  EditorContext,
  getPlugins,
  Plugin,
  OverlayContext
} from '@edtr-io/core'
import * as React from 'react'
import { Editor, EventHook, findNode } from 'slate-react'
import { Editor as CoreEditor, Value } from 'slate'

import { TextPluginOptions } from './types'

import { textState } from '.'
import { TextPlugin } from '@edtr-io/plugin-text'

export type SlateEditorProps = StatefulPluginEditorProps<
  typeof textState,
  {
    insert: (options?: { plugin: string; state?: unknown }) => void
  }
>

export const createTextEditor = (
  options: TextPluginOptions
): React.ComponentType<SlateEditorProps> => {
  return function SlateEditor(props: SlateEditorProps) {
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
    const [slatePlugins, setSlatePlugins] = React.useState<
      TextPlugin[] | undefined
    >(undefined)
    if (slatePlugins === undefined) {
      setSlatePlugins(
        options.plugins.map(slatePluginFactory =>
          slatePluginFactory(pluginClosure)
        )
      )
    }

    // PLEASE DONT FIX THIS! Closure needed because onPaste isn't recreated so doesnt use current props
    const slateClosure = React.useRef({
      plugins: plugins,
      insert: props.insert
    })
    slateClosure.current = { plugins: plugins, insert: props.insert }
    return (
      <Editor
        onPaste={createOnPaste(slateClosure)}
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
        plugins={slatePlugins}
        readOnly={!props.focused}
        value={rawState}
      />
    )
  }
}

// PLEASE DONT FIX THIS! Closure needed because onPaste isn't recreated so doesnt use props
function createOnPaste(
  slateClosure: React.RefObject<{
    plugins: Record<string, Plugin>
    insert: SlateEditorProps['insert']
  }>
): EventHook {
  return (e, editor, next): void => {
    if (!slateClosure.current) {
      next()
      return
    }
    const { plugins, insert } = slateClosure.current
    if (typeof insert === 'function') {
      const { clipboardData } = e as ClipboardEvent

      for (let key in plugins) {
        const { onPaste } = plugins[key]
        if (typeof onPaste === 'function') {
          const result = onPaste(clipboardData)
          if (result !== undefined) {
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

            const nextSlateState = {
              document: {
                nodes: [
                  ...afterSelected.map(block => block && block.toJSON()).toJS()
                ]
              }
            }
            setTimeout(() => {
              insert({ plugin: 'text', state: nextSlateState })
              insert({ plugin: key, state: result.state })
            })
            return
          }
        }
      }
    }

    next()
  }
}
