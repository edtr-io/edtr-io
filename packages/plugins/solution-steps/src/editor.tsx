import { useScopedSelector } from '@edtr-io/core'
import { AddButton, Guideline } from '@edtr-io/editor-ui'
import { StatefulPluginEditorProps } from '@edtr-io/plugin'
import { isFocused } from '@edtr-io/store'
import { Icon, faTimes } from '@edtr-io/ui'
import * as React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import { solutionStepsState } from '.'
import {
  strategyGuideline,
  introductionGuideline,
  addStrategyLabel,
  solutionStepGuideline,
  explanationGuideline,
  addAdditionalsLabel,
  additionalsGuideline
} from './guideline-texts'
import { useHasFocusSelector } from './has-focus-selector'
import { AddButtonsComponent } from './helper/add-buttons'
import { dragContent } from './helper/drag-content'
import { findPairs } from './helper/find-pairs'
import {
  Controls,
  ControlButton,
  Container,
  Content
} from './helper/styled-elements'
import { SolutionStepsRenderer } from './renderer'
import { renderControls } from './helper/render-controls'

export const explanation = 'explanation'

export function SolutionStepsEditor(
  props: StatefulPluginEditorProps<typeof solutionStepsState>
) {
  const { state, editable } = props
  const { solutionSteps } = state
  const pluginFocused = useHasFocusSelector(props.id)
  const introductionFocused = useScopedSelector(
    isFocused(state.introduction.id)
  )
  const strategyFocused = useHasFocusSelector(state.strategy.id)
  const additionalsFocused = useHasFocusSelector(state.additionals.id)

  //replace props.focused|| ... with selector
  return editable && pluginFocused ? (
    <DragDropContext onDragEnd={result => dragContent(result, state)}>
      <React.Fragment>
        <Guideline guideline={introductionGuideline}>
          {state.introduction.render()}
        </Guideline>
        {introductionFocused && !state.hasStrategy.value ? (
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
            <Content type={explanation} isHalf={false}>
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
              <Icon icon={faTimes} />
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
                                type={solutionStepRight.type.value}
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
                            index={index}
                          />
                        </React.Fragment>
                      )
                    }}
                  </Draggable>
                )
              })}
              {solutionSteps.length === 0 ||
              state.hasAdditionals.value ? null : (
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
                    <Content type={explanation} isHalf={false}>
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
                      <Icon icon={faTimes} />
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
