import { Plugin } from '../plugin'

export type StoreState = Record<string, EditorState>

export interface EditorState {
  mode: {
    editable: boolean
  }
  plugins: {
    defaultPlugin: string
    plugins: Record<string, Plugin>
  }
  documents: Record<string, DocumentState>
  focus: string | null
  root: string | null
  clipboard: DocumentState[]
  history: HistoryState
}

export interface DocumentState {
  plugin: string
  state?: unknown
}

export interface HistoryState {
  initialState?: {
    documents: EditorState['documents']
  }
  undoStack: unknown[][]
  redoStack: unknown[][]
  pendingChanges: number
}
