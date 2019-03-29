import { StatefulPluginEditorProps } from '@edtr-io/core'
import { Icon, faPlus, faTimes, styled } from '@edtr-io/ui'
import * as React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import { EquationsRenderer } from './renderer'
import { equationsState } from '.'

const DraggableContainer = styled.div({
  border: '1px solid #000',
  margin: '10px',
  background: 'lightgrey',
  padding: '10px'
})

const RemoveButton = styled.button({
  borderRadius: '50%',
  outline: 'none',
  width: '35px',
  height: '35px',
  border: 'none',
  float: 'right',
  background: 'transparent',
  position: 'relative',
  top: '-15px',
  right: '-30px'
})

const ColWrapper = styled.div({
  cursor: 'auto',
  background: '#fff'
})

const AddButton = styled.button({
  borderRadius: '50%',
  outline: 'none',
  width: '35px',
  height: '35px',
  border: 'none',
  margin: 'auto'
})

const AddButtonWrapper = styled.div({
  textAlign: 'center'
})

export class EquationsEditor extends React.Component<
  StatefulPluginEditorProps<typeof equationsState>
> {
  private addButton = () => {
    const { state } = this.props
    state.steps.insert()
  }
  private removeButton = (index: number) => () => {
    const { state } = this.props
    state.steps.remove(index)
  }
  public render() {
    const { editable, state } = this.props
    if (editable) {
      return (
        <React.Fragment>
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
                                  <RemoveButton
                                    onClick={this.removeButton(index)}
                                  >
                                    <Icon icon={faTimes} />
                                  </RemoveButton>
                                </div>
                                <div className="col-xs-4">
                                  <strong>Left Side</strong>
                                  <ColWrapper>{step.left.render()}</ColWrapper>
                                </div>
                                <div className="col-xs-4">
                                  <strong>Right Side</strong>
                                  <ColWrapper>{step.right.render()}</ColWrapper>
                                </div>
                                <div className="col-xs-4">
                                  <strong>Transformation</strong>
                                  <ColWrapper>
                                    {step.transform.render()}
                                  </ColWrapper>
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
            <AddButton onClick={this.addButton}>
              <Icon icon={faPlus} />
            </AddButton>
          </AddButtonWrapper>
        </React.Fragment>
      )
    }

    return <EquationsRenderer state={state} />
  }
}
