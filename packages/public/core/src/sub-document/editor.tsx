import { StateUpdater } from '@edtr-io/internal__plugin-state'
import {
  change,
  focus,
  focusNext,
  focusPrevious,
  getDocument,
  mayRemoveChild,
  getParent,
  getPlugin,
  insertChildAfter,
  isEmpty,
  isFocused,
  redo,
  removeChild,
  undo,
  ChangeAction,
} from '@edtr-io/store'
import { styled, useTheme } from '@edtr-io/ui'
import * as R from 'ramda'
import * as React from 'react'
import { createPortal } from 'react-dom'
import { HotKeys, IgnoreKeys } from 'react-hotkeys'

import { SubDocumentProps } from '.'
import { DocumentEditorContext, PluginToolbarContext } from '../contexts'
import { useScopedSelector, useScopedStore } from '../store'

const StyledDocument = styled.div({
  outline: 'none',
})

const hotKeysKeyMap = {
  FOCUS_PREVIOUS: 'up',
  FOCUS_NEXT: 'down',
  INSERT_DEFAULT_PLUGIN: 'enter',
  DELETE_EMPTY: ['backspace', 'del'],
  UNDO: ['ctrl+z', 'command+z'],
  REDO: ['ctrl+y', 'command+y', 'ctrl+shift+z', 'command+shift+z'],
}
type HotKeysHandlers = {
  [K in keyof typeof hotKeysKeyMap]: (keyEvent?: KeyboardEvent) => void
}

export function SubDocumentEditor({ id, pluginProps }: SubDocumentProps) {
  const [hasSettings, setHasSettings] = React.useState(false)
  const [hasToolbar, setHasToolbar] = React.useState(false)
  const document = useScopedSelector(getDocument(id))
  const focused = useScopedSelector(isFocused(id))
  const plugin = useScopedSelector(
    (state) => document && getPlugin(document.plugin)(state)
  )
  const store = useScopedStore()

  const container = React.useRef<HTMLDivElement>(null)
  const settingsRef = React.useRef<HTMLDivElement>(
    window.document.createElement('div')
  )
  const toolbarRef = React.useRef<HTMLDivElement>(
    window.document.createElement('div')
  )
  const DocumentEditor = React.useContext(DocumentEditorContext)
  const PluginToolbar = React.useContext(PluginToolbarContext)
  const autofocusRef = React.useRef<HTMLInputElement & HTMLTextAreaElement>(
    null
  )

  React.useEffect(() => {
    if (focused) {
      setTimeout(() => {
        if (autofocusRef.current) {
          autofocusRef.current.focus()
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

  const hotKeysHandlers = React.useMemo((): HotKeysHandlers => {
    return {
      FOCUS_PREVIOUS: (e) => {
        handleKeyDown(e, () => {
          store.dispatch(focusPrevious())
        })
      },
      FOCUS_NEXT: (e) => {
        handleKeyDown(e, () => {
          store.dispatch(focusNext())
        })
      },
      INSERT_DEFAULT_PLUGIN: (e) => {
        handleKeyDown(e, () => {
          const parent = getParent(id)(store.getState())
          if (!parent) return
          store.dispatch(
            insertChildAfter({
              parent: parent.id,
              sibling: id,
            })
          )
        })
      },
      DELETE_EMPTY: (e) => {
        if (isEmpty(id)(store.getState())) {
          handleKeyDown(e, () => {
            if (!e) return
            if (mayRemoveChild(id)(store.getState())) {
              const parent = getParent(id)(store.getState())
              if (!parent) return

              if (e.key === 'Backspace') {
                store.dispatch(focusPrevious())
              } else if (e.key === 'Delete') {
                store.dispatch(focusNext())
              }
              store.dispatch(removeChild({ parent: parent.id, child: id }))
            }
          })
        }
      },
      // TODO: workaround for https://github.com/edtr-io/edtr-io/issues/272
      UNDO: () => {
        store.dispatch(undo())
      },
      REDO: () => {
        store.dispatch(redo())
      },
    }

    function handleKeyDown(e: KeyboardEvent | undefined, next: () => void) {
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
    }
  }, [id, store, plugin])

  const handleFocus = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Find closest document
      const target = (e.target as HTMLDivElement).closest('[data-document]')

      if (!focused && target === container.current) {
        store.dispatch(focus(id))
      }
    },
    [store, focused, id]
  )

  const renderIntoSettings = React.useCallback(
    (children: React.ReactNode) => {
      return (
        <RenderIntoSettings
          setHasSettings={setHasSettings}
          settingsRef={settingsRef}
        >
          {children}
        </RenderIntoSettings>
      )
    },
    [settingsRef]
  )

  const renderIntoToolbar = React.useCallback(
    (children: React.ReactNode) => {
      return (
        <RenderIntoToolbar
          setHasToolbar={setHasToolbar}
          toolbarRef={toolbarRef}
        >
          {children}
        </RenderIntoToolbar>
      )
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
      additional: {
        executor?: ChangeAction['payload']['state']['executor']
        reverse?: ChangeAction['payload']['reverse']
      } = {}
    ) => {
      store.dispatch(
        change({
          id,
          state: {
            initial,
            executor: additional.executor,
          },
          reverse: additional.reverse,
        })
      )
    }
    const state = plugin.state.init(document.state, onChange)

    return (
      <HotKeys keyMap={hotKeysKeyMap} handlers={hotKeysHandlers} allowChanges>
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
              renderIntoSettings={renderIntoSettings}
              renderIntoToolbar={renderIntoToolbar}
              id={id}
              editable
              focused={focused}
              config={config}
              state={state}
              autofocusRef={autofocusRef}
            />
          </DocumentEditor>
        </StyledDocument>
      </HotKeys>
    )
  }, [
    DocumentEditor,
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
    hotKeysHandlers,
    store,
  ])
}

function RenderIntoSettings({
  children,
  setHasSettings,
  settingsRef,
}: {
  children: React.ReactNode
  setHasSettings: (value: boolean) => void
  settingsRef: React.MutableRefObject<HTMLDivElement>
}) {
  React.useEffect(() => {
    setHasSettings(true)
  })
  if (!settingsRef.current) return null
  return createPortal(<IgnoreKeys>{children}</IgnoreKeys>, settingsRef.current)
}

function RenderIntoToolbar({
  children,
  setHasToolbar,
  toolbarRef,
}: {
  children: React.ReactNode
  setHasToolbar: (value: boolean) => void
  toolbarRef: React.MutableRefObject<HTMLDivElement>
}) {
  React.useEffect(() => {
    setHasToolbar(true)
  })
  if (!toolbarRef.current) return null
  return createPortal(children, toolbarRef.current)
}
