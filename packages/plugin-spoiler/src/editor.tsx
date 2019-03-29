import { StatefulPluginEditorProps } from '@edtr-io/core'
import { ExpandableBox } from '@edtr-io/ui'
import * as React from 'react'

import { spoilerState } from '.'

export function SpoilerEditor(
  props: StatefulPluginEditorProps<typeof spoilerState>
) {
  return <ExpandableBox {...props} kind="Spoiler" />
}
