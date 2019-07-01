import {
  StateType,
  actions,
  selectors,
  EditorStore,
  EditorState
} from '@edtr-io/core'
import * as React from 'react'

import { rowsState, rowState } from '..'
import { ActionFromCreator } from '@edtr-io/core/src/store/helpers'

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
  store: EditorStore['store']
  getDocument: (
    state: EditorState,
    id: string
  ) => { plugin: string; state?: unknown } | null
  renderIntoExtendedSettings: (children: React.ReactChild) => React.ReactNode
  PrimarySettingsWrapper: React.ComponentType
}) {
  const { dispatch } = store
  const state = store.getState()
  const pluginProps = React.useMemo(() => {
    return {
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
          const root = selectors.getFocusTree(state)
          if (!root) return

          const previousFocusId = selectors.findPreviousNode(root, row.id)
          if (!previousFocusId) return

          previous = getDocument(state, previousFocusId)
          if (!previous || previous.plugin !== current.plugin) return

          const merged = merge(previous.state)
          dispatch<
            typeof actions.change.type,
            ActionFromCreator<typeof actions.change>['payload']
          >(actions.change, {
            id: previousFocusId,
            state: () => merged
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
          const root = selectors.getFocusTree(state)
          if (!root) return

          const nextFocusId = selectors.findNextNode(root, row.id)
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
    }
  }, [
    PrimarySettingsWrapper,
    dispatch,
    getDocument,
    index,
    renderIntoExtendedSettings,
    row.id,
    rows,
    state
  ])

  return row.render(pluginProps)
}
