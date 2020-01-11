import { StoreEnhancer } from 'redux'
import { composeWithDevTools } from 'remote-redux-devtools'

/**
 * {@link @edtr-io/store#StoreEnhancerFactory | Enhances the store} with {@link https://github.com/zalmoxisus/remote-redux-devtools | Remote Redux DevTools}
 *
 * @param defaultEnhancer - The previous {@link redux#StoreEnhancer}
 * @returns The {@link redux#StoreEnhancer} including Remote Redux DevTools
 *
 * @public
 */
export function createStoreDevtoolsEnhancer(
  defaultEnhancer: StoreEnhancer
): StoreEnhancer {
  const composeEnhancers = composeWithDevTools({ realtime: true })
  return composeEnhancers(defaultEnhancer)
}
