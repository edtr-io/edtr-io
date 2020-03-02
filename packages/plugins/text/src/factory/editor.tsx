import { useScopedStore } from '@edtr-io/core'
import {
  change,
  findNextNode,
  findPreviousNode,
  focusNext,
  focusPrevious,
  getDocument,
  getFocusTree,
  getParent,
  getPlugins,
  insertChildAfter,
  mayInsertChild,
  mayRemoveChild,
  removeChild,
  replace,
  getFocusPath,
  getPlugin
} from '@edtr-io/store'
import * as Immutable from 'immutable'
import isHotkey from 'is-hotkey'
import * as R from 'ramda'
import * as React from 'react'
import { Editor as CoreEditor, Node, Operation, Value, ValueJSON } from 'slate'
import { Editor, EventHook, getEventTransfer } from 'slate-react'

import { isValueEmpty, serializer, TextPlugin, TextProps } from '..'
import { I18nContext } from '../i18n-context'
import { htmlToSlateValue, katexBlockNode, slateSchema } from '../model'
import { SlateClosure } from './types'

export function TextEditor(props: TextProps) {
  const store = useScopedStore()
  const editor = React.useRef<CoreEditor>()

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
      // Refocus Slate after state change if needed
      setTimeout(() => {
        if (!editor.current) return
        if (props.focused) {
          editor.current.focus()
        }
      })
    }
  }, [lastValue, props.focused, props.state.value, props.state])

  // Sync Slate focus with Edtr.io focus
  React.useEffect(() => {
    if (!editor.current) return
    if (props.focused) {
      editor.current.focus()
    } else {
      editor.current.blur()
    }
  }, [props.focused])

  // This ref makes sure that slate hooks and plugins have access to the latest values
  const slateClosure = React.useRef<SlateClosure>({
    id: props.id,
    config: props.config,
    store
  })
  slateClosure.current = {
    store,
    config: props.config,
    id: props.id
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

  const slatePlugins = React.useRef<TextPlugin[]>()
  if (slatePlugins.current === undefined) {
    slatePlugins.current = [
      ...props.config.plugins.map(slatePluginFactory =>
        slatePluginFactory(slateClosure)
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
  const onClick = React.useCallback<EventHook<React.MouseEvent>>(
    (e, editor, next): Editor | void => {
      if (e.target) {
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
      <I18nContext.Provider value={props.config.i18n}>
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
      </I18nContext.Provider>
    ),
    [
      onPaste,
      onKeyDown,
      onClick,
      onChange,
      props.editable,
      props.config.i18n,
      props.config.placeholder,
      props.focused,
      rawState
    ]
  )
}

function createOnPaste(
  slateClosure: React.RefObject<SlateClosure>
): EventHook<React.ClipboardEvent> {
  return (e, editor, next): void => {
    if (!slateClosure.current) {
      next()
      return
    }

    const { id, store } = slateClosure.current
    const document = getDocument(id)(store.getState())
    if (!document) {
      next()
      return
    }
    const name = document.plugin
    const plugins = getPlugins()(store.getState())
    const mayInsert = mayInsertChild(id)(store.getState())
    if (!mayInsert) {
      next()
      return
    }

    const { clipboardData } = e

    const files = getFilesFromDataTransfer(clipboardData)
    const text = clipboardData.getData('text')

    if (files && files.length > 0) {
      for (const key in plugins) {
        const { onFiles } = plugins[key]
        if (typeof onFiles === 'function') {
          const result = onFiles(files)
          if (result !== undefined) {
            handleResult(key, result)
            return
          }
        }
      }
    }

    if (text) {
      for (const key in plugins) {
        const { onText } = plugins[key]
        if (typeof onText === 'function') {
          const result = onText(text)
          if (result !== undefined) {
            handleResult(key, result)
            return
          }
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

    function getFilesFromDataTransfer(clipboardData: DataTransfer) {
      const items = clipboardData.files
      const files: File[] = []
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (!item) continue
        files.push(item)
      }
      return files
    }

    function handleResult(key: string, result: { state?: unknown }) {
      if (mayRemoveChild(id)(store.getState()) && isValueEmpty(editor.value)) {
        store.dispatch(
          replace({
            id,
            plugin: key,
            state: result.state
          })
        )
      } else {
        const nextSlateState = splitBlockAtSelection(editor)
        const parent = getParent(id)(store.getState())
        if (!parent) return

        setTimeout(() => {
          // insert new text-plugin with the parts after the current cursor position if any
          if (nextSlateState) {
            store.dispatch(
              insertChildAfter({
                parent: parent.id,
                sibling: id,
                document: {
                  plugin: name,
                  state: serializer.serialize(nextSlateState)
                }
              })
            )
          }
          store.dispatch(
            insertChildAfter({
              parent: parent.id,
              sibling: id,
              document: {
                plugin: key,
                state: result.state
              }
            })
          )
        })
      }
    }
  }
}

function createOnKeyDown(
  slateClosure: React.RefObject<SlateClosure>
): EventHook<React.KeyboardEvent> {
  return (e, editor, next): void => {
    const { key } = e
    const event = (e as unknown) as KeyboardEvent

    if (
      isHotkey('mod+z', event) ||
      isHotkey('mod+y', event) ||
      isHotkey('mod+shift+z', event)
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
        const { id, store } = slateClosure.current
        const mayRemove = mayRemoveChild(id)(store.getState())
        const focus = previous ? focusPrevious : focusNext
        if (mayRemove) {
          const parent = getParent(id)(store.getState())
          if (!parent) return
          store.dispatch(focus())
          store.dispatch(removeChild({ parent: parent.id, child: id }))
        }
      } else {
        const { id, store } = slateClosure.current
        const mayRemove = mayRemoveChild(id)(store.getState())
        const mayInsert = mayInsertChild(id)(store.getState())

        if (!mayRemove || !mayInsert) return

        const parent = getParent(id)(store.getState())
        if (!parent) return

        const children = parent.children || []
        const index = R.findIndex(child => child.id === id, children)
        if (index === -1) return

        const currentDocument = getDocument(id)(store.getState())
        if (!currentDocument) return

        if (previous) {
          if (index - 1 < 0) return
          const previousSibling = children[index - 1]
          let previousDocument = getDocument(previousSibling.id)(
            store.getState()
          )
          if (!previousDocument) return
          if (previousDocument.plugin === currentDocument.plugin) {
            merge(previousDocument.state, previous)
            setTimeout(() => {
              store.dispatch(
                removeChild({ parent: parent.id, child: previousSibling.id })
              )
            })
          } else {
            const root = getFocusTree()(store.getState())
            if (!root) return
            const previousFocusId = findPreviousNode(root, id)
            if (!previousFocusId) return
            previousDocument = getDocument(previousFocusId)(store.getState())
            if (
              !previousDocument ||
              previousDocument.plugin !== currentDocument.plugin
            )
              return
            const merged = merge(previousDocument.state, previous)
            store.dispatch(focusPrevious())
            store.dispatch(
              change({
                id: previousFocusId,
                state: { initial: () => merged }
              })
            )
            store.dispatch(
              removeChild({
                parent: parent.id,
                child: id
              })
            )
          }
        } else {
          if (index + 1 >= children.length) return
          const nextSibling = children[index + 1]
          let nextDocument = getDocument(nextSibling.id)(store.getState())
          if (!nextDocument) return
          if (nextDocument.plugin === currentDocument.plugin) {
            merge(nextDocument.state, previous)
            setTimeout(() => {
              store.dispatch(
                removeChild({ parent: parent.id, child: nextSibling.id })
              )
            })
          } else {
            const root = getFocusTree()(store.getState())
            if (!root) return
            const nextFocusId = findNextNode(root, id)
            if (!nextFocusId) return
            nextDocument = getDocument(nextFocusId)(store.getState())
            if (!nextDocument || nextDocument.plugin !== currentDocument.plugin)
              return
            merge(nextDocument.state, previous)
            store.dispatch(
              removeChild({ parent: parent.id, child: nextSibling.id })
            )
          }
        }
      }

      return
    }

    return next()

    function merge(other: unknown, previous: boolean) {
      const value = Value.fromJSON(other as ValueJSON)
      const insertionIndex = previous ? 0 : editor.value.document.nodes.size
      // lower level command to merge two documents
      editor.insertFragmentByKey(
        editor.value.document.key,
        insertionIndex,
        value.document
      )
      return editor.value.toJSON()
    }
  }
}

function isSelectionAtStart(editor: Editor) {
  const { selection } = editor.value
  const startNode = editor.value.document.getFirstText()
  return (
    selection.isCollapsed &&
    startNode &&
    editor.value.startText.key === startNode.key &&
    selection.start.offset === 0
  )
}

function isSelectionAtEnd(editor: Editor) {
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
    onKeyDown(e, editor, next) {
      if (
        isHotkey('enter', (e as unknown) as KeyboardEvent) &&
        !editor.value.selection.isExpanded
      ) {
        // remove text plugin and insert on parent if plugin is empty
        if (isValueEmpty(editor.value)) {
          if (!slateClosure.current) return
          const { id, store } = slateClosure.current
          const mayRemove = mayRemoveChild(id)(store.getState())
          if (!mayRemove) return
          const result = findParentWith('insertChild', slateClosure)
          if (result) {
            e.preventDefault()
            const document = getDocument(id)(store.getState())
            if (!document) return
            const directParent = getParent(id)(store.getState())
            if (!directParent) return
            store.dispatch(
              insertChildAfter({
                parent: result.parent,
                sibling: result.sibling,
                document: {
                  plugin: document.plugin
                }
              })
            )
            store.dispatch(
              removeChild({
                parent: directParent.id,
                child: id
              })
            )
            return
          }
        }
        // remove block and insert plugin on parent, if block is empty
        if (
          editor.value.startText.text === '' &&
          editor.value.startBlock.nodes.size === 1
        ) {
          if (!slateClosure.current) return
          const { id, store } = slateClosure.current
          const result = findParentWith('insertChild', slateClosure)
          if (result) {
            e.preventDefault()
            const document = getDocument(id)(store.getState())
            if (!document) return
            editor.delete()
            store.dispatch(
              insertChildAfter({
                parent: result.parent,
                sibling: result.sibling,
                document: {
                  plugin: document.plugin
                }
              })
            )
            return
          }
        }

        if (!slateClosure.current) return
        const { id, store } = slateClosure.current
        const mayInsert = mayInsertChild(id)(store.getState())

        if (mayInsert) {
          e.preventDefault()
          const document = getDocument(id)(store.getState())
          if (!document) return
          const parent = getParent(id)(store.getState())
          if (!parent) return
          const nextSlateState = splitBlockAtSelection(editor)
          setTimeout(() => {
            if (nextSlateState) {
              store.dispatch(
                insertChildAfter({
                  parent: parent.id,
                  sibling: id,
                  document: {
                    plugin: document.plugin,
                    state: serializer.serialize(nextSlateState)
                  }
                })
              )
            } else {
              store.dispatch(
                insertChildAfter({
                  parent: parent.id,
                  sibling: id,
                  document: {
                    plugin: document.plugin
                  }
                })
              )
            }
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
            const currentRange = getRange()
            if (!currentRange) return
            const currentY = currentRange.getBoundingClientRect().top
            if (lastY === currentY) {
              if (!slateClosure.current) return
              const { store } = slateClosure.current
              const focus = key === 'ArrowDown' ? focusNext : focusPrevious
              store.dispatch(focus())
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

function findParentWith(
  funcQuery: 'insertChild' | 'removeChild',
  closure: React.RefObject<SlateClosure>
): { parent: string; sibling: string } | null {
  if (!closure.current) return null
  const { id, store } = closure.current
  const focusPath = getFocusPath(id)(store.getState())
  if (!focusPath || focusPath.length <= 2) return null
  const parents = R.init(R.init(focusPath))
  const index = R.findLastIndex(parent => {
    const parentDocument = getDocument(parent)(store.getState())
    if (!parentDocument) return false
    const plugin = getPlugin(parentDocument.plugin)(store.getState())
    if (!plugin) return false
    return typeof plugin[funcQuery] === 'function'
  }, parents)
  if (index === -1) return null
  return { parent: focusPath[index], sibling: focusPath[index + 1] }
}

function splitBlockAtSelection(editor: Editor) {
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
