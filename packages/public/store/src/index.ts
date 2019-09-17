/**
 * @module @edtr-io/store
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
export { Action } from './actions'
export * from './clipboard'
export * from './documents'
export * from './focus'
export * from './history'
export * from './plugins'
export * from './root'
export { getScope } from './reducer'
export { createStore, ChangeListener, StoreEnhancerFactory } from './store'
export {
  DocumentState,
  ReturnTypeFromSelector,
  State,
  Store,
  ScopedState
} from './types'
