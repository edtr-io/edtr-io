<<<<<<< HEAD:packages/plugin-text/src/controls/lists.tsx
import { EdtrIcon, edtrTextControls } from '@edtr-io/editor-ui'
import { orderedListNode, unorderedListNode } from '@edtr-io/plugin-text-state'
=======
import { EdtrIcon, edtrTextControls } from '@edtr-io/ui'
>>>>>>> master:packages/plugins/text/src/controls/lists.tsx
import * as React from 'react'

import { SubControlProps, VisibleControls } from '.'
import { isList, toggleList } from '../plugins/list'
import { Button } from '../toolbar/button'

export const ListControls: React.FunctionComponent<SubControlProps> = props => {
  return (
    <React.Fragment>
      <Button
        name={props.name}
        active={isList(orderedListNode)(props.editor)}
        onClick={() => {
          toggleList(orderedListNode)(props.editor).focus()
          props.onChange(props.editor)
        }}
        title="Nummerierte Liste"
      >
        <EdtrIcon icon={edtrTextControls.listNumbered} />
      </Button>
      <Button
        name={props.name}
        active={isList(unorderedListNode)(props.editor)}
        onClick={() => {
          toggleList(unorderedListNode)(props.editor).focus()
          if (!isList(unorderedListNode)(props.editor)) {
            props.switchControls(VisibleControls.All)
          }
          props.onChange(props.editor)
        }}
        title="Aufzählung"
      >
        <EdtrIcon icon={edtrTextControls.listBullets} />
      </Button>
      <Button
        name={props.name}
        onClick={() => props.switchControls(VisibleControls.All)}
        title="Untermenü schließen"
      >
        <EdtrIcon icon={edtrTextControls.close} />
      </Button>
    </React.Fragment>
  )
}
