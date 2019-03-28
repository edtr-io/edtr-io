import { styled } from '@edtr-io/ui'
import * as R from 'ramda'
import * as React from 'react'

import { Column } from './column'
import { combineBlocks, isCorrect, isCorrectPerRow } from './helpers'
import { Row } from './row'
import { StatefulPluginEditorProps } from '@edtr-io/core'
import { matchingExerciseState } from '.'
import { Block } from './editor'

export class MatchingExerciseRenderer extends React.Component<
  StatefulPluginEditorProps<typeof matchingExerciseState>,
  MatchingExerciseRendererState
> {
  constructor(props: StatefulPluginEditorProps<typeof matchingExerciseState>) {
    super(props)

    const blocks = combineBlocks(props.state).map((item, index) => {
      return {
        id: `${index}`,
        // FIXME:
        block: item,
        content: item //<Editable id={props.state.blockContent[item]} />
      }
    })

    this.state = {
      leftSide: [],
      rightSide: [],
      stack: blocks
    }
  }

  public render() {
    const { leftSide, rightSide, stack } = this.state

    const blocks = R.zip(
      leftSide as (Block | undefined)[],
      (rightSide as (Block | undefined)[]).concat(
        R.repeat(undefined, leftSide.length - rightSide.length)
      )
    ) as [Block | undefined, Block | undefined][]
    return (
      <React.Fragment>
        <this.StackContainer>
          <Column blocks={stack} move={this.moveBlock} />
        </this.StackContainer>

        <div>
          <Row
            blocks={blocks}
            title="Funktion/Ableitung"
            state={this.props.state}
            undo={this.undo}
          />
        </div>
        <this.SubmitButton
          onClick={() => {
            const removeIncompletePairs = (): Promise<void> => {
              return new Promise(resolve => {
                if (this.state.leftSide.length > this.state.rightSide.length) {
                  let newLeftSide = [...this.state.leftSide]
                  const block = newLeftSide.pop() as Block
                  const newStack = [...this.state.stack, block]
                  this.setState(
                    { leftSide: newLeftSide, stack: newStack },
                    () => {
                      setTimeout(() => {
                        resolve()
                      }, 0)
                    }
                  )
                } else {
                  resolve()
                }
              })
            }

            removeIncompletePairs().then(() => {
              const correct = isCorrect(this.props.state, this.state)

              alert(correct ? 'Richtig' : 'Es fehlen noch Lösungen')
            })
          }}
        >
          Bin fertig :)
        </this.SubmitButton>
      </React.Fragment>
    )
  }

  private moveBlock = (index: number) => (block: Block) => {
    const side =
      this.state.leftSide > this.state.rightSide ? 'rightSide' : 'leftSide'
    const newSide = [...this.state[side]]
    newSide.push(block)
    const newStack = [...this.state.stack]
    newStack.splice(index, 1)

    this.setState(
      { [side]: newSide, stack: newStack } as Pick<
        MatchingExerciseRendererState,
        'stack' | typeof side
      >,
      () => {
        if (side === 'rightSide') {
          const test = isCorrectPerRow(this.props.state, [
            R.last(this.state.leftSide),
            R.last(this.state.rightSide)
          ])
          if (!test) {
            const newLeftSide = [...this.state.leftSide]
            const left = newLeftSide.pop()

            if (!left) {
              return
            }

            const newRightSide = [...this.state.rightSide]
            const right = newRightSide.pop()

            if (!right) {
              return
            }

            const newStack = [...this.state.stack]
            newStack.push(left, right)
            setTimeout(() => {
              this.setState({
                leftSide: newLeftSide,
                rightSide: newRightSide,
                stack: newStack
              })
            }, 2000)
          }
        }
      }
    )
  }

  private undo = (block: Block) => {
    const newLeftSide = [...this.state.leftSide]
    newLeftSide.pop()
    const newStack = [...this.state.stack]
    newStack.push(block)
    this.setState({ leftSide: newLeftSide, stack: newStack })
  }

  private StackContainer = styled.div({
    margin: '0 auto'
  })

  private SubmitButton = styled.button({
    background: 'gold',
    color: 'silver'
  })
}

export interface MatchingExerciseRendererState {
  leftSide: Block[]
  rightSide: Block[]
  stack: Block[]
}
