import { StateTypeReturnType } from '@edtr-io/plugin'
import { SolutionStepsState } from '..'
import { Controls, ControlButton, DragHandler } from './styled-elements'
import * as React from 'react'
import {
  Icon,
  faTrashAlt,
  faEllipsisV,
  faLevelDownAlt,
  faLevelUpAlt
} from '@edtr-io/ui'
import { explanation } from '../editor'

export const renderControls = (
  state: StateTypeReturnType<SolutionStepsState>,
  index: number,
  provided: any
) => {
  const { solutionSteps } = state
  const currentElement = solutionSteps[index]
  return (
    <Controls>
      <ControlButton
        onClick={() => {
          solutionSteps.remove(index)
          //remove explanation that belongs to step
          if (currentElement.isHalf.value) {
            solutionSteps.remove(index)
          }
        }}
      >
        <Icon icon={faTrashAlt} size={'xs'} />
      </ControlButton>

      <DragHandler
        className="row"
        ref={provided.innerRef}
        {...provided.dragHandleProps}
      >
        <Icon icon={faEllipsisV} size={'xs'} />
      </DragHandler>
      {currentElement.isHalf.value ||
      (index > 0 &&
        currentElement.type.value === explanation &&
        solutionSteps[index - 1].type.value !== explanation) ? (
        <ControlButton
          onClick={() => {
            if (currentElement.isHalf.value) {
              currentElement.isHalf.set(false)
              solutionSteps[index + 1].isHalf.set(false)
            } else {
              currentElement.isHalf.set(true)
              solutionSteps[index - 1].isHalf.set(true)
            }
          }}
        >
          <Icon
            icon={currentElement.isHalf.value ? faLevelDownAlt : faLevelUpAlt}
            size={'xs'}
          />
        </ControlButton>
      ) : null}
    </Controls>
  )
}
