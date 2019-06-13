import { styled } from '@edtr-io/ui'
import * as React from 'react'
import { HotKeys } from 'react-hotkeys'

import { connect } from '../editor-context'
import {
  isStatefulPlugin,
  StatefulPluginEditorProps,
  StatelessPluginEditorProps
} from '../plugin'
import { StoreDeserializeHelpers } from '../plugin-state'
import { DocumentProps } from '.'
import { change, getDocument, isEmpty } from '../store/documents'
import { focus, focusNext, focusPrevious, isFocused } from '../store/focus'
import { getPlugin } from '../store/plugins'

const StyledDocument = styled.div({
  outline: 'none'
})

export const DocumentEditor = connect<
  DocumentEditorStateProps,
  DocumentEditorDispatchProps,
  DocumentProps
>(
  (state, { id }) => {
    const document = getDocument(state, id)
    return {
      empty: isEmpty(state, id),
      focused: isFocused(state, id),
      document,
      plugin: document && getPlugin(state, document.plugin)
    }
  },
  {
    focusPrevious,
    focusNext,
    focus,
    change
  }
)(function DocumentEditor({
  change,
  document,
  plugin,
  focus,
  focusNext,
  focusPrevious,
  empty,
  focused,
  id,
  pluginProps
}: DocumentProps & DocumentEditorStateProps & DocumentEditorDispatchProps) {
  const container = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (
      focused &&
      container.current &&
      plugin &&
      (!isStatefulPlugin(plugin) || !plugin.getFocusableChildren)
    ) {
      container.current.focus()
    }
  }, [focused, plugin])

  const handleFocus = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Find closest document
      const target = (e.target as HTMLDivElement).closest('[data-document]')

      if (!focused && target === container.current) {
        focus(id)
      }
    },
    [focus, focused, id]
  )

  const handleKeyDown = React.useCallback(
    (e: KeyboardEvent | undefined, next: () => void) => {
      if (
        e &&
        plugin &&
        isStatefulPlugin(plugin) &&
        typeof plugin.onKeyDown === 'function' &&
        !plugin.onKeyDown(e)
      ) {
        return
      }
      e && e.preventDefault()
      next()
    },
    [plugin]
  )

  return React.useMemo(() => {
    if (!document) return null

    if (!plugin) {
      // eslint-disable-next-line no-console
      console.log('Plugin does not exist')
      return null
    }
    let state: unknown
    if (isStatefulPlugin(plugin)) {
      const onChange = (
        updater: (value: unknown, helpers: StoreDeserializeHelpers) => void
      ) => {
        change({
          id,
          state: updater
        })
      }
      state = plugin.state(document.state, onChange, {
        ...pluginProps,
        name: document.plugin
      })
    }
    const Comp = plugin.Component as React.ComponentType<
      StatefulPluginEditorProps | StatelessPluginEditorProps
    >

    return (
      <HotKeys
        keyMap={{
          FOCUS_PREVIOUS: 'up',
          FOCUS_NEXT: 'down',
          INSERT_TEXT: 'enter',
          DELETE_EMPTY: ['backspace', 'del']
        }}
        handlers={{
          FOCUS_PREVIOUS: e => {
            handleKeyDown(e, () => {
              focusPrevious()
            })
          },
          FOCUS_NEXT: e => {
            handleKeyDown(e, () => {
              focusNext()
            })
          },
          INSERT_TEXT: e => {
            handleKeyDown(e, () => {
              if (pluginProps && typeof pluginProps.insert === 'function') {
                pluginProps.insert({ plugin: 'text' })
              }
            })
          },
          DELETE_EMPTY: e => {
            if (empty) {
              handleKeyDown(e, () => {
                if (!e) return

                if (pluginProps && typeof pluginProps.remove === 'function') {
                  if (e.key === 'Backspace') {
                    focusPrevious()
                  } else if (e.key === 'Delete') {
                    focusNext()
                  }
                  setTimeout(pluginProps.remove)
                }
              })
            }
          }
        }}
      >
        <StyledDocument
          onMouseDown={handleFocus}
          ref={container}
          data-document
          tabIndex={-1}
        >
          <Comp
            {...pluginProps}
            editable
            focused={focused}
            state={state}
            name={document.plugin}
          />
        </StyledDocument>
      </HotKeys>
    )
  }, [
    change,
    document,
    empty,
    focusNext,
    focusPrevious,
    focused,
    handleFocus,
    handleKeyDown,
    id,
    plugin,
    pluginProps
  ])
})

export interface DocumentEditorStateProps {
  document: ReturnType<typeof getDocument>
  empty: ReturnType<typeof isEmpty>
  focused: ReturnType<typeof isFocused>
  plugin: ReturnType<typeof getPlugin>
}

export interface DocumentEditorDispatchProps {
  focusNext: typeof focusNext
  focusPrevious: typeof focusPrevious
  focus: typeof focus
  change: typeof change
}
