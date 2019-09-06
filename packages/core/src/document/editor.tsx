import {
  isStatefulPlugin,
  StatefulPluginEditorProps,
  StatelessPluginEditorProps
} from '@edtr-io/abstract-plugin'
import { StoreDeserializeHelpers } from '@edtr-io/abstract-plugin-state'
import {
  change,
  focus,
  focusNext,
  focusPrevious,
  getDocument,
  getPlugin,
  isDocumentEmpty,
  isFocused
} from '@edtr-io/store'
import { styled } from '@edtr-io/ui'
import * as React from 'react'
import { HotKeys } from 'react-hotkeys'

import { DocumentProps } from '.'
import { useScopedSelector, useScopedDispatch } from '../store'

const StyledDocument = styled.div({
  outline: 'none'
})

export function DocumentEditor({ id, pluginProps }: DocumentProps) {
  const document = useScopedSelector(state => getDocument(state, id))
  const focused = useScopedSelector(state => isFocused(state, id))
  const plugin = useScopedSelector(
    state => document && getPlugin(state, document.plugin)
  )
  const dispatch = useScopedDispatch()

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
        dispatch(focus(id))
      }
    },
    [dispatch, focused, id]
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
        dispatch(
          change({
            id,
            state: updater
          })
        )
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
              dispatch(focusPrevious())
            })
          },
          FOCUS_NEXT: e => {
            handleKeyDown(e, () => {
              dispatch(focusNext())
            })
          },
          INSERT_TEXT: e => {
            handleKeyDown(e, () => {
              if (pluginProps) {
                if (typeof pluginProps.insert === 'function') {
                  pluginProps.insert({ plugin: 'text' })
                }
              }
            })
          },
          DELETE_EMPTY: e => {
            if (isDocumentEmpty(document, plugin)) {
              handleKeyDown(e, () => {
                if (!e) return

                if (pluginProps && typeof pluginProps.remove === 'function') {
                  if (e.key === 'Backspace') {
                    dispatch(focusPrevious())
                  } else if (e.key === 'Delete') {
                    dispatch(focusNext())
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
    dispatch,
    document,
    focused,
    handleFocus,
    handleKeyDown,
    id,
    plugin,
    pluginProps
  ])
}
