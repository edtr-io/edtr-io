import { Provider, ScopeContext, SubDocument } from '@edtr-io/core'
import { EditorPlugin } from '@edtr-io/plugin'
import { initRoot, createStore, StoreEnhancerFactory } from '@edtr-io/store'
import { CustomTheme, RootThemeProvider } from '@edtr-io/ui'
import * as React from 'react'

/** @public */
export function Renderer<K extends string = string>({
  createStoreEnhancer = defaultEnhancer => defaultEnhancer,
  theme = {},
  ...props
}: RendererProps<K>) {
  const { store } = createStore<string>({
    instances: {
      main: {
        plugins: props.plugins,
        defaultPlugin: ''
      }
    },
    createEnhancer: createStoreEnhancer
  })

  store.dispatch(
    initRoot({
      initialState: props.state,
      plugins: props.plugins,
      defaultPlugin: ''
    })('main')
  )

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
  createStoreEnhancer?: StoreEnhancerFactory
}
