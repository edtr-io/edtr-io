import { Icon, faPlus, faTimes, styled } from '@edtr-io/ui'
import * as React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { StatefulPluginEditorProps } from '@edtr-io/core'
import { stepByStepState } from '.'
import { StepByStepRenderer } from './renderer'

export class StepByStepEditor extends React.Component<
  StatefulPluginEditorProps<typeof stepByStepState>
> {
  addButton = () => {
    const { state } = this.props
    state.steps.insert()
  }
  removeButton = (index: number) => () => {
    const { state } = this.props
    state.steps.remove(index)
  }

  public render() {
    const { editable, state } = this.props

    if (editable) {
      return (
        <React.Fragment>
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
                          draggableId={step.content.id}
                          index={index}
                        >
                          {(provided: any) => {
                            return (
                              <this.DraggableContainer
                                className="row"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <div className="col-xs-12">
                                  <this.RemoveButton
                                    onClick={this.removeButton(index)}
                                  >
                                    <Icon icon={faTimes} />
                                  </this.RemoveButton>
                                  <form
                                    onChange={event => {
                                      // @ts-ignore TODO:
                                      const type = event.target.value
                                      state.steps()[index].type.set(type)
                                      state
                                        .steps()
                                        [index].hasExplanation.set(
                                          type === 'step'
                                        )
                                    }}
                                  >
                                    <label>
                                      <input
                                        type="radio"
                                        name="type"
                                        value="step"
                                        defaultChecked={step.type() === 'step'}
                                      />
                                      with Explanation
                                    </label>
                                    <label>
                                      <input
                                        type="radio"
                                        name="type"
                                        value="content"
                                        defaultChecked={
                                          step.type() === 'content'
                                        }
                                      />
                                      without Explanation
                                    </label>
                                  </form>
                                </div>
                                {step.type() === 'step' ? (
                                  <div className="col-xs-12">
                                    <strong>Explanation</strong>
                                    <this.StepFieldContainer>
                                      {step.explanation.render()}
                                    </this.StepFieldContainer>
                                  </div>
                                ) : null}

                                <div className="col-xs-12">
                                  <strong>Content</strong>
                                  <this.StepFieldContainer>
                                    {step.content.render()}
                                  </this.StepFieldContainer>
                                </div>
                              </this.DraggableContainer>
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
          <this.AddButtonContainer>
            <this.AddButton onClick={this.addButton}>
              <Icon icon={faPlus} />
            </this.AddButton>
          </this.AddButtonContainer>
        </React.Fragment>
      )
    }

    return <StepByStepRenderer state={state} />
  }

  private DraggableContainer = styled.div({
    border: '1px solid #000',
    margin: '10px',
    background: 'lightgrey',
    padding: '10px'
  })

  private RemoveButton = styled.button({
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

  private AddButtonContainer = styled.div({
    textAlign: 'center'
  })

  private AddButton = styled.button({
    borderRadius: '50%',
    outline: 'none',
    width: '35px',
    height: '35px',
    border: 'none',
    margin: 'auto'
  })

  private StepFieldContainer = styled.div({
    cursor: 'auto',
    background: '#fff'
  })
}
