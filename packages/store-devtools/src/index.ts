import { applyMiddleware, StoreEnhancer } from 'redux'
import createImmutableStateInvariantMiddleware from 'redux-immutable-state-invariant'
import { composeWithDevTools } from 'remote-redux-devtools'

export function createStoreDevtoolsEnhancer(defaultEnhancer: StoreEnhancer) {
  const composeEnhancers = composeWithDevTools({ realtime: true })
  return composeEnhancers(
    defaultEnhancer,
    applyMiddleware(createImmutableStateInvariantMiddleware())
  )
}
