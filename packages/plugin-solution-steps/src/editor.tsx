import { useScopedSelector } from '@edtr-io/core'
import {
  AddButton,
  styled,
  Icon,
  faTimes,
  faLevelDownAlt,
  faLevelUpAlt
} from '@edtr-io/editor-ui'
import { StatefulPluginEditorProps } from '@edtr-io/plugin'
import { hasFocusedDescendant, isFocused } from '@edtr-io/store'
import * as React from 'react'

import { solutionStepsState } from '.'
import { SolutionStepsRenderer } from './renderer'

export const BigFlex = styled.div({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap'
})

const Buttoncontainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  marginTop: '5px',
  width: '100%'
})
const Container = styled.div<{ type: string; isHalf: boolean }>(
  ({ type, isHalf }: { type: string; isHalf: boolean }) => {
    return {
      marginTop: '10px',
      boxShadow: ` 0 1px 3px 0 ${type === 'step' ? 'black' : 'blue'}`,
      padding: '10px 0',
      width: isHalf ? '50%' : '100%'
    }
  }
)
const RemoveButton = styled.button({
  borderRadius: '50%',
  outline: 'none',
  background: 'white',
  zIndex: 20,
  float: 'right',
  transform: 'translate(50%, -40%)',
  '&:hover': {
    border: '3px solid #007ec1',
    color: '#007ec1'
  }
})

function AddButtons(
  props: StatefulPluginEditorProps<typeof solutionStepsState> & {
    id: string
    index: number
  }
) {
  const hasFocusedChild = useScopedSelector(hasFocusedDescendant(props.id))

  const insertStep = () => {
    props.state.solutionSteps.insert(props.index + 1)
  }
  const insertExplanation = () => {
    props.state.solutionSteps.insert(props.index + 1, {
      type: 'explanation',
      content: { plugin: 'rows' },
      isHalf: false
    })
  }
  return (
    <React.Fragment>
      {hasFocusedChild || props.id === '' ? (
        <Buttoncontainer>
          <AddButton onClick={insertStep}>Lösungsbestandteil</AddButton>
          <AddButton onClick={insertExplanation}>
            Erklärungsbestandteil
          </AddButton>
        </Buttoncontainer>
      ) : null}
    </React.Fragment>
  )
}

export function SolutionStepsEditor(
  props: StatefulPluginEditorProps<typeof solutionStepsState>
) {
  const { state, editable } = props
  const { solutionSteps } = state
  const introductionFocused = useScopedSelector(
    isFocused(state.introduction.id)
  )
  return (
    <React.Fragment>
      {editable ? (
        <React.Fragment>
          {state.introduction.render()}
          {introductionFocused ? (
            <AddButtons index={-1} id="" {...props} />
          ) : null}
          <BigFlex>
            {solutionSteps.map((solutionStep, index) => {
              return (
                <React.Fragment key={solutionStep.content.id}>
                  <Container
                    type={solutionStep.type.value}
                    isHalf={solutionStep.isHalf.value}
                  >
                    <RemoveButton
                      onClick={() => {
                        solutionSteps.remove(index)
                      }}
                    >
                      <Icon icon={faTimes} />
                    </RemoveButton>

                    {solutionStep.content.render()}
                    {index > 0 &&
                    solutionStep.type.value === 'explanation' &&
                    solutionSteps[index - 1].type.value === 'step' ? (
                      <RemoveButton
                        onClick={() => {
                          solutionStep.isHalf.set(!solutionStep.isHalf.value)
                          solutionSteps[index - 1].isHalf.set(
                            !solutionSteps[index].isHalf.value
                          )
                        }}
                      >
                        <Icon
                          icon={
                            solutionStep.isHalf.value
                              ? faLevelDownAlt
                              : faLevelUpAlt
                          }
                        />
                      </RemoveButton>
                    ) : null}
                  </Container>
                  {index < solutionSteps.length - 1 &&
                  !(
                    solutionStep.type.value === 'step' &&
                    solutionStep.isHalf.value
                  ) ? (
                    <AddButtons
                      id={solutionStep.content.id}
                      index={index}
                      {...props}
                    />
                  ) : null}
                </React.Fragment>
              )
            })}
            {solutionSteps.length > 0 ? (
              <AddButtons index={solutionSteps.length} id="" {...props} />
            ) : null}
          </BigFlex>
        </React.Fragment>
      ) : (
        <SolutionStepsRenderer {...props} />
      )}
    </React.Fragment>
  )
}
