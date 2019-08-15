import { StatefulPluginEditorProps } from '@edtr-io/core'
import { Icon, faPlus, faTimes, styled } from '@edtr-io/editor-ui'
import * as React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

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
    const { focused, state } = this.props

    return focused ? (
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
                                <strong>Linke Seite</strong>
                                <ColWrapper>{step.left.render()}</ColWrapper>
                              </div>
                              <div className="col-xs-4">
                                <strong>Rechte Seite</strong>
                                <ColWrapper>{step.right.render()}</ColWrapper>
                              </div>
                              <div className="col-xs-4">
                                <strong>Umformung</strong>
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
            <Icon icon={faPlus} /> Rechenschritt hinzufügen
          </AddButton>
        </AddButtonWrapper>
      </React.Fragment>
    ) : (
      <EquationsRenderer {...this.props} />
    )
  }
}
