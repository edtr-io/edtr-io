import { StoreEnhancer } from 'redux'
import { composeWithDevTools } from 'remote-redux-devtools'

export function createStoreDevtoolsEnhancer(defaultEnhancer: StoreEnhancer) {
  const composeEnhancers = composeWithDevTools({ realtime: true })
  return composeEnhancers(defaultEnhancer)
}
