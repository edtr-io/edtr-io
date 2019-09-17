import { Editor as Core, EditorProps } from '@edtr-io/core'
import * as React from 'react'

export function Editor(props: EditorProps) {
  return <Core {...props} />
}
