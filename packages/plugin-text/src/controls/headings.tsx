import * as React from 'react'
import * as R from 'ramda'
import { Icon, faTimes } from '@edtr-io/editor-ui'
import {
  createIsHeading,
  createSetHeading,
  HeadingLevel
} from '../plugins/headings'
import { Button } from '../toolbar/button'
import { setParagraph } from '../plugins/paragraph'
import { ControlProps, VisibleControls } from '.'

export const HeadingControls: React.FunctionComponent<
  ControlProps & { switchControls: (controlType: VisibleControls) => void }
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
              props.switchControls(VisibleControls.All)
            }}
          >
            H{level}
          </Button>
        )
      }, 6)}
      <Button
        name={props.name}
        onClick={() => props.switchControls(VisibleControls.All)}
      >
        <Icon icon={faTimes} />
      </Button>
    </React.Fragment>
  )
}
