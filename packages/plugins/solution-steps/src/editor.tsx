import { useScopedSelector, EditorContext } from '@edtr-io/core'
import { AddButton, Guideline } from '@edtr-io/editor-ui'
import { isFocused } from '@edtr-io/store'
import { Icon, faTrashAlt } from '@edtr-io/ui'
import * as React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import { SolutionStepsProps } from '.'
import {
  strategyGuideline,
  introductionGuideline,
  addStrategyLabel,
  solutionStepGuideline,
  explanationGuideline,
  addAdditionalsLabel,
  additionalsGuideline
} from './guideline-texts'
import { AddButtonsComponent } from './helper/add-buttons'
import { dragContent } from './helper/drag-content'
import { findPairs } from './helper/find-pairs'
import { useHasFocusSelector } from './helper/has-focus-selector'
import {
  Controls,
  ControlButton,
  Container,
  Content,
  SolutionPluginTypes
} from './helper/styled-elements'
import { SolutionStepsRenderer } from './renderer'
import { renderControls } from './helper/render-controls'

export const explanation = 'explanation'

export function SolutionStepsEditor(props: SolutionStepsProps) {
  const store = React.useContext(EditorContext)
  console.log('STore:', store)
  const { state, editable } = props
  const { solutionSteps } = state
  console.log(props)
  console.log(state.introduction.id)
  console.log(state.strategy.id)
  const pluginFocused = useHasFocusSelector(props.id)
  const introductionFocused = useScopedSelector(
    isFocused(state.introduction.id)
  )

  const strategyFocused = useHasFocusSelector(state.strategy.id)
  return editable && pluginFocused ? (
    <DragDropContext onDragEnd={result => dragContent(result, state)}>
      <React.Fragment>
        <Guideline guideline={introductionGuideline}>
          <Content type={SolutionPluginTypes.introduction}>
            {state.introduction.render()}
          </Content>
        </Guideline>
        {!state.hasStrategy.value ? (
          <AddButton
            title={addStrategyLabel}
            onClick={() => {
              state.hasStrategy.set(true)
            }}
          >
            Lösungsstrategie
          </AddButton>
        ) : null}
      </React.Fragment>
      {state.hasStrategy.value ? (
        <div style={{ position: 'relative' }}>
          <Guideline guideline={strategyGuideline}>
            <Content type={SolutionPluginTypes.strategy}>
              {state.strategy.render()}
            </Content>
          </Guideline>

          <Controls>
            <ControlButton
              onClick={() => {
                state.hasStrategy.set(false)
                state.strategy.replace('rows')
              }}
            >
              <Icon icon={faTrashAlt} />
            </ControlButton>
          </Controls>
        </div>
      ) : null}
      {introductionFocused || strategyFocused ? (
        <AddButtonsComponent {...props} index={-1} id="" />
      ) : null}

      <Droppable droppableId="default" direction="vertical">
        {(provided: any) => {
          const pairedArray = findPairs(solutionSteps)
          return (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {pairedArray.map((row, index) => {
                const solutionStepLeft = row.val1.content
                const solutionStepRight = row.val2
                  ? row.val2.content
                  : undefined
                const solutionStepIndexLeft = row.val1.solutionStepIndex
                const solutionStepIndexRight = row.val2
                  ? row.val2.solutionStepIndex
                  : -1
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
                              type={
                                solutionStepLeft.type.value === explanation
                                  ? SolutionPluginTypes.explanation
                                  : SolutionPluginTypes.step
                              }
                              isHalf={solutionStepLeft.isHalf.value}
                            >
                              <Guideline
                                guideline={
                                  solutionStepRight ? (
                                    <React.Fragment>
                                      {solutionStepGuideline}
                                      {explanationGuideline}
                                    </React.Fragment>
                                  ) : solutionStepLeft.type.value ===
                                    explanation ? (
                                    explanationGuideline
                                  ) : (
                                    solutionStepGuideline
                                  )
                                }
                              >
                                {solutionStepLeft.content.render()}
                              </Guideline>
                            </Content>
                            {solutionStepRight ? (
                              <Content
                                type={
                                  solutionStepRight.type.value === explanation
                                    ? SolutionPluginTypes.explanation
                                    : SolutionPluginTypes.step
                                }
                                isHalf={solutionStepRight.isHalf.value}
                              >
                                {solutionStepRight.content.render()}
                              </Content>
                            ) : null}
                            {renderControls(
                              state,
                              row.val1.solutionStepIndex,
                              provided
                            )}
                          </Container>
                          <AddButtonsComponent
                            {...props}
                            id={solutionStepLeft.content.id}
                            optionalID={
                              solutionStepRight
                                ? solutionStepRight.content.id
                                : undefined
                            }
                            index={
                              solutionStepRight
                                ? solutionStepIndexRight
                                : solutionStepIndexLeft
                            }
                          />
                        </React.Fragment>
                      )
                    }}
                  </Draggable>
                )
              })}
              {state.hasAdditionals.value ? null : (
                <AddButton
                  title={addAdditionalsLabel}
                  onClick={() => {
                    state.hasAdditionals.set(true)
                  }}
                >
                  Ergänzung
                </AddButton>
              )}
              {state.hasAdditionals.value ? (
                <div style={{ position: 'relative' }}>
                  <Guideline guideline={additionalsGuideline}>
                    <Content type={SolutionPluginTypes.additionals}>
                      {state.additionals.render()}
                    </Content>
                  </Guideline>
                  <Controls>
                    <ControlButton
                      onClick={() => {
                        state.hasAdditionals.set(false)
                        state.additionals.replace('rows')
                      }}
                    >
                      <Icon icon={faTrashAlt} />
                    </ControlButton>
                  </Controls>
                </div>
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
