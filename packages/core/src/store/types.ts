import { Plugin } from '../plugin'

export interface State {
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
    documents: State['documents']
  }
  undoStack: unknown[][]
  redoStack: unknown[][]
  pendingChanges: number
}
