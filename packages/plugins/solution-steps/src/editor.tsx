import {
  useScopedSelector,
  EditorContext,
  useScopedDispatch
} from '@edtr-io/core'
import { AddButton, Guideline } from '@edtr-io/editor-ui'
import { isFocused, getFocused, focus, getFocusPath } from '@edtr-io/store'
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
import { RenderControls } from './helper/render-controls'

export const explanation = 'explanation'

export function SolutionStepsEditor(props: SolutionStepsProps) {
  const { state, editable } = props
  const { solutionSteps } = state
  const focused = useScopedSelector(getFocused())
  const focusPath = useScopedSelector(getFocusPath())
  console.log(focused)
  const pluginFocused = useHasFocusSelector(props.id)
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
          <Controls
            show={(focusPath && focusPath.includes(state.strategy.id)) || false}
          >
            <ControlButton
              onMouseDown={() => {
                state.hasStrategy.set(false)
                state.strategy.replace('rows')
              }}
            >
              <Icon icon={faTrashAlt} />
            </ControlButton>
          </Controls>
        </div>
      ) : null}

      <AddButtonsComponent {...props} index={-1} id="" />

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
                            <RenderControls
                              state={state}
                              index={row.val1.solutionStepIndex}
                              provided={provided}
                              ids={{
                                leftId: solutionStepLeft.content.id,
                                rightId: solutionStepRight
                                  ? solutionStepRight.content.id
                                  : ''
                              }}
                            />
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
