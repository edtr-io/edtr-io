import * as React from 'react'
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

import { TextProps } from '.'

export function TextEditor({ editable, state }: TextProps) {
  const editor = React.useMemo(() => withReact(createEditor()), [])

  return (
    <Slate
      editor={editor}
      value={state.value}
      onChange={value => state.set(value)}
    >
      <Editable readOnly={!editable} />
    </Slate>
  )
}
