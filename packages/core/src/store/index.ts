import { publicClipboardActions, publicClipboardSelectors } from './clipboard'
import { publicDocumentsActions, publicDocumentsSelectors } from './documents'
import { publicFocusActions, publicFocusSelectors } from './focus'
import { publicHistoryActions, publicHistorySelectors } from './history'
import { publicModeActions, publicModeSelectors } from './mode'
import { publicPluginsSelectors } from './plugins'
import { publicRootActions, publicRootSelectors } from './root'

export { Action } from './actions'
export { createStore } from './store'
export { DocumentState, EditorState, StoreState } from './types'

export const actions = {
  ...publicClipboardActions,
  ...publicDocumentsActions,
  ...publicFocusActions,
  ...publicHistoryActions,
  ...publicModeActions,
  ...publicRootActions
}

export const selectors = {
  ...publicClipboardSelectors,
  ...publicDocumentsSelectors,
  ...publicFocusSelectors,
  ...publicHistorySelectors,
  ...publicModeSelectors,
  ...publicPluginsSelectors,
  ...publicRootSelectors
}
