export { Document, DocumentProps } from './document'
export { Editor, EditorProps } from './editor'
export { EditorContext, EditorContextValue } from './editor-context'
export { useEditorFocus, useEditorHistory, useEditorMode } from './hooks'
export {
  Plugin,
  StatefulPluginEditorProps,
  StatelessPluginEditorProps,
  StatefulPlugin,
  StatelessPlugin
} from './plugin'
export { StateDescriptorReturnType } from './plugin-state'
import * as StateType from './plugin-state'
export { StateType }
export {
  ActionType,
  PluginState,
  ActionCommitType,
  serializeDocument,
  getClipboard,
  getDocument,
  getPlugins,
  hasPendingChanges,
  isEditable
} from './store'
export { OverlayContext, OverlayContextValue } from './overlay'
