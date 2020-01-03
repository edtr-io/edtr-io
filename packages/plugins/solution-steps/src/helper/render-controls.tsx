import { StateTypeReturnType } from '@edtr-io/plugin'
import { SolutionStepsState } from '..'
import { Controls, ControlButton, DragHandler } from './styled-elements'
import * as React from 'react'
import {
  Icon,
  faTrashAlt,
  faEllipsisV,
  faLevelDownAlt,
  faLevelUpAlt,
  faQuestionCircle
} from '@edtr-io/ui'
import { explanation } from '../editor'
import { getFocusPath } from '@edtr-io/store'
import { useScopedSelector } from '@edtr-io/core'

export const RenderControls = ({
  state,
  index,
  showHelp,
  provided,
  ids
}: {
  state: StateTypeReturnType<SolutionStepsState>
  index: number
  showHelp: (show: boolean) => void
  provided: any
  ids: { leftId: string; rightId: string | null }
}) => {
  const focusPath = useScopedSelector(getFocusPath())
  const show =
    (focusPath &&
      (focusPath.includes(ids.leftId) ||
        (ids.rightId && focusPath.includes(ids.rightId)))) ||
    false

  const { solutionSteps } = state
  const currentElement = solutionSteps[index]
  return (
    <Controls show={show}>
      <ControlButton
        onMouseDown={() => {
          solutionSteps.remove(index)
          //remove explanation that belongs to step
          if (currentElement.isHalf.value) {
            solutionSteps.remove(index)
          }
        }}
      >
        <Icon icon={faTrashAlt} size={'xs'} />
      </ControlButton>
      <ControlButton
        onMouseDown={() => {
          showHelp(true)
        }}
      >
        <Icon icon={faQuestionCircle} />
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
          onMouseDown={() => {
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
