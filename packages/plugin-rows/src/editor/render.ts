import {
  ActionType,
  EditorContextValue,
  findNextNode,
  findPreviousNode,
  getFocusTree,
  PluginState,
  State,
  StateType
} from '@edtr-io/core'
import * as React from 'react'

import { rowsState, rowState } from '..'

export default function({
  row,
  rows,
  index,
  store,
  getDocument,
  renderIntoExtendedSettings,
  PrimarySettingsWrapper
}: {
  row: StateType.StateDescriptorReturnType<typeof rowState>
  rows: StateType.StateDescriptorReturnType<typeof rowsState>
  index: number
  store: EditorContextValue
  getDocument: (state: State, id: string) => PluginState | null
  renderIntoExtendedSettings: (children: React.ReactChild) => React.ReactNode
  PrimarySettingsWrapper: React.ComponentType
}) {
  const { state, dispatch } = store
  return row.render({
    renderIntoExtendedSettings,
    PrimarySettingsWrapper,
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

      const current = getDocument(state, row.id)

      let previous = getDocument(state, rows()[index - 1].id)
      if (!previous || !current) return

      if (previous.plugin !== current.plugin) {
        // check if previous focus plugin is the same type
        const root = getFocusTree(state)
        if (!root) return

        const previousFocusId = findPreviousNode(root, row.id)
        if (!previousFocusId) return

        previous = getDocument(state, previousFocusId)
        if (!previous || previous.plugin !== current.plugin) return

        const merged = merge(previous.state)
        dispatch({
          type: ActionType.Change,
          payload: {
            id: previousFocusId,
            state: () => merged
          },
          commit: undefined
        })
        rows.remove(index)
      } else {
        merge(previous.state)
        setTimeout(() => rows.remove(index - 1))
      }
    },
    mergeWithNext: (merge: (statePrevious: unknown) => unknown) => {
      if (index + 1 === rows().length) return
      const current = getDocument(state, row.id)
      let next = getDocument(state, rows()[index + 1].id)
      if (!next || !current) return
      if (next.plugin !== current.plugin) {
        // check if next focus plugin is the same type
        const root = getFocusTree(state)
        if (!root) return

        const nextFocusId = findNextNode(root, row.id)
        if (!nextFocusId) return

        // use that plugin for merge
        next = getDocument(state, nextFocusId)
        if (!next || next.plugin !== current.plugin) return
      }

      merge(next.state)
      setTimeout(() => {
        rows.remove(index + 1)
      })
    }
  })
}
