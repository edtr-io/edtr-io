import * as React from 'react'
import { StatefulPluginEditorProps } from '@edtr-io/plugin'
import { solutionStepsState } from '.'
import {
  AddButton,
  styled,
  Icon,
  faTimes,
  faLevelDownAlt,
  faLevelUpAlt
} from '@edtr-io/editor-ui'
import { useScopedSelector } from '@edtr-io/core'
import { hasFocusedDescendant, isFocused } from '@edtr-io/store'
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
    id?: string
    index: number
  }
) {
  const hasFocusedChild = props.id
    ? useScopedSelector(hasFocusedDescendant(props.id))
    : true
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
      {hasFocusedChild ? (
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
  const findPairs = () => {}
  return (
    <React.Fragment>
      {editable ? (
        <React.Fragment>
          {state.introduction.render()}
          {introductionFocused ? <AddButtons index={-1} {...props} /> : null}
          <BigFlex>
            {solutionSteps.map((solutionStep, index) => {
              return (
                <React.Fragment>
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
                    {solutionStep.type.value === 'explanation' &&
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
                  {index < solutionSteps.length - 1 ? (
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
              <AddButtons index={solutionSteps.length} {...props} />
            ) : null}
          </BigFlex>
        </React.Fragment>
      ) : (
        <SolutionStepsRenderer {...props} />
      )}
    </React.Fragment>
  )
}
