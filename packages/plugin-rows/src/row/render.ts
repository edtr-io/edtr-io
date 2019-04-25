import { StateType, State, PluginState } from '@edtr-io/core'
import { rowState, rowsState } from '..'

export default function({
  row,
  rows,
  index,
  state,
  getDocument
}: {
  row: StateType.StateDescriptorReturnType<typeof rowState>
  rows: StateType.StateDescriptorReturnType<typeof rowsState>
  index: number
  state: State
  getDocument: (state: State, id: string) => PluginState | null
}) {
  return row.render({
    insert: (options?: { plugin: string; state?: unknown }) =>
      rows.insert(index + 1, options),
    mergeWithPrevious: (merge: (statePrevious: unknown) => unknown) => {
      if (index - 1 < 0) return
      const previous = getDocument(state, rows()[index - 1].id)
      const current = getDocument(state, row.id)
      if (!previous || !current || previous.plugin !== current.plugin) return
      merge(previous.state)
      setTimeout(() => rows.remove(index - 1))
    },
    mergeWithNext: (merge: (statePrevious: unknown) => unknown) => {
      if (index + 1 === rows().length) return
      const next = getDocument(state, rows()[index + 1].id)
      const current = getDocument(state, row.id)
      if (!next || !current || next.plugin !== current.plugin) return
      merge(next.state)
      setTimeout(() => {
        rows.remove(index + 1)
      })
    }
  })
}
