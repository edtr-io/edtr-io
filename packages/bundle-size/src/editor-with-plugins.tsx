import { Editor as Core, EditorProps } from '@edtr-io/core'
import * as React from 'react'

import { plugins } from './shared/plugins'

export function Editor(props: EditorProps) {
  return <Core {...props} plugins={plugins} />
}
