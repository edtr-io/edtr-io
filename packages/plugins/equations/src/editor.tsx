import {
  HotKeys,
  useScopedDispatch,
  useScopedSelector,
  useScopedStore
} from '@edtr-io/core'
import { focusNext, focusPrevious, getFocused, isEmpty } from '@edtr-io/store'
import {
  Icon,
  faPlus,
  faTimes,
  styled,
  EdtrIcon,
  edtrDragHandle
} from '@edtr-io/ui'
import * as R from 'ramda'
import * as React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import { LayoutContainer, EquationsRenderer } from './renderer'
import { EquationsProps } from '.'

const ButtonContainer = styled.div({
  display: 'flex',
  float: 'right',
  flexDirection: 'row',
  alignItems: 'center',
  position: 'absolute',
  right: '-50px',
  zIndex: 10
})

const RemoveButton = styled.button({
  outline: 'none',
  width: '35px',
  border: 'none',
  background: 'transparent'
})
const DragButton = styled.div({
  cursor: 'grab',
  paddingRight: '5px'
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

const Header = styled.div({
  textAlign: 'center',
  width: '33%'
})

export function EquationsEditor(props: EquationsProps) {
  const store = useScopedStore()
  const focusedElement = useScopedSelector(getFocused())
  const dispatch = useScopedDispatch()

  const insertWithRightSymbol = () => {
    const symbol =
      props.state.steps.length > 0
        ? props.state.steps[props.state.steps.length - 1].symbol.value
        : 'equals'
    state.steps.insert(props.state.steps.length + 1, {
      left: { plugin: 'text', state: {} },
      right: { plugin: 'text', state: {} },
      transform: { plugin: 'text', state: {} },
      symbol: symbol
    })
  }
  const addButton = () => {
    const { state } = props
    insertWithRightSymbol()
  }
  const removeButton = (index: number) => () => {
    const { state } = props
    state.steps.remove(index)
  }
  const handleKeyDown = (e: KeyboardEvent | undefined, next: () => void) => {
    e && e.preventDefault()
    next()
  }

  const { focused, state, editable, config } = props
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
              insertWithRightSymbol()
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
                <LayoutContainer>
                  <Header>
                    <strong>Linke Seite</strong>
                  </Header>
                  <Header>
                    <strong>Rechte Seite</strong>
                  </Header>
                  <Header>
                    <strong>Umformung / Erklärung</strong>
                  </Header>
                </LayoutContainer>
                {state.steps.map((step, index) => {
                  return (
                    <Draggable
                      key={index}
                      draggableId={step.left.id}
                      index={index}
                    >
                      {(provided: any) => {
                        return (
                          <LayoutContainer
                            className="row"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                          >
                            <div
                              style={{
                                textAlign: isEmpty(step.left.id)(
                                  store.getState()
                                )
                                  ? 'center'
                                  : 'right',
                                width: '33%'
                              }}
                            >
                              {step.left.render({
                                config: { placeholder: config.left.label }
                              })}
                            </div>

                            <div
                              style={{
                                width: '33%',
                                display: 'flex',
                                flexDirection: 'row'
                              }}
                            >
                              <select
                                onChange={(
                                  e: React.ChangeEvent<HTMLSelectElement>
                                ) => {
                                  step.symbol.set(e.target.value)
                                }}
                                value={step.symbol.value}
                              >
                                <option value="equals">=</option>
                                <option value="greater">{'>'}</option>
                                <option value="lesser">{'<'}</option>
                                <option value="greater-equal">&#8805;</option>
                                <option value="lesser-equal">&#8804;</option>
                                <option value="approx">&#8776;</option>
                              </select>
                              <div style={{ flexGrow: 1 }}>
                                {step.right.render({
                                  config: { placeholder: config.right.label }
                                })}
                              </div>
                            </div>

                            <div style={{ width: '33%' }}>
                              {step.transform.render({
                                config: { placeholder: config.transform.label }
                              })}
                            </div>
                            <ButtonContainer>
                              <DragButton {...provided.dragHandleProps}>
                                <EdtrIcon icon={edtrDragHandle} />
                              </DragButton>
                              <RemoveButton onClick={removeButton(index)}>
                                <Icon icon={faTimes} />
                              </RemoveButton>
                            </ButtonContainer>
                          </LayoutContainer>
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
