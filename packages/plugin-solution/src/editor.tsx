import { StatefulPluginEditorProps } from '@edtr-io/core'
import { ExpandableBox } from '@edtr-io/ui'
import * as React from 'react'

import { solutionState } from '.'

export function SolutionEditor(
  props: StatefulPluginEditorProps<typeof solutionState>
) {
  return <ExpandableBox {...props} kind="Lösung" />
}
