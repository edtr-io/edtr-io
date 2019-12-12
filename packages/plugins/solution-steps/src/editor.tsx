import { useScopedSelector } from '@edtr-io/core'
import { AddButton } from '@edtr-io/editor-ui'
import { StatefulPluginEditorProps } from '@edtr-io/plugin'
import { hasFocusedDescendant, isFocused } from '@edtr-io/store'
import {
  styled,
  Icon,
  faTimes,
  faLevelDownAlt,
  faLevelUpAlt,
  faEllipsisV
} from '@edtr-io/ui'
import * as React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import { solutionStepsState } from '.'
import { SolutionStepsRenderer } from './renderer'

const Buttoncontainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  marginTop: '5px',
  width: '100%'
})

const Container = styled.div({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  position: 'relative'
})

const Content = styled.div<{ type: string; isHalf: boolean }>(
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
  flexDirection: 'column',
  alignItems: 'center'
})
const ControlButton = styled.button({
  borderRadius: '50%',
  border: '1px solid black',
  outline: 'none',
  background: 'white',
  zIndex: 20,
  '&:hover': {
    border: '3px solid #007ec1',
    color: '#007ec1'
  }
})

const DragHandler = styled.div({
  borderRadius: '50%',
  width: '26px',
  border: '1px solid black',
  textAlign: 'center',
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
  const findPairs = () => {
    interface Element {
      content: typeof solutionSteps[0]
      solutionStepIndex: number
    }
    const pairedList: {
      val1: Element
      val2?: Element
    }[] = []
    solutionSteps.forEach((solutionStep, index) => {
      if (!solutionStep.isHalf.value) {
        pairedList.push({
          val1: { content: solutionStep, solutionStepIndex: index }
        })
      } else if (solutionStep.type.value === 'step') {
        pairedList.push({
          val1: { content: solutionStep, solutionStepIndex: index },
          val2: {
            content: solutionSteps[index + 1],
            solutionStepIndex: index + 1
          }
        })
      }
    })
    return pairedList
  }

  const renderControls = (
    content: typeof solutionSteps[0],
    index: number,
    provided: any
  ) => (
    <RemoveControls>
      <ControlButton
        onClick={() => {
          solutionSteps.remove(index)
          //remove explanation that belongs to step
          if (content.isHalf.value) {
            solutionSteps.remove(index)
          }
        }}
      >
        <Icon icon={faTimes} />
      </ControlButton>

      <DragHandler
        className="row"
        ref={provided.innerRef}
        {...provided.dragHandleProps}
      >
        <Icon icon={faEllipsisV} />
      </DragHandler>
      {content.isHalf.value ||
      (index > 0 &&
        content.type.value === 'explanation' &&
        solutionSteps[index - 1].type.value === 'step') ? (
        <ControlButton
          onClick={() => {
            if (content.isHalf.value) {
              content.isHalf.set(false)
              solutionSteps[index + 1].isHalf.set(false)
            } else {
              content.isHalf.set(true)
              solutionSteps[index - 1].isHalf.set(true)
            }
          }}
        >
          <Icon icon={content.isHalf.value ? faLevelDownAlt : faLevelUpAlt} />
        </ControlButton>
      ) : null}
    </RemoveControls>
  )

  return editable && (props.focused || focusedDescendant) ? (
    <DragDropContext
      onDragEnd={result => {
        const { source, destination } = result
        if (!destination) {
          return
        }
        const sortedArray = findPairs()
        const sourceVal1 = sortedArray[source.index].val1
        const sourceVal2 = sortedArray[source.index].val2
        const destinationVal1 = sortedArray[destination.index].val1
        const destinationVal2 = sortedArray[destination.index].val2

        const movingUpwards = destination.index < source.index
        if (movingUpwards) {
          if (sourceVal2) {
            //move right source before left, so destination index is correct for both movements
            state.solutionSteps.move(
              sourceVal2.solutionStepIndex,
              destinationVal1.solutionStepIndex
            )
            state.solutionSteps.move(
              // index of sourceVal1 actually changed, so we need to adapt here
              sourceVal1.solutionStepIndex + 1,
              destinationVal1.solutionStepIndex
            )
          } else {
            state.solutionSteps.move(
              sourceVal1.solutionStepIndex,
              destinationVal1.solutionStepIndex
            )
          }
        } else {
          const destinationIndex = destinationVal2
            ? destinationVal2.solutionStepIndex
            : destinationVal1.solutionStepIndex

          //move left source before right, so destination index is correct for both movements
          state.solutionSteps.move(
            sourceVal1.solutionStepIndex,
            destinationIndex
          )
          if (sourceVal2) {
            state.solutionSteps.move(
              // index of sourceVal2 actually changed, so we need to adapt here
              sourceVal2.solutionStepIndex - 1,
              destinationIndex
            )
          }
        }
      }}
    >
      {state.introduction.render()}
      {introductionFocused ? <AddButtons {...props} index={-1} id="" /> : null}
      <Droppable droppableId="default" direction="vertical">
        {(provided: any) => {
          return (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {findPairs().map((row, index) => {
                const solutionStepLeft = row.val1.content
                const solutionStepRight = row.val2
                  ? row.val2.content
                  : undefined
                return (
                  <Draggable
                    key={index}
                    draggableId={solutionStepLeft.content.id}
                    index={index}
                  >
                    {(provided: any) => {
                      return (
                        <React.Fragment key={solutionStepLeft.content.id}>
                          <Container {...provided.draggableProps}>
                            <Content
                              type={solutionStepLeft.type.value}
                              isHalf={solutionStepLeft.isHalf.value}
                            >
                              {solutionStepLeft.content.render()}
                            </Content>
                            {solutionStepRight ? (
                              <Content
                                type={solutionStepRight.type.value}
                                isHalf={solutionStepRight.isHalf.value}
                              >
                                {solutionStepRight.content.render()}
                              </Content>
                            ) : null}
                            {renderControls(
                              solutionStepLeft,
                              row.val1.solutionStepIndex,
                              provided
                            )}
                          </Container>
                          {index < solutionSteps.length - 1 ? (
                            <AddButtons
                              {...props}
                              id={solutionStepLeft.content.id}
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
            </div>
          )
        }}
      </Droppable>
    </DragDropContext>
  ) : (
    <SolutionStepsRenderer {...props} />
  )
}
