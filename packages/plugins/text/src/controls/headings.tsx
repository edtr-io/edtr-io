import { edtrClose, EdtrIcon } from '@edtr-io/ui'
import * as R from 'ramda'
import * as React from 'react'

import { SubControlProps, VisibleControls } from '.'
import { HeadingLevel } from '../model'
import { createIsHeading, createSetHeading } from '../plugins/headings'
import { setParagraph } from '../plugins/paragraph'
import { Button } from '../toolbar/button'

export const HeadingControls: React.FunctionComponent<SubControlProps> = props => {
  return (
    <React.Fragment>
      {R.times(index => {
        const level = (index + 1) as HeadingLevel
        const active = createIsHeading(level)(props.editor)
        return (
          <Button
            key={index}
            config={props.config}
            active={active}
            onClick={() => {
              active
                ? setParagraph(props.editor)
                : createSetHeading(level)(props.editor)
              props.editor.focus()
              props.onChange(props.editor)
              props.switchControls(VisibleControls.All)
            }}
            title={props.config.i18n.headings.setHeadingTitle(level)}
          >
            H{level}
          </Button>
        )
      }, 3)}
      <Button
        config={props.config}
        onClick={() => props.switchControls(VisibleControls.All)}
        title={props.config.i18n.headings.closeMenuTitle}
      >
        <EdtrIcon icon={edtrClose} />
      </Button>
    </React.Fragment>
  )
}
