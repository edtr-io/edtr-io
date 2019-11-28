import { useScopedSelector } from '@edtr-io/core'
import { AddButton } from '@edtr-io/editor-ui'
import { StatefulPluginEditorProps } from '@edtr-io/plugin'
import { hasFocusedDescendant, isFocused } from '@edtr-io/store'
import {
  styled,
  Icon,
  faTimes,
  faLevelDownAlt,
  faLevelUpAlt
} from '@edtr-io/ui'
import * as R from 'ramda'
import * as React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import { solutionStepsState } from '.'
import { SolutionStepsRenderer } from './renderer'

export const BigFlex = styled.div({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap'
})

const Buttoncontainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  marginTop: '5px',
  width: '100%'
})
const Container = styled.div<{ type: string; isHalf: boolean }>(
  ({ type, isHalf }: { type: string; isHalf: boolean }) => {
    return {
      marginTop: '10px',
      boxShadow: ` 0 1px 3px 0 ${type === 'step' ? 'black' : 'blue'}`,
      padding: '10px 3px',
      width: isHalf ? '50%' : '100%',
      position: 'relative'
    }
  }
)
const RemoveControls = styled.div({
  right: '0',
  position: 'absolute',
  top: '0',
  transform: 'translate(50%, -5px)',
  display: 'flex',
  flexDirection: 'column'
})
const RemoveButton = styled.button({
  borderRadius: '50%',
  outline: 'none',
  background: 'white',
  zIndex: 20,
  '&:hover': {
    border: '3px solid #007ec1',
    color: '#007ec1'
  }
})

function AddButtons(
  props: StatefulPluginEditorProps<typeof solutionStepsState> & {
    id: string
    index: number
  }
) {
  const hasFocusedChild = useScopedSelector(hasFocusedDescendant(props.id))

  const insertStep = () => {
    props.state.solutionSteps.insert(props.index + 1)
  }
  const insertExplanation = () => {
    props.state.solutionSteps.insert(props.index + 1, {
      type: 'explanation',
      content: { plugin: 'rows' },
      isHalf: false
    })
  }
  return (
    <React.Fragment>
      {hasFocusedChild || props.id === '' ? (
        <Buttoncontainer>
          <AddButton onClick={insertStep}>Lösungsbestandteil</AddButton>
          <AddButton onClick={insertExplanation}>
            Erklärungsbestandteil
          </AddButton>
        </Buttoncontainer>
      ) : null}
    </React.Fragment>
  )
}

export function SolutionStepsEditor(
  props: StatefulPluginEditorProps<typeof solutionStepsState>
) {
  const { state, editable } = props
  const { solutionSteps } = state
  const focusedDescendant = useScopedSelector(hasFocusedDescendant(props.id))
  const introductionFocused = useScopedSelector(
    isFocused(state.introduction.id)
  )
  return editable && (props.focused || focusedDescendant) ? (
    <DragDropContext
      onDragEnd={result => {
        const { source, destination } = result
        if (!destination) {
          return
        }
        state.solutionSteps.move(source.index, destination.index)
      }}
    >
      {state.introduction.render()}
      {introductionFocused ? <AddButtons {...props} index={-1} id="" /> : null}
      <Droppable droppableId="default" direction="vertical">
        {(provided: any) => {
          return (
            <BigFlex ref={provided.innerRef} {...provided.droppableProps}>
              {solutionSteps.map((solutionStep, index) => {
                return (
                  <Draggable
                    key={index}
                    draggableId={solutionStep.content.id}
                    index={index}
                  >
                    {(provided: any) => {
                      return (
                        <React.Fragment key={solutionStep.content.id}>
                          <Container
                            className="row"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            type={solutionStep.type.value}
                            isHalf={solutionStep.isHalf.value}
                          >
                            <RemoveControls>
                              {solutionStep.type.value === 'explanation' ||
                              !solutionStep.isHalf.value ? (
                                <RemoveButton
                                  onClick={() => {
                                    solutionSteps.remove(index)
                                    if (
                                      solutionStep.type.value ===
                                        'explanation' &&
                                      solutionStep.isHalf.value
                                    ) {
                                      solutionSteps.remove(index - 1)
                                    }
                                  }}
                                >
                                  <Icon icon={faTimes} />
                                </RemoveButton>
                              ) : null}
                              {index > 0 &&
                              solutionStep.type.value === 'explanation' &&
                              solutionSteps[index - 1].type.value === 'step' ? (
                                <RemoveButton
                                  onClick={() => {
                                    solutionStep.isHalf.set(
                                      !solutionStep.isHalf.value
                                    )
                                    solutionSteps[index - 1].isHalf.set(
                                      !solutionSteps[index].isHalf.value
                                    )
                                  }}
                                >
                                  <Icon
                                    icon={
                                      solutionStep.isHalf.value
                                        ? faLevelDownAlt
                                        : faLevelUpAlt
                                    }
                                  />
                                </RemoveButton>
                              ) : null}
                            </RemoveControls>
                            {solutionStep.content.render()}
                          </Container>
                          {index < solutionSteps.length - 1 &&
                          !(
                            solutionStep.type.value === 'step' &&
                            solutionStep.isHalf.value
                          ) ? (
                            <AddButtons
                              {...props}
                              id={solutionStep.content.id}
                              index={index}
                            />
                          ) : null}
                        </React.Fragment>
                      )
                    }}
                  </Draggable>
                )
              })}
              {solutionSteps.length > 0 ? (
                <AddButtons {...props} index={solutionSteps.length} id="" />
              ) : null}
            </BigFlex>
          )
        }}
      </Droppable>
    </DragDropContext>
  ) : (
    <SolutionStepsRenderer {...props} />
  )
}
