import * as React from 'react'
import { EdtrIcon, edtrIconSet } from '@edtr-io/editor-ui'
import { SubControlProps, VisibleControls } from './index'
import { Button } from '../toolbar/button'
import {
  isList,
  orderedListNode,
  toggleList,
  unorderedListNode
} from '../plugins/list'

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
        title={'Nummerierte Liste'}
      >
        <EdtrIcon icon={edtrIconSet.listNumbered} />
      </Button>
      <Button
        name={props.name}
        active={isList(unorderedListNode)(props.editor)}
        onClick={() => {
          toggleList(unorderedListNode)(props.editor).focus()
          props.onChange(props.editor)
        }}
        title={'Aufzählung'}
      >
        <EdtrIcon icon={edtrIconSet.listBullets} />
      </Button>
      <Button
        name={props.name}
        onClick={() => props.switchControls(VisibleControls.All)}
        title={'Untermenü schließen'}
      >
        <EdtrIcon icon={edtrIconSet.close} />
      </Button>
    </React.Fragment>
  )
}
