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
import { actions, selectors, ScopedActionCreator } from '../store'
import { DocumentProps } from '.'

const StyledDocument = styled.div({
  outline: 'none'
})

export const DocumentEditor = connect<
  DocumentEditorStateProps,
  DocumentEditorDispatchProps,
  DocumentProps & { scope: string }
>(
  (state, { id }) => {
    const document = selectors.getDocument(state, id)
    return {
      empty: selectors.isEmpty(state, id),
      focused: selectors.isFocused(state, id),
      document,
      plugin: document && selectors.getPlugin(state, document.plugin)
    }
  },
  {
    focusPrevious: actions.focusPrevious,
    focusNext: actions.focusNext,
    focus: actions.focus,
    change: actions.change
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
    // TODO: focus changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              if (pluginProps) {
                insertNewText(pluginProps)
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

export function insertNewText(pluginProps: {
  insert?: (el: { plugin: string }) => void
}) {
  if (typeof pluginProps.insert === 'function') {
    pluginProps.insert({ plugin: 'text' })
  }
}

export interface DocumentEditorStateProps {
  document: ReturnType<typeof selectors['getDocument']>
  empty: ReturnType<typeof selectors['isEmpty']>
  focused: ReturnType<typeof selectors['isFocused']>
  plugin: ReturnType<typeof selectors['getPlugin']>
}

// Typescript somehow doesn't recognize an interface as Record<string, ..>
// eslint-disable-next-line @typescript-eslint/prefer-interface
export type DocumentEditorDispatchProps = {
  focusNext: ScopedActionCreator<typeof actions['focusNext']>
  focusPrevious: ScopedActionCreator<typeof actions['focusPrevious']>
  focus: ScopedActionCreator<typeof actions['focus']>
  change: ScopedActionCreator<typeof actions['change']>
}
