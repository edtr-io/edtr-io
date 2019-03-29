import { StatefulPluginEditorProps } from '@edtr-io/core'
import { ExpandableBox } from '@edtr-io/ui'
import * as React from 'react'

import { hintState } from '.'

export function HintEditor(props: StatefulPluginEditorProps<typeof hintState>) {
  return <ExpandableBox {...props} kind="Hinweis" />
}
