import { useScopedSelector } from '@edtr-io/core'
import { AddButton, Guideline } from '@edtr-io/editor-ui'
import { StatefulPluginEditorProps } from '@edtr-io/plugin'
import { isFocused } from '@edtr-io/store'
import { Icon, faTimes } from '@edtr-io/ui'
import * as React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import { solutionStepsState } from '.'
import { SolutionStepsRenderer } from './renderer'
import {
  strategyHelptext,
  introductionHelptext,
  addStrategyLabel,
  solutionStepHelptext,
  explanationHelptext
} from './guideline-texts'

import { useHasFocusSelector } from './has-focus-selector'
import {
  Controls,
  ControlButton,
  Container,
  Content
} from './helper/styled-elements'
import { AddButtonsComponent } from './helper/add-buttons'
import { findPairs } from './helper/find-pairs'
import { dragContent } from './helper/drag-content'
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

  //replace props.focused|| ... with selector
  return editable && pluginFocused ? (
    <DragDropContext onDragEnd={result => dragContent(result, state)}>
      <React.Fragment>
        <Guideline guideline={introductionHelptext}>
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
          <Guideline guideline={strategyHelptext}>
            {state.strategy.render()}
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
                                      {solutionStepHelptext}
                                      {explanationHelptext}
                                    </React.Fragment>
                                  ) : solutionStepLeft.type.value ===
                                    explanation ? (
                                    explanationHelptext
                                  ) : (
                                    solutionStepHelptext
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
                          {index < pairedArray.length - 1 ? (
                            <AddButtonsComponent
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
                <AddButtonsComponent
                  {...props}
                  index={solutionSteps.length}
                  id=""
                />
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
