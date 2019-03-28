import { Column, Row, MatchingExerciseRenderer, matchingExerciseState } from '.'
import { Icon, faPlus, faMinus, styled, faCheck } from '@edtr-io/ui'
import * as R from 'ramda'
import * as React from 'react'
import { StatefulPluginEditorProps } from '@edtr-io/core'

export class MatchingExerciseEditor extends React.Component<
  StatefulPluginEditorProps<typeof matchingExerciseState>,
  MatchingExerciseState
> {
  public state = {
    leftSide: [] as Block[],
    rightSide: [] as Block[]
  }
  removeButtonStack = (rowIndex: number) => () => {
    const { state } = this.props

    state.blockContent.remove(rowIndex)
  }
  removeButtonSolution = (rowIndex: number) => () => {
    const { leftSide, rightSide } = this.state
    const newLeftSide = [...leftSide]
    const newRightSide = [...rightSide]

    newLeftSide.splice(rowIndex, 1)
    newRightSide.splice(rowIndex, 1)

    this.setState({ leftSide: newLeftSide, rightSide: newRightSide }, () => {
      const { state } = this.props

      state.solution.remove(rowIndex)
    })
  }
  addButtonStack = () => {
    const { state } = this.props

    state.blockContent.insert()
  }
  addButtonSolution = () => {
    const { state } = this.props
    state.solution.insert()
  }
  private moveBlock = (index: number) => (block: Block) => {
    const side =
      this.state.leftSide > this.state.rightSide ? 'rightSide' : 'leftSide'
    const newSide = [...this.state[side]]
    newSide.push(block)

    this.setState(
      { [side]: newSide } as Pick<MatchingExerciseState, typeof side>,
      () => {
        if (side === 'rightSide') {
          //TODO
          const { state } = this.props
          const { leftSide, rightSide } = this.state
          const index = state.solution.length
          console.log(state.solution())
          state.solution.insert(index, {
            number1: leftSide[leftSide.length - 1].block,
            number2: rightSide[rightSide.length - 1].block
          })
          console.log(state.solution())
          // state
          //   .solution()
          //   [index].number1.set(leftSide[leftSide.length - 1].block)
          // state
          //   .solution()
          //   [index].number2.set(rightSide[rightSide.length - 1].block)
        }
      }
    )
  }

  public render() {
    const { blockContent } = this.props.state
    const stack: Block[] = blockContent().map((block, index) => {
      const content = block.content.render()
      return {
        id: `stack-${block.content.id}`,
        block: index,
        content: content
      }
    })

    if (!this.props.editable) {
      return <MatchingExerciseRenderer {...this.props} />
    }
    const leftSide = this.state.leftSide
    const rightSide = this.state.rightSide
    const blocks = R.zip(
      leftSide as (Block | undefined)[],
      (rightSide as (Block | undefined)[]).concat(
        R.repeat(undefined, leftSide.length - rightSide.length)
      )
    ) as [Block | undefined, Block | undefined][]
    return (
      <React.Fragment>
        <Column
          blocks={stack}
          Container={this.StackContainer}
          renderBlock={(block, index) => {
            return (
              <this.BlockContainer>
                {' '}
                <this.BlockContainerInner>
                  {block}
                </this.BlockContainerInner>{' '}
                <this.IconButton
                  onClick={() => this.moveBlock(index)(stack[index])}
                >
                  <Icon icon={faCheck} />
                </this.IconButton>
                <this.IconButton onClick={this.removeButtonStack(index)}>
                  <Icon icon={faMinus} />
                </this.IconButton>
              </this.BlockContainer>
            )
          }}
        />
        <this.AddButton onClick={this.addButtonStack}>
          <Icon icon={faPlus} />
        </this.AddButton>
        <div>
          <Row
            blocks={blocks}
            title="Funktion/Ableitung"
            state={this.props.state}
            preview
            renderRow={(row, index) => {
              return (
                <React.Fragment>
                  {row}
                  <this.IconButton onClick={this.removeButtonSolution(index)}>
                    <Icon icon={faMinus} />
                  </this.IconButton>
                </React.Fragment>
              )
            }}
          />
        </div>
      </React.Fragment>
    )
  }

  private StackContainer = styled.div({})
  private BlockContainerInner = styled.div({ flexGrow: 1 })
  private BlockContainer = styled.div({ display: 'flex', alignItems: 'center' })
  private AddButton = styled.button({
    borderRadius: '50%',
    outline: 'none',
    width: '35px',
    height: '35px',
    border: 'none',
    margin: 'auto',
    display: 'block'
  })
  private IconButton = styled(this.AddButton)({
    margin: '5px'
  })
}

export interface MatchingExerciseState {
  leftSide: Block[]
  rightSide: Block[]
}

export interface Block {
  id: string
  block: number
  content: React.ReactNode
}
