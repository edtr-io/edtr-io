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
}

export interface DocumentState {
  plugin: string
  state?: unknown
}
