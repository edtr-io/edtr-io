import { StateExecutor, StateUpdater } from '@edtr-io/internal__plugin-state'
import {
  change,
  focus,
  focusNext,
  focusPrevious,
  getDocument,
  getPlugin,
  isDocumentEmpty,
  isFocused,
  redo,
  undo
} from '@edtr-io/store'
import { styled, useTheme } from '@edtr-io/ui'
import * as R from 'ramda'
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
  const [hasToolbar, setHasToolbar] = React.useState(false)
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
  const toolbarRef = React.useRef<HTMLDivElement>(
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
      !plugin.state.getFocusableChildren(document.state).length
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

  const renderIntoToolbar = React.useCallback(
    (children: React.ReactNode) => {
      setHasToolbar(true)
      if (!toolbarRef.current) return null
      return createPortal(children, toolbarRef.current)
    },
    [toolbarRef]
  )

  const theme = useTheme()

  return React.useMemo(() => {
    if (!document) return null
    if (!plugin) {
      // eslint-disable-next-line no-console
      console.log('Plugin does not exist')
      return null
    }

    const defaultConfig =
      typeof plugin.config === 'function' ? plugin.config(theme) : plugin.config
    const overrideConfig = (pluginProps && pluginProps.config) || {}
    const config = R.mergeDeepRight(defaultConfig, overrideConfig)

    const onChange = (
      initial: StateUpdater<unknown>,
      executor?: StateExecutor<StateUpdater<unknown>>
    ) => {
      dispatch(
        change({
          id,
          state: {
            initial,
            executor
          }
        })
      )
    }
    const state = plugin.state.init(document.state, onChange, {
      ...pluginProps,
      name: document.plugin
    })

    return (
      <HotKeys
        keyMap={{
          FOCUS_PREVIOUS: 'up',
          FOCUS_NEXT: 'down',
          INSERT_TEXT: 'enter',
          DELETE_EMPTY: ['backspace', 'del'],
          UNDO: ['ctrl+z', 'command+z'],
          REDO: ['ctrl+y', 'command+y', 'ctrl+shift+z', 'command+shift+z']
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
          },
          // TODO: remove me...
          UNDO: () => dispatch(undo()),
          REDO: () => dispatch(redo())
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
            hasToolbar={hasToolbar}
            focused={focused}
            renderSettings={pluginProps && pluginProps.renderSettings}
            renderToolbar={pluginProps && pluginProps.renderToolbar}
            settingsRef={settingsRef}
            toolbarRef={toolbarRef}
            PluginToolbar={PluginToolbar}
          >
            <plugin.Component
              {...pluginProps}
              renderIntoSettings={renderIntoSettings}
              renderIntoToolbar={renderIntoToolbar}
              id={id}
              editable
              focused={focused}
              name={document.plugin}
              config={config}
              state={state}
              defaultFocusRef={defaultFocusRef}
            />
          </DocumentEditor>
        </StyledDocument>
      </HotKeys>
    )
  }, [
    document,
    plugin,
    theme,
    pluginProps,
    handleFocus,
    hasSettings,
    hasToolbar,
    focused,
    PluginToolbar,
    renderIntoSettings,
    renderIntoToolbar,
    id,
    dispatch,
    handleKeyDown
  ])
}
