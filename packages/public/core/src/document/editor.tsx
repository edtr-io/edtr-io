/**
 * @module @edtr-io/core
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import {
  isStatefulPlugin,
  Plugin,
  StatefulPluginEditorProps,
  StatelessPluginEditorProps
} from '@edtr-io/internal__plugin'
import {
  StateType, StateUpdater,
  StoreDeserializeHelpers
} from '@edtr-io/internal__plugin-state'
import {
  change,
  DocumentState,
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
import { createPortal } from 'react-dom'
import { HotKeys, IgnoreKeys } from 'react-hotkeys'

import { DocumentProps } from '.'
import { DocumentEditorContext, PluginToolbarContext } from '../contexts'
import { useScopedDispatch, useScopedSelector } from '../store'

const StyledDocument = styled.div({
  outline: 'none'
})

export function DocumentEditor({ id, pluginProps }: DocumentProps) {
  const [hasSettings, setHasSettings] = React.useState(false)
  const document = useScopedSelector(getDocument(id))
  const focused = useScopedSelector(isFocused(id))
  const plugin = useScopedSelector(
    state => document && getPlugin(document.plugin)(state)
  )
  const dispatch = useScopedDispatch()

  const container = React.useRef<HTMLDivElement>(null)
  const settingsRef = React.useRef<HTMLDivElement>(
    window.document.createElement('div')
  )
  const DocumentEditor = React.useContext(DocumentEditorContext)
  const PluginToolbar = React.useContext(PluginToolbarContext)
  const defaultFocusRef = React.useRef<HTMLInputElement & HTMLTextAreaElement>(
    null
  )

  React.useEffect(() => {
    if (focused) {
      setTimeout(() => {
        if (defaultFocusRef.current) {
          defaultFocusRef.current.focus()
        }
      })
    }
  }, [focused])

  React.useEffect(() => {
    if (
      focused &&
      container.current &&
      document &&
      plugin &&
      (!isStatefulPlugin(plugin) ||
        !plugin.state.getFocusableChildren(document.state).length)
    ) {
      container.current.focus()
    }
    // `document` should not be part of the dependencies because we only want to call this once when the document gets focused
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const renderIntoSettings = React.useCallback(
    (children: React.ReactNode) => {
      setHasSettings(true)
      if (!settingsRef.current) return null
      return createPortal(
        <IgnoreKeys>{children}</IgnoreKeys>,
        settingsRef.current
      )
    },
    [settingsRef]
  )

  return React.useMemo(() => {
    if (!document) return null
    if (!plugin) {
      // eslint-disable-next-line no-console
      console.log('Plugin does not exist')
      return null
    }

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
        allowChanges
      >
        <StyledDocument
          onMouseDown={handleFocus}
          ref={container}
          data-document
          tabIndex={-1}
        >
          <DocumentEditor
            hasSettings={hasSettings}
            focused={focused}
            renderSettings={pluginProps && pluginProps.renderSettings}
            renderToolbar={pluginProps && pluginProps.renderToolbar}
            settingsRef={settingsRef}
            PluginToolbar={PluginToolbar}
          >
            <plugin.Component
              renderIntoSettings={renderIntoSettings}
              {...getPluginEditorProps({
                id,
                document,
                dispatch,
                focused,
                plugin,
                pluginProps
              })}
              defaultFocusRef={defaultFocusRef}
            />
          </DocumentEditor>
        </StyledDocument>
      </HotKeys>
    )
  }, [
    document,
    plugin,
    handleFocus,
    hasSettings,
    focused,
    pluginProps,
    PluginToolbar,
    renderIntoSettings,
    id,
    dispatch,
    handleKeyDown
  ])
}

function getPluginEditorProps<S extends StateType>({
  id,
  document,
  focused,
  plugin,
  dispatch,
  pluginProps
}: {
  id: string
  document: DocumentState
  focused: boolean
  plugin: Plugin
  dispatch: ReturnType<typeof useScopedDispatch>
  pluginProps: DocumentProps['pluginProps']
}):
  | Omit<StatefulPluginEditorProps, 'defaultFocusRef' | 'renderIntoSettings'>
  | Omit<StatelessPluginEditorProps, 'defaultFocusRef' | 'renderIntoSettings'> {
  if (isStatefulPlugin(plugin)) {
    const onChange = (
      updater: StateUpdater<unknown>,
    ) => {
      dispatch(
        change({
          id,
          state: updater
        })
      )
    }
    const state = plugin.state.init(document.state, onChange, {
      ...pluginProps,
      name: document.plugin
    })
    return {
      ...pluginProps,
      id,
      editable: true,
      focused,
      name: document.plugin,
      state
    }
  }

  return {
    ...pluginProps,
    id,
    editable: true,
    focused,
    name: document.plugin
  }
}
