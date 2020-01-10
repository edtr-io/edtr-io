/**
 * @module @edtr-io/store
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
export { insert, remove, change, ChangeAction } from './actions'

export {
  getDocument,
  serializeDocument,
  isDocumentEmpty,
  isEmpty
} from './reducer'
