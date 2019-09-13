import { StatefulPluginEditorProps } from '@edtr-io/plugin'
import { Feedback, styled } from '@edtr-io/renderer-ui'
import * as R from 'ramda'
import * as React from 'react'

import { inputExerciseState } from '.'
import { InputExerciseRenderer } from './renderer'

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
        {editable ? (
          <React.Fragment>
            <InputExerciseRenderer {...this.props} />
            {Array.from(state.correctAnswers).map(
              (correctAnswer, index: number) => {
                return (
                  <div key={index}>
                    <label>
                      richtige Antwort:
                      <input
                        type="text"
                        value={correctAnswer.value}
                        placeholder="richtige Antwort eingeben"
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) =>
                          state.correctAnswers[index].set(event.target.value)
                        }
                      />
                    </label>
                    <button onClick={() => state.correctAnswers.remove(index)}>
                      Löschen {/* <FontAwesomeIcon icon={faTrashAlt} /> */}
                    </button>
                  </div>
                )
              }
            )}
            <button onClick={() => state.correctAnswers.insert()}>
              Richtige Antwort hinzufügen
            </button>
            {Array.from(state.wrongAnswers).map(
              (wrongAnswer, index: number) => {
                return (
                  <div key={index}>
                    <label>
                      falsche Antwort:
                      <input
                        type="text"
                        value={wrongAnswer.value.get()}
                        placeholder="falsche Antwort eingeben"
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) =>
                          state.wrongAnswers[index].value.set(
                            event.target.value
                          )
                        }
                      />
                    </label>
                    <button onClick={() => state.wrongAnswers.remove(index)}>
                      Löschen {/* <FontAwesomeIcon icon={faTrashAlt} /> */}
                    </button>
                    {wrongAnswer.feedback ? (
                      <this.Label>
                        Feedback:
                        <Feedback>{wrongAnswer.feedback.render()}</Feedback>
                      </this.Label>
                    ) : null}
                  </div>
                )
              }
            )}
            <button onClick={() => state.wrongAnswers.insert()}>
              Falsche Antwort hinzufügen
            </button>
          </React.Fragment>
        ) : (
          <InputExerciseRenderer {...this.props} />
        )}
        {focused ? (
          <React.Fragment>
            <hr />
            Wähle den Antworttyp:
            <select
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                state.type.set(this.translateDataName(event.target.value))
              }
              value={this.translateDataType(state.type.value)}
            >
              {R.map(dataType => {
                return (
                  <option key={dataType.name} value={dataType.name}>
                    {dataType.name}
                  </option>
                )
              }, types)}
            </select>
          </React.Fragment>
        ) : null}
      </React.Fragment>
    )
  }

  private Label = styled.label({ clear: 'both' })
}
