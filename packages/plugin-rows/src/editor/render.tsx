import { useScopedDispatch, useScopedStore } from '@edtr-io/core'
import { StateDescriptorReturnType } from '@edtr-io/plugin'
import {
  change,
  findNextNode,
  findPreviousNode,
  getDocument,
  getFocusTree
} from '@edtr-io/store'
import * as React from 'react'

import { rowsState, rowState } from '..'

export function RowRenderer({
  row,
  rows,
  index,
  renderIntoExtendedSettings,
  PrimarySettingsWrapper
}: {
  row: StateDescriptorReturnType<typeof rowState>
  rows: StateDescriptorReturnType<typeof rowsState>
  index: number
  renderIntoExtendedSettings: (children: React.ReactChild) => React.ReactNode
  PrimarySettingsWrapper: React.ComponentType
}) {
  const dispatch = useScopedDispatch()
  const store = useScopedStore()
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

        const current = getDocument(row.id)(store.getState())

        let previous = getDocument(rows()[index - 1].id)(store.getState())
        if (!previous || !current) return

        if (previous.plugin !== current.plugin) {
          // check if previous focus plugin is the same type
          const root = getFocusTree()(store.getState())
          if (!root) return

          const previousFocusId = findPreviousNode(root, row.id)
          if (!previousFocusId) return

          previous = getDocument(previousFocusId)(store.getState())
          if (!previous || previous.plugin !== current.plugin) return

          const merged = merge(previous.state)
          dispatch(
            change({
              id: previousFocusId,
              state: () => merged
            })
          )
          rows.remove(index)
        } else {
          merge(previous.state)
          setTimeout(() => rows.remove(index - 1))
        }
      },
      mergeWithNext: (merge: (statePrevious: unknown) => unknown) => {
        if (index + 1 === rows().length) return
        const current = getDocument(row.id)(store.getState())
        let next = getDocument(rows()[index + 1].id)(store.getState())
        if (!next || !current) return
        if (next.plugin !== current.plugin) {
          // check if next focus plugin is the same type
          const root = getFocusTree()(store.getState())
          if (!root) return

          const nextFocusId = findNextNode(root, row.id)
          if (!nextFocusId) return

          // use that plugin for merge
          next = getDocument(nextFocusId)(store.getState())
          if (!next || next.plugin !== current.plugin) return
        }

        merge(next.state)
        setTimeout(() => {
          rows.remove(index + 1)
        })
      }
    }
  }, [
    store,
    PrimarySettingsWrapper,
    dispatch,
    index,
    renderIntoExtendedSettings,
    row.id,
    rows
  ])

  return <React.Fragment>{row.render(pluginProps)}</React.Fragment>
}
