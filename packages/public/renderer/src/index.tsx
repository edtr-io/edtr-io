import { Provider, ScopeContext, SubDocument } from '@edtr-io/core'
import { invariant } from '@edtr-io/internal__dev-expression'
import { EditorPlugin, StoreDeserializeHelpers } from '@edtr-io/plugin'
import { Action, ScopedState, State } from '@edtr-io/store'
import { CustomTheme, RootThemeProvider } from '@edtr-io/ui'
import * as React from 'react'
import { createStore } from 'redux'

/**
 * @param props - The props
 * @public
 */
export function Renderer<K extends string = string>(props: RendererProps<K>) {
  const { theme = {}, ...rest } = props
  const store = React.useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return createStore<any, Action, unknown, unknown>(
      (state: State | undefined) => {
        if (!state) {
          return {
            main: {
              plugins: rest.plugins,
              documents: getDocuments(),
              focus: null,
              root: 'root',
              clipboard: [],
              history: {
                undoStack: [],
                redoStack: [],
                pendingChanges: 0,
              },
            },
          }
        }
        return state
      }
    )

    function getDocuments(): ScopedState['documents'] {
      const documents: ScopedState['documents'] = {}
      const pendingDocs: {
        id: string
        plugin: K
        state?: unknown
      }[] = [
        {
          id: 'root',
          ...(rest.state || {}),
        },
      ]
      const helpers: StoreDeserializeHelpers = {
        createDocument(doc: (typeof pendingDocs)[0]) {
          pendingDocs.push(doc)
        },
      }

      for (let doc; (doc = pendingDocs.pop()); ) {
        const plugin = rest.plugins[doc.plugin]
        if (!plugin) {
          invariant(false, `Invalid plugin '${doc.plugin}'`)
          continue
        }
        let state: unknown
        if (doc.state === undefined) {
          state = plugin.state.createInitialState(helpers)
        } else {
          state = plugin.state.deserialize(doc.state, helpers)
        }
        documents[doc.id] = {
          plugin: doc.plugin,
          state,
        }
      }
      return documents
    }
  }, [rest.state, rest.plugins])

  return (
    <Provider store={store}>
      <RootThemeProvider theme={theme}>
        <ScopeContext.Provider value={{ scope: 'main' }}>
          <SubDocument id="root" />
        </ScopeContext.Provider>
      </RootThemeProvider>
    </Provider>
  )
}

/** @public */
export interface RendererProps<K extends string = string> {
  plugins: Record<K, EditorPlugin>
  state: {
    plugin: K
    state?: unknown
  }
  theme?: CustomTheme
}
