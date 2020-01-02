import { useScopedDispatch, useScopedSelector } from '@edtr-io/core'
import {
  focusNext as focusNextActionCreator,
  focusPrevious as focusPreviousActionCreator,
  getPlugins,
  ReturnTypeFromSelector
} from '@edtr-io/store'
import * as Immutable from 'immutable'
import isHotkey from 'is-hotkey'
import * as React from 'react'
import { Editor as CoreEditor, Value, ValueJSON, Operation, Node } from 'slate'
import { Editor, EventHook, getEventTransfer } from 'slate-react'

import { slateSchema, katexBlockNode, htmlToSlateValue } from '../model'
import { isValueEmpty, TextPlugin, TextProps, TextConfig } from '..'

export function TextEditor(props: SlateEditorProps) {
  const dispatch = useScopedDispatch()
  const focusNext = React.useCallback(() => {
    dispatch(focusNextActionCreator())
  }, [dispatch])
  const focusPrevious = React.useCallback(() => {
    dispatch(focusPreviousActionCreator())
  }, [dispatch])
  const plugins = useScopedSelector(getPlugins())
  const editor = React.useRef<CoreEditor>()
  const availablePlugins = props.config.registry

  const [rawState, setRawState] = React.useState(() => {
    // slate.js changed format with version 0.46
    // old format is still supported, but new states will be in new format
    return Value.fromJSON(props.state.value)
  })

  const thisState = React.useRef(props.state)
  const lastValue = React.useRef(props.state.value)

  React.useEffect(() => {
    thisState.current = props.state
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
  }, [lastValue, props.focused, props.state.value, props.state])

  // PLEASE DONT FIX THIS! Closure needed because on* isn't recreated so doesnt use current props
  const slateClosure = React.useRef<SlateClosure>({
    name: props.name,
    availablePlugins,
    plugins: plugins,
    insert: props.insert,
    replace: props.replace,
    remove: props.remove,
    parent: props.parent,
    focusPrevious: focusPrevious,
    focusNext: focusNext,
    mergeWithNext: props.mergeWithNext,
    mergeWithPrevious: props.mergeWithPrevious
  })
  slateClosure.current = {
    name: props.name,
    availablePlugins: availablePlugins,
    plugins: plugins,
    insert: props.insert,
    replace: props.replace,
    remove: props.remove,
    parent: props.parent,
    focusPrevious: focusPrevious,
    focusNext: focusNext,
    mergeWithNext: props.mergeWithNext,
    mergeWithPrevious: props.mergeWithPrevious
  }
  React.useEffect(() => {
    if (!editor.current) return
    if (props.focused) {
      setTimeout(() => {
        if (!editor.current) return
        editor.current.focus()
      })
    } else {
      editor.current.blur()
    }
  }, [props.focused])

  const pluginClosure = React.useRef({
    name: props.name,
    config: props.config,
    parent: props.parent,
    replace: props.replace,
    availablePlugins: availablePlugins,
    plugins: plugins
  })
  pluginClosure.current = {
    name: props.name,
    config: props.config,
    parent: props.parent,
    replace: props.replace,
    availablePlugins: availablePlugins,
    plugins: plugins
  }
  const slatePlugins = React.useRef<TextPlugin[]>()
  if (slatePlugins.current === undefined) {
    slatePlugins.current = [
      ...props.config.plugins.map(slatePluginFactory =>
        slatePluginFactory(pluginClosure)
      ),
      newSlateOnEnter(slateClosure),
      focusNextDocumentOnArrowDown(slateClosure)
    ]
  }

  const onPaste = React.useMemo(() => {
    return createOnPaste(slateClosure)
  }, [slateClosure])
  const onKeyDown = React.useMemo(() => {
    return createOnKeyDown(slateClosure)
  }, [slateClosure])
  const onClick = React.useCallback<EventHook>(
    (e, editor, next): CoreEditor | void => {
      if (e.target) {
        // @ts-ignore FIXME: outdated slatejs types
        const node = editor.findNode(e.target as Element)
        if (!node) {
          return editor
        }
      }
      next()
    },
    []
  )

  const onChange = React.useCallback(
    (change: { operations: Immutable.List<Operation>; value: Value }) => {
      const nextValue = change.value.toJSON()
      setRawState(change.value)
      const withoutSelections = change.operations.filter(
        operation =>
          typeof operation !== 'undefined' && operation.type !== 'set_selection'
      )
      if (!withoutSelections.isEmpty()) {
        lastValue.current = nextValue
        if (thisState.current) thisState.current.set(nextValue)
      }
    },
    [thisState]
  )

  return React.useMemo(
    () => (
      <Editor
        ref={slate => {
          const slateReact = (slate as unknown) as CoreEditor | null
          if (slateReact && !editor.current) {
            editor.current = slateReact
          }
        }}
        onPaste={onPaste}
        onKeyDown={onKeyDown}
        onClick={onClick}
        onChange={onChange}
        placeholder={props.editable ? props.config.placeholder : ''}
        plugins={slatePlugins.current}
        readOnly={!props.focused}
        value={rawState}
        schema={slateSchema}
      />
    ),
    [
      onPaste,
      onKeyDown,
      onClick,
      onChange,
      props.editable,
      props.config.placeholder,
      props.focused,
      rawState
    ]
  )
}

// PLEASE DONT FIX THIS! Closure needed because onPaste isn't recreated so doesnt use props
function createOnPaste(slateClosure: React.RefObject<SlateClosure>): EventHook {
  return (e, editor, next): void => {
    if (!slateClosure.current) {
      next()
      return
    }

    const { plugins, name, insert, replace } = slateClosure.current
    if (typeof insert !== 'function') {
      next()
      return
    }

    const { clipboardData } = e as ClipboardEvent

    for (const key in plugins) {
      const { onPaste } = plugins[key]
      if (clipboardData && typeof onPaste === 'function') {
        const result = onPaste(clipboardData)
        if (result !== undefined) {
          if (typeof replace === 'function' && isValueEmpty(editor.value)) {
            // replace with pasted plugin
            setTimeout(() => {
              replace({ plugin: key, state: result.state })
            })
          } else {
            const nextSlateState = splitBlockAtSelection(editor)

            setTimeout(() => {
              // insert new text-plugin with the parts after the current cursor position if any
              if (nextSlateState) {
                insert({ plugin: name, state: nextSlateState })
              }
              // insert the plugin that handled the pasted data.
              // It's inserted at the same index, so will be between the text plugins
              insert({ plugin: key, state: result.state })
            })
          }
          return
        }
      }
    }

    const transfer = getEventTransfer(e)
    if (transfer.type === 'html') {
      // @ts-ignore: outdated slate types
      const html = transfer.html as string
      const { document } = htmlToSlateValue(html)
      editor.insertFragment(document)
      e.preventDefault()
      return
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

    if (
      (key === 'Backspace' && isSelectionAtStart(editor)) ||
      (key === 'Delete' && isSelectionAtEnd(editor))
    ) {
      if (!slateClosure.current) return
      const previous = key === 'Backspace'

      if (isValueEmpty(editor.value)) {
        // Focus previous resp. next document and remove self
        const { remove } = slateClosure.current
        const focus =
          slateClosure.current[previous ? 'focusPrevious' : 'focusNext']
        if (typeof remove === 'function') {
          if (typeof focus === 'function') focus()
          remove()
        }
      } else {
        // Merge with previous resp. next document
        const merge =
          slateClosure.current[previous ? 'mergeWithPrevious' : 'mergeWithNext']
        if (typeof merge !== 'function') return
        merge(other => {
          const value = Value.fromJSON(other)
          const insertionIndex = previous ? 0 : editor.value.document.nodes.size
          // lower level command to merge two documents
          editor.insertFragmentByKey(
            editor.value.document.key,
            insertionIndex,
            value.document
          )
          return editor.value.toJSON()
        })
      }

      return
    }

    return next()
  }
}

function isSelectionAtStart(editor: CoreEditor) {
  const { selection } = editor.value
  const startNode = editor.value.document.getFirstText()
  return (
    selection.isCollapsed &&
    startNode &&
    editor.value.startText.key === startNode.key &&
    selection.start.offset === 0
  )
}

function isSelectionAtEnd(editor: CoreEditor) {
  const { selection } = editor.value
  const endNode = editor.value.document.getLastText()
  return (
    selection.isCollapsed &&
    endNode &&
    editor.value.endText.key === endNode.key &&
    selection.end.offset === editor.value.endText.text.length
  )
}

function newSlateOnEnter(
  slateClosure: React.RefObject<SlateClosure>
): TextPlugin {
  return {
    commands: {
      replaceWithPlugin(
        editor: CoreEditor,
        options?: { plugin: string; state: unknown }
      ) {
        if (!slateClosure.current) return editor
        const { replace } = slateClosure.current
        if (typeof replace !== 'function') return editor
        replace(options)
        return editor
      },
      unwrapParent(editor: CoreEditor) {
        if (!slateClosure.current) return editor
        const parentWithReplace = findParentWith(
          'replace',
          slateClosure.current
        )
        if (
          parentWithReplace &&
          typeof parentWithReplace.replace === 'function'
        ) {
          parentWithReplace.replace({
            plugin: slateClosure.current.name,
            state: editor.value.toJSON()
          })
        }
        return editor
      }
    },
    onKeyDown(e, editor, next) {
      if (
        isHotkey('enter', e as KeyboardEvent) &&
        !editor.value.selection.isExpanded
      ) {
        // remove text plugin and insert on parent if plugin is empty
        if (isValueEmpty(editor.value) && slateClosure.current) {
          const parentWithInsert = findParentWith(
            'insert',
            slateClosure.current
          )
          if (parentWithInsert) {
            e.preventDefault()
            setTimeout(() => {
              if (!slateClosure.current) return next()
              const { remove } = slateClosure.current
              if (
                typeof remove === 'function' &&
                typeof parentWithInsert.insert === 'function'
              ) {
                parentWithInsert.insert({ plugin: slateClosure.current.name })
                remove()
              }
            })
            return
          }
        }
        // remove block and insert plugin on parent, if block is empty
        if (
          editor.value.startText.text === '' &&
          editor.value.startBlock.nodes.size === 1 &&
          slateClosure.current
        ) {
          const parentWithInsert = findParentWith(
            'insert',
            slateClosure.current
          )
          if (parentWithInsert) {
            e.preventDefault()
            if (!slateClosure.current) return next()
            if (typeof parentWithInsert.insert === 'function') {
              editor.delete()
              parentWithInsert.insert({ plugin: slateClosure.current.name })
            }
            return
          }
        }

        if (
          slateClosure.current &&
          typeof slateClosure.current.insert === 'function'
        ) {
          e.preventDefault()
          const nextSlateState = splitBlockAtSelection(editor)

          setTimeout(() => {
            if (!slateClosure.current) return next()
            const { insert } = slateClosure.current
            if (typeof insert !== 'function') return
            insert({ plugin: slateClosure.current.name, state: nextSlateState })
          })
          return
        }
      }
      return next()
    }
  }
}

function focusNextDocumentOnArrowDown(
  slateClosure: React.RefObject<SlateClosure>
): TextPlugin {
  return {
    onKeyDown(e, editor, next) {
      const { key } = (e as unknown) as React.KeyboardEvent
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

      return next()

      function getRange(): Range | null {
        const selection = window.getSelection()

        if (selection && selection.rangeCount > 0) {
          return selection.getRangeAt(0)
        }

        return null
      }
    }
  }
}

// search recursively for a parent with the required function
function findParentWith(
  funcQuery: 'insert' | 'replace',
  closure: SlateEditorAdditionalProps
): SlateEditorAdditionalProps | undefined {
  if (!closure.parent) return

  if (typeof closure.parent[funcQuery] === 'function') return closure.parent

  return findParentWith(funcQuery, closure.parent)
}

function splitBlockAtSelection(editor: CoreEditor) {
  if (isSelectionAtEnd(editor)) {
    return
  }
  if (editor.value.focusBlock.type == katexBlockNode) {
    // If katex block node is focused, don't attempt to split it, insert empty paragraph instead
    editor.moveToEndOfBlock()
    editor.insertBlock('paragraph')
  } else {
    editor.splitBlock(1)
  }
  const blocks = editor.value.document.nodes

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

  return createDocumentFromNodes(afterSelected.toArray())
}

function createDocumentFromNodes(nodes: Node[]) {
  return {
    document: {
      nodes: [...nodes.map(node => node.toJSON())]
    }
  }
}

export type SlateEditorProps = TextProps & SlateEditorAdditionalProps

export interface SlateEditorAdditionalProps {
  name: string
  insert?: (options?: { plugin: string; state?: unknown }) => void
  replace?: (options?: { plugin: string; state?: unknown }) => void
  remove?: () => void
  parent?: SlateEditorAdditionalProps
  mergeWithNext?: (merge: (next: ValueJSON) => void) => void
  mergeWithPrevious?: (merge: (previous: ValueJSON) => void) => void
}

interface SlateClosure extends SlateEditorAdditionalProps {
  focusPrevious: () => void
  focusNext: () => void
  availablePlugins: TextConfig['registry']
  plugins: ReturnTypeFromSelector<typeof getPlugins>
}
