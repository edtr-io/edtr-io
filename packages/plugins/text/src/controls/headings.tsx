<<<<<<< HEAD:packages/plugin-text/src/controls/headings.tsx
import { EdtrIcon, edtrTextControls } from '@edtr-io/editor-ui'
import { HeadingLevel } from '@edtr-io/plugin-text-state'
=======
import { EdtrIcon, edtrTextControls } from '@edtr-io/ui'
>>>>>>> master:packages/plugins/text/src/controls/headings.tsx
import * as R from 'ramda'
import * as React from 'react'

import { SubControlProps, VisibleControls } from '.'
import { createIsHeading, createSetHeading } from '../plugins/headings'
import { setParagraph } from '../plugins/paragraph'
import { Button } from '../toolbar/button'

export const HeadingControls: React.FunctionComponent<
  SubControlProps
> = props => {
  return (
    <React.Fragment>
      {R.times(index => {
        const level = (index + 1) as HeadingLevel
        const active = createIsHeading(level)(props.editor)
        return (
          <Button
            key={index}
            name={props.name}
            active={active}
            onClick={() => {
              active
                ? setParagraph(props.editor)
                : createSetHeading(level)(props.editor)
              props.editor.focus()
              props.onChange(props.editor)
              props.switchControls(VisibleControls.All)
            }}
            title={`Überschrift ${level}`}
          >
            H{level}
          </Button>
        )
      }, 3)}
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
