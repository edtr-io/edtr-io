import { useScopedSelector } from '@edtr-io/core'
import { AddButton } from '@edtr-io/editor-ui'
import { getFocusPath } from '@edtr-io/store'
import { Icon, faTrashAlt, faQuestion } from '@edtr-io/ui'
import * as React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

import { SolutionStepsProps } from '.'
import {
  AddButtonsComponent,
  dragContent,
  findPairs,
  useHasFocusSelector,
  Controls,
  ControlButton,
  Container,
  Content,
  SolutionPluginTypes,
  RenderControls,
  Overlay
} from './helper'
import { SolutionStepsRenderer } from './renderer'

export const explanation = 'explanation'

export function SolutionStepsEditor(props: SolutionStepsProps) {
  const { state, editable, config } = props
  const { solutionSteps } = state
  const focusPath = useScopedSelector(getFocusPath())
  const pluginFocused = useHasFocusSelector(props.id)

  const [introductionHelpVisible, setIntroductionHelp] = React.useState(false)
  const [strategyHelpVisible, setStrategyHelp] = React.useState(false)
  const [stepHelpVisible, setStepHelp] = React.useState(false)
  const [additionalsHelpVisible, setAdditionalsHelp] = React.useState(false)

  return editable && pluginFocused ? (
    <DragDropContext onDragEnd={result => dragContent(result, state)}>
      <React.Fragment>
        {/* TODO: refactor Content-Container -> hand icon down via config? */}
        <Content type={SolutionPluginTypes.introduction} boxfree>
          {state.introduction.render({
            config: { placeholder: config.introduction.placeholder }
          })}
        </Content>
        <Controls
          show={
            (focusPath && focusPath.includes(state.introduction.id)) || false
          }
        >
          <ControlButton
            onMouseDown={() => {
              setIntroductionHelp(true)
            }}
          >
            <Icon icon={faQuestion} />
          </ControlButton>
        </Controls>
        <Overlay
          content={config.introduction.guideline}
          open={introductionHelpVisible}
          setOpen={setIntroductionHelp}
        />
        {!state.hasStrategy.value ? (
          <AddButton
            title={config.strategy.placeholder}
            onClick={() => {
              state.hasStrategy.set(true)
            }}
          >
            Lösungsstrategie (optional)
          </AddButton>
        ) : null}
      </React.Fragment>
      {state.hasStrategy.value ? (
        <div style={{ position: 'relative' }}>
          <Content type={SolutionPluginTypes.strategy}>
            {state.strategy.render()}
          </Content>
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
            <ControlButton
              onMouseDown={() => {
                setStrategyHelp(true)
              }}
            >
              <Icon icon={faQuestion} />
            </ControlButton>
          </Controls>
          <Overlay
            content={config.strategy.guideline}
            open={strategyHelpVisible}
            setOpen={setStrategyHelp}
          />
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
                              {solutionStepLeft.content.render()}
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
                              showHelp={setStepHelp}
                              ids={{
                                leftId: solutionStepLeft.content.id,
                                rightId: solutionStepRight
                                  ? solutionStepRight.content.id
                                  : ''
                              }}
                            />
                            <Overlay
                              open={stepHelpVisible}
                              setOpen={setStepHelp}
                              content={
                                solutionStepRight ? (
                                  <React.Fragment>
                                    {config.step.guideline}
                                    {config.explanation.guideline}
                                  </React.Fragment>
                                ) : solutionStepLeft.type.value ===
                                  explanation ? (
                                  config.explanation.guideline
                                ) : (
                                  config.step.guideline
                                )
                              }
                            ></Overlay>
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
                  title={config.additionals.placeholder}
                  onClick={() => {
                    state.hasAdditionals.set(true)
                  }}
                >
                  Ergänzung (optional)
                </AddButton>
              )}
              {state.hasAdditionals.value ? (
                <div style={{ position: 'relative' }}>
                  <Content type={SolutionPluginTypes.additionals}>
                    {state.additionals.render()}
                  </Content>
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
                  <Overlay
                    content={config.additionals.guideline}
                    open={additionalsHelpVisible}
                    setOpen={setAdditionalsHelp}
                  />
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
