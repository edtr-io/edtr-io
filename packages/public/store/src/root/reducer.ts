import { serializeDocument } from '../documents/reducer'
import { createSelector, createSubReducer, SubReducer } from '../helpers'
import { SelectorReturnType, Selector } from '../types'
import { pureInitRoot, PureInitRootAction } from './actions'

/** @internal */
export const rootReducer: SubReducer<string | null> = createSubReducer(
  'root',
  null,
  {
    [pureInitRoot.type](_rootState, _action: PureInitRootAction) {
      return 'root'
    },
  }
)

/** @public */
export const getRoot: Selector<string | null> = createSelector(
  (state) => state.root
)
/** @public */
export const serializeRootDocument: Selector<{
  plugin: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: any
} | null> = createSelector(
  (state): SelectorReturnType<typeof serializeDocument> => {
    const root = getRoot()(state)
    if (!root) return null
    return serializeDocument(root)(state)
  }
)
