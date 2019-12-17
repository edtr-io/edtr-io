import {
  HotKeys,
  useScopedDispatch,
  useScopedSelector,
  useScopedStore
} from '@edtr-io/core'
import { focusNext, focusPrevious, getFocused, isEmpty } from '@edtr-io/store'
import { Icon, faPlus, faTimes, styled } from '@edtr-io/ui'
import * as R from 'ramda'
import * as React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import { EquationsProps } from '.'
import { EquationsRenderer } from './renderer'

const DraggableContainer = styled.div({
  margin: '5px 0',
  padding: '3px'
})

const RemoveButton = styled.button({
  borderRadius: '50%',
  outline: 'none',
  width: '35px',
  height: '35px',
  border: 'none',
  float: 'right',
  background: 'transparent',
  position: 'absolute',
  top: '-5px',
  right: '-5px',
  zIndex: 10
})

const ColWrapper = styled.div({
  cursor: 'auto'
})

const AddButton = styled.button({
  border: '2px solid  #007ec1',
  borderRadius: '5px',
  color: '#007ec1',
  outline: 'none',
  padding: '5px',
  margin: 'auto',
  marginTop: '10px',
  backgroundColor: 'transparent'
})

const AddButtonWrapper = styled.div({
  textAlign: 'center'
})

export function EquationsEditor(props: EquationsProps) {
  const store = useScopedStore()
  const focusedElement = useScopedSelector(getFocused())
  const dispatch = useScopedDispatch()

  const addButton = () => {
    const { state } = props
    state.steps.insert()
  }
  const removeButton = (index: number) => () => {
    const { state } = props
    state.steps.remove(index)
  }
  const handleKeyDown = (e: KeyboardEvent | undefined, next: () => void) => {
    e && e.preventDefault()
    next()
  }

  const { focused, state, editable } = props
  const children = R.flatten(
    props.state.steps.map(step => {
      return [step.left.id, step.right.id, step.transform.id]
    })
  )
  const noEmptyLine = !R.includes(
    false,
    props.state.steps.map(step => {
      return R.includes(false, [
        isEmpty(step.left.id)(store.getState()),
        isEmpty(step.right.id)(store.getState()),
        isEmpty(step.transform.id)(store.getState())
      ])
    })
  )
  return editable && (focused || R.includes(focusedElement, children)) ? (
    <HotKeys
      keyMap={{
        FOCUS_NEXT: 'tab',
        FOCUS_PREV: 'shift+tab',
        NEW_LINE: 'return'
      }}
      handlers={{
        FOCUS_NEXT: e => {
          handleKeyDown(e, () => {
            dispatch(focusNext())
          })
        },
        FOCUS_PREV: e => {
          handleKeyDown(e, () => {
            dispatch(focusPrevious())
          })
        },
        NEW_LINE: e => {
          if (noEmptyLine) {
            handleKeyDown(e, () => {
              props.state.steps.insert()
            })
          }
        }
      }}
    >
      {/* eslint-disable @typescript-eslint/no-explicit-any */}
      <DragDropContext
        onDragEnd={result => {
          const { source, destination } = result
          if (!destination) {
            return
          }
          state.steps.move(source.index, destination.index)
        }}
      >
        <Droppable droppableId="default" direction="vertical">
          {(provided: any) => {
            return (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <div>
                  <div className="col-xs-4">
                    <strong>Linke Seite</strong>
                  </div>
                  <div className="col-xs-4">
                    <strong>Rechte Seite</strong>
                  </div>
                  <div className="col-xs-4">
                    <strong>Umformung</strong>
                  </div>
                </div>
                {state.steps.map((step, index) => {
                  return (
                    <Draggable
                      key={index}
                      draggableId={step.left.id}
                      index={index}
                    >
                      {(provided: any) => {
                        return (
                          <DraggableContainer
                            className="row"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <div className="col-xs-12">
                              <RemoveButton onClick={removeButton(index)}>
                                <Icon icon={faTimes} />
                              </RemoveButton>
                            </div>
                            <div className="col-xs-4">
                              <ColWrapper>{step.left.render()}</ColWrapper>
                            </div>
                            <div className="col-xs-4">
                              <ColWrapper>{step.right.render()}</ColWrapper>
                            </div>
                            <div className="col-xs-4">
                              <ColWrapper>{step.transform.render()}</ColWrapper>
                            </div>
                          </DraggableContainer>
                        )
                      }}
                    </Draggable>
                  )
                })}
              </div>
            )
          }}
        </Droppable>
      </DragDropContext>
      {/* eslint-enable @typescript-eslint/no-explicit-any */}
      <AddButtonWrapper>
        <AddButton onClick={addButton}>
          <Icon icon={faPlus} /> Rechenschritt hinzufügen
        </AddButton>
      </AddButtonWrapper>
    </HotKeys>
  ) : (
    <EquationsRenderer {...props} />
  )
}
