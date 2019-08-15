import {
  StatefulPluginEditorProps,
  connect,
  selectors,
  ScopedActionCreator
  ScopeContext,
  actions
} from '@edtr-io/core'
import { Icon, faPlus, faTimes, styled } from '@edtr-io/editor-ui'
import * as R from 'ramda'
import * as React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { HotKeys } from 'react-hotkeys'

import { equationsState } from '.'
import { EquationsRenderer } from './renderer'

const DraggableContainer = styled.div({
  border: '2px solid  #007ec1',
  borderRadius: '5px',
  margin: '5px 0',
  padding: '3px',
  background: 'transparent'
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
  right: '-5px'
})

const ColWrapper = styled.div({
  cursor: 'auto',
  background: '#fff'
})

const AddButton = styled.button({
  border: '2px solid  #007ec1',
  borderRadius: '5px',
  color: '#007ec1',
  outline: 'none',
  padding: '5px',
  margin: 'auto',
  backgroundColor: 'transparent'
})

const AddButtonWrapper = styled.div({
  textAlign: 'center'
})

export function EquationsEditor(
  props: StatefulPluginEditorProps<typeof equationsState>
) {
  const { scope } = React.useContext(ScopeContext)
  return <InnerEquationsEditor {...props} scope={scope} />
}

const InnerEquationsEditor = connect<
  { focusedElement: ReturnType<typeof selectors['getFocused']> },
  {
    focusNext: ScopedActionCreator<typeof actions['focusNext']>
    focusPrevious: ScopedActionCreator<typeof actions['focusPrevious']>
  },
  StatefulPluginEditorProps<typeof equationsState> & { scope: string }
>(
  state => {
    return {
      focusedElement: selectors.getFocused(state)
    }
  },
  {
    focusNext: actions.focusNext,
    focusPrevious: actions.focusPrevious
  }
)(function InnerEquationsEditor(
  props: StatefulPluginEditorProps<typeof equationsState> & {
    focusedElement: ReturnType<typeof selectors['getFocused']>
  } & {
    focusNext: ScopedActionCreator<typeof actions['focusNext']>
    focusPrevious: ScopedActionCreator<typeof actions['focusPrevious']>
  }
) {
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
    props.state.steps().map(step => {
      return [step.left.id, step.right.id, step.transform.id]
    })
  )
  console.log(editable, focused, R.contains(props.focusedElement, children))
  return editable && (focused || R.contains(props.focusedElement, children)) ? (
    <HotKeys
      keyMap={{
        FOCUS_NEXT: 'tab',
        FOCUS_PREV: 'shift+tab'
      }}
      handlers={{
        FOCUS_NEXT: e => {
          handleKeyDown(e, () => {
            props.focusNext()
          })
        },
        FOCUS_PREV: e => {
          handleKeyDown(e, () => {
            props.focusPrevious()
          })
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
                {state.steps().map((step, index) => {
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
                              <strong>Linke Seite</strong>
                              <ColWrapper>{step.left.render()}</ColWrapper>
                            </div>
                            <div className="col-xs-4">
                              <strong>Rechte Seite</strong>
                              <ColWrapper>{step.right.render()}</ColWrapper>
                            </div>
                            <div className="col-xs-4">
                              <strong>Umformung</strong>
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
})
