/**
 * @module @edtr-io/store
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
export { persist, reset, undo, redo } from './actions'
export {
  getPendingChanges,
  hasPendingChanges,
  getUndoStack,
  getRedoStack
} from './reducer'
