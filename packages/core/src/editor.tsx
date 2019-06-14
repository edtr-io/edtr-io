import { CustomTheme, RootThemeProvider } from '@edtr-io/ui'
import * as React from 'react'
import { DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { HotKeys } from 'react-hotkeys'

import { Document } from './document'
import { Provider, connect } from './editor-context'
import { OverlayContextProvider } from './overlay'
import { Plugin } from './plugin'
import { createStore, actions, selectors } from './store'

export function Editor<K extends string = string>(props: EditorProps<K>) {
  const store = React.useMemo(() => {
    return createStore({
      plugins: props.plugins,
      defaultPlugin: props.defaultPlugin
    }).store
    // We want to create the store only once
    // TODO: add effects that handle changes to plugins and defaultPlugin (by dispatching an action)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Provider store={store}>{renderChildren()}</Provider>

  function renderChildren() {
    const children = <InnerEditor {...props} />
    if (props.omitDragDropContext) return children
    return (
      <DragDropContextProvider backend={HTML5Backend}>
        {children}
      </DragDropContextProvider>
    )
  }
}

export const InnerEditor = connect<
  EditorStateProps,
  EditorDispatchProps,
  EditorProps
>(
  (state): EditorStateProps => {
    return {
      id: selectors.getRoot(state),
      hasPendingChanges: selectors.hasPendingChanges(state),
      pendingChanges: selectors.getPendingChanges(state)
    }
  },
  {
    initRoot: actions.initRoot,
    setEditable: actions.setEditable,
    undo: actions.undo,
    redo: actions.redo
  }
)(function InnerEditor<K extends string = string>({
  hasPendingChanges,
  id,
  initRoot,
  initialState,
  pendingChanges,
  setEditable,
  undo,
  redo,
  changed,
  children,
  editable = true,
  theme = {}
}: EditorProps<K> & EditorStateProps & EditorDispatchProps) {
  React.useEffect(() => {
    initRoot(initialState || {})
  }, [initRoot, initialState])

  React.useEffect(() => {
    setEditable(editable)
  }, [editable, setEditable])

  const pending = React.useRef(0)
  React.useEffect(() => {
    if (changed && pending.current !== pendingChanges) {
      pending.current = pendingChanges
      changed(hasPendingChanges)
    }
  }, [changed, hasPendingChanges, pendingChanges])

  if (!id) return null

  return (
    <HotKeys
      focused
      attach={document.body}
      keyMap={{
        UNDO: 'mod+z',
        REDO: ['mod+y', 'mod+shift+z']
      }}
      handlers={{
        UNDO: () => {
          undo()
        },
        REDO: () => {
          redo()
        }
      }}
    >
      <div style={{ position: 'relative' }}>
        <RootThemeProvider theme={theme}>
          <OverlayContextProvider>{renderChildren(id)}</OverlayContextProvider>
        </RootThemeProvider>
      </div>
    </HotKeys>
  )

  function renderChildren(id: string) {
    const document = <Document id={id} />

    if (typeof children === 'function') {
      return children(document)
    }

    return (
      <React.Fragment>
        {document}
        {children}
      </React.Fragment>
    )
  }
})

export interface EditorStateProps {
  id: ReturnType<typeof selectors['getRoot']>
  pendingChanges: ReturnType<typeof selectors['getPendingChanges']>
  hasPendingChanges: ReturnType<typeof selectors['hasPendingChanges']>
}
export interface EditorDispatchProps {
  initRoot: typeof actions['initRoot']
  setEditable: typeof actions['setEditable']
  undo: typeof actions['undo']
  redo: typeof actions['redo']
}

export interface EditorProps<K extends string = string> {
  omitDragDropContext?: boolean
  children?: React.ReactNode | ((document: React.ReactNode) => React.ReactNode)
  plugins: Record<K, Plugin>
  defaultPlugin: K
  initialState?: {
    plugin: string
    state?: unknown
  }
  theme?: CustomTheme
  changed?: (changed: boolean) => void
  editable?: boolean
}
