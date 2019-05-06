import { StatefulPluginEditorProps } from '@edtr-io/core'
import * as R from 'ramda'
import * as React from 'react'

import { InputExerciseRenderer } from './renderer'
import { inputExerciseState } from '.'
import { faTrashAlt, faPlus, styled, Icon } from '@edtr-io/editor-ui'

const types = [
  {
    name: 'Text',
    type: 'input-string-normalized-match-challenge'
  },
  {
    name: 'Zahl',
    type: 'input-number-exact-match-challenge'
  },
  {
    name: 'Ausdruck',
    type: 'input-expression-equal-match-challenge'
  }
]

const FloatRightButton = styled.button({
  float: 'right'
})
export class InputExerciseEditor extends React.Component<
  StatefulPluginEditorProps<typeof inputExerciseState>
> {
  private translateDataType(type: string) {
    for (let i = 0; i < types.length; i++) {
      if (type === types[i].type) return types[i].name
    }
    return ''
  }
  private translateDataName(name: string) {
    for (let i = 0; i < types.length; i++) {
      if (name === types[i].name) return types[i].type
    }
    return ''
  }

  public render() {
    const { editable, state, focused } = this.props

    return (
      <React.Fragment>
        <InputExerciseRenderer {...this.props} />
        {editable && focused ? (
          <React.Fragment>
            {state.correctAnswers().map((correctAnswer, index: number) => {
              return (
                <div key={index}>
                  <label>
                    richtige Antwort:
                    <input
                      type="text"
                      value={correctAnswer.value}
                      placeholder="richtige Antwort eingeben"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        state.correctAnswers()[index].set(event.target.value)
                      }
                    />
                  </label>
                  <button onClick={() => state.correctAnswers.remove(index)}>
                    <Icon icon={faTrashAlt} />
                  </button>
                </div>
              )
            })}
            <button onClick={() => state.correctAnswers.insert()}>
              <Icon icon={faPlus} /> richtige Antwort
            </button>
            {state.wrongAnswers().map((wrongAnswer, index: number) => {
              return (
                <div key={index}>
                  <label>
                    falsche Antwort:
                    <input
                      type="text"
                      value={wrongAnswer.value()}
                      placeholder="falsche Antwort eingeben"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        state
                          .wrongAnswers()
                          [index].value.set(event.target.value)
                      }
                    />
                  </label>
                  <button onClick={() => state.wrongAnswers.remove(index)}>
                    <Icon icon={faTrashAlt} />
                  </button>
                  <label>
                    Feedback:
                    <input
                      type="text"
                      value={wrongAnswer.feedback()}
                      placeholder="Gib dein Feedback ein!"
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        state
                          .wrongAnswers()
                          [index].feedback.set(event.target.value)
                      }}
                    />
                  </label>
                </div>
              )
            })}
            <button onClick={() => state.wrongAnswers.insert()}>
              <Icon icon={faPlus} /> falsche Antwort
            </button>
            <div>
              Wähle den Antworttyp:
              <select
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                  state.type.set(this.translateDataName(event.target.value))
                }
                value={this.translateDataType(state.type())}
              >
                {R.map(dataType => {
                  return (
                    <option key={dataType.name} value={dataType.name}>
                      {dataType.name}
                    </option>
                  )
                }, types)}
              </select>
            </div>
          </React.Fragment>
        ) : null}
      </React.Fragment>
    )
  }
}
