/**
 * @module @edtr-io/core
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
export { SubDocument } from './document'
export { Document, Editor, EditorProps, EditorProvider } from './editor'
export {
  ScopeContext,
  EditorContext,
  Provider,
  useDispatch,
  useSelector,
  useStore,
  useScopedDispatch,
  useScopedSelector,
  useScopedStore
} from './store'
export {
  PreferenceContext,
  setDefaultPreference,
  DocumentEditorContext
} from './contexts'
export * from './plugin-toolbar'
export { HotKeys, IgnoreKeys, GlobalHotKeys } from 'react-hotkeys'
