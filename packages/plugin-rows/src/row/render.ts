import {
  change,
  findNextNode,
  findPreviousNode,
  getFocusTree,
  PluginState,
  StateType
} from '@edtr-io/core'
import { rowsState, rowState } from '..'

export default function({
  row,
  rows,
  index,
  ...props
}: {
  row: StateType.StateDescriptorReturnType<typeof rowState>
  rows: StateType.StateDescriptorReturnType<typeof rowsState>
  index: number
  getDocument: (id: string) => PluginState | null
  getFocusTree: () => ReturnType<typeof getFocusTree>
  change: typeof change
}) {
  return row.render({
    insert: (options?: { plugin: string; state?: unknown }) =>
      rows.insert(index + 1, options),
    replace: (options?: { plugin: string; state?: unknown }) => {
      rows.remove(index)
      rows.insert(index, options)
    },
    remove: () => {
      rows.remove(index)
    },
    mergeWithPrevious: (merge: (statePrevious: unknown) => unknown) => {
      if (index - 1 < 0) return

      const current = props.getDocument(row.id)

      let previous = props.getDocument(rows()[index - 1].id)
      if (!previous || !current) return

      if (previous.plugin !== current.plugin) {
        // check if previous focus plugin is the same type
        const root = props.getFocusTree()
        if (!root) return

        const previousFocusId = findPreviousNode(root, row.id)
        if (!previousFocusId) return

        previous = props.getDocument(previousFocusId)
        if (!previous || previous.plugin !== current.plugin) return

        const merged = merge(previous.state)
        props.change({
          id: previousFocusId,
          state: () => ({ immediateState: merged })
        })
        rows.remove(index)
      } else {
        merge(previous.state)
        setTimeout(() => rows.remove(index - 1))
      }
    },
    mergeWithNext: (merge: (statePrevious: unknown) => unknown) => {
      if (index + 1 === rows().length) return
      const current = props.getDocument(row.id)
      let next = props.getDocument(rows()[index + 1].id)
      if (!next || !current) return
      if (next.plugin !== current.plugin) {
        // check if next focus plugin is the same type
        const root = props.getFocusTree()
        if (!root) return

        const nextFocusId = findNextNode(root, row.id)
        if (!nextFocusId) return

        // use that plugin for merge
        next = props.getDocument(nextFocusId)
        if (!next || next.plugin !== current.plugin) return
      }

      merge(next.state)
      setTimeout(() => {
        rows.remove(index + 1)
      })
    }
  })
}
