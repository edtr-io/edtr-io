import { CustomTheme, RootThemeProvider } from '@edtr-io/ui'
import * as React from 'react'
import { DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import { HotKeys } from 'react-hotkeys'

import { Document } from './document'
import { EditorContext } from './editor-context'
import {
  ActionType,
  hasPendingChanges,
  reducer,
  createInitialState,
  getRoot,
  pendingChanges
} from './store'
import { Plugin } from './plugin'
import { OverlayContextProvider } from './overlay'

export function Editor<K extends string = string>(props: EditorProps<K>) {
  const children = <InnerEditor {...props} />

  if (props.omitDragDropContext) return children

  return (
    <DragDropContextProvider backend={HTML5Backend}>
      {children}
    </DragDropContextProvider>
  )
}

const defaultTheme = {}
export function InnerEditor<K extends string = string>({
  plugins,
  defaultPlugin,
  initialState,
  changed,
  children,
  editable = true,
  theme = defaultTheme
}: EditorProps<K>) {
  const [state, dispatch] = React.useReducer(
    reducer,
    createInitialState(plugins, defaultPlugin, editable)
  )

  React.useEffect(() => {
    dispatch({
      type: ActionType.InitRoot,
      payload: initialState || {}
    })
  }, [dispatch, initialState])

  React.useEffect(() => {
    dispatch({
      type: ActionType.SwitchEditable,
      payload: editable
    })
  }, [editable])

  const id = getRoot(state)

  const pending = React.useRef(0)
  React.useEffect(() => {
    if (changed && pending.current !== pendingChanges(state)) {
      pending.current = pendingChanges(state)
      changed(hasPendingChanges(state))
    }
  }, [changed, state])

  // const ch = React.useMemo(() => {
  //   console.log('rendering inner editor children', id)
  //   if (!id) return null
  //   const document = <Document id={id} />
  //
  //   if (typeof children === 'function') {
  //     return children(document)
  //   }
  //
  //   return (
  //     <React.Fragment>
  //       {document}
  //       {children}
  //     </React.Fragment>
  //   )
  // }, [
  //   id
  //   // children: // TODO:
  // ])

  return (
      <div style={{ position: 'relative' }}>
        <EditorContext.Provider
          value={{
            state,
            dispatch
          }}
        >
          <RootThemeProvider theme={theme}>
            <OverlayContextProvider>
              {renderChildren(id)}
            </OverlayContextProvider>
          </RootThemeProvider>
        </EditorContext.Provider>
      </div>
  )

  function renderChildren(id: string) {
    console.log('foo')
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
