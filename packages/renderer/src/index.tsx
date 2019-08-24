import {
  Provider,
  ScopeContext,
  Plugin,
  actions,
  createStore,
  SubDocument
} from '@edtr-io/core'
import { CustomTheme, RootThemeProvider } from '@edtr-io/ui'
import * as React from 'react'
import { StoreEnhancer } from 'redux'

export function Renderer<K extends string = string>({
  createStoreEnhancer = defaultEnhancer => defaultEnhancer,
  theme = {},
  ...props
}: RendererProps<K>) {
  const { store } = createStore<string, unknown, unknown>({
    instances: {
      main: {
        plugins: props.plugins,
        defaultPlugin: ''
      }
    },
    createEnhancer: createStoreEnhancer
  })

  store.dispatch(
    actions.initRoot({
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

export interface RendererProps<K extends string = string> {
  plugins: Record<K, Plugin>
  state: {
    plugin: K
    state?: unknown
  }
  theme?: CustomTheme
  createStoreEnhancer?: (
    defaultEnhancer: StoreEnhancer
  ) => StoreEnhancer<unknown, unknown>
}
