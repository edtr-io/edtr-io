import * as React from 'react'
import * as R from 'ramda'
import { EdtrIcon, edtrTextControls } from '@edtr-io/editor-ui'
import {
  createIsHeading,
  createSetHeading,
  HeadingLevel
} from '../plugins/headings'
import { Button } from '../toolbar/button'
import { setParagraph } from '../plugins/paragraph'
import { SubControlProps, VisibleControls } from '.'

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
        title={'Untermenü schließen'}
      >
        <EdtrIcon icon={edtrTextControls.close} />
      </Button>
    </React.Fragment>
  )
}
