import * as React from 'react'
import { SubControlProps, VisibleControls } from './index'
import { faListOl, faListUl, faTimes, Icon } from '@edtr-io/editor-ui'
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
        <Icon icon={faListOl} />
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
        <Icon icon={faListUl} />
      </Button>
      <Button
        name={props.name}
        onClick={() => props.switchControls(VisibleControls.All)}
        title={'Untermenü schließen'}
      >
        <Icon icon={faTimes} />
      </Button>
    </React.Fragment>
  )
}
