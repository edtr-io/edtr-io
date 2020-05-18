import { StoreEnhancerFactory } from '@edtr-io/store'
import { composeWithDevTools } from 'remote-redux-devtools'

/**
 * A {@link @edtr-io/store#StoreEnhancerFactory | StoreEnhacnerFactory} for
 * {@link https://github.com/zalmoxisus/remote-redux-devtools | Remote Redux DevTools}
 *
 * @param defaultEnhancer - The previous {@link redux#StoreEnhancer | StoreEnhancer}
 * @returns The {@link redux#StoreEnhancer | StoreEnhancer} including Remote Redux DevTools
 * @public
 */
export const createStoreDevtoolsEnhancer: StoreEnhancerFactory = (
  defaultEnhancer
) => {
  const composeEnhancers = composeWithDevTools({ realtime: true })
  return composeEnhancers(defaultEnhancer)
}
