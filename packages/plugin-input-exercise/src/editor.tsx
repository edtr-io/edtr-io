import { StatefulPluginEditorProps } from '@edtr-io/core'
import * as R from 'ramda'
import * as React from 'react'

import { InputExerciseRenderer } from './renderer'
import { inputExerciseState } from '.'
import { faTrashAlt, faPlus, Icon } from '@edtr-io/editor-ui'
import { Feedback } from '@edtr-io/renderer-ui'

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
            <div> Richtig? </div>
            {state.answers().map((answer, index: number) => {
              return (
                <div key={index}>
                  <input
                    type="checkbox"
                    checked={answer.isCorrect()}
                    onChange={() =>
                      state
                        .answers()
                        [index].isCorrect.set(
                          !state.answers()[index].isCorrect()
                        )
                    }
                  />
                  <label>
                    <input
                      type="text"
                      value={answer.value()}
                      placeholder="richtige Antwort eingeben"
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        state.answers()[index].value.set(event.target.value)
                      }
                    />
                  </label>
                  <button onClick={() => state.answers.remove(index)}>
                    <Icon icon={faTrashAlt} />
                  </button>
                  <button
                    onClick={() => state.answers()[index].hasFeedback.set(true)}
                  >
                    <Icon icon={faPlus} /> Feedback
                  </button>
                  {state.answers()[index].hasFeedback() ? (
                    <Feedback isTrueAnswer={state.answers()[index].isCorrect()}>
                      {state.answers()[index].feedback.render()}
                    </Feedback>
                  ) : null}
                </div>
              )
            })}
            <button onClick={() => state.answers.insert()}>
              <Icon icon={faPlus} /> Antwort
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
