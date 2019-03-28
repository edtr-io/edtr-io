import { styled } from '@edtr-io/ui'
import * as React from 'react'
import posed, { PoseGroup } from 'react-pose'
import * as R from 'ramda'

import { Block } from './block'
import { isCorrectPerRow } from './helpers'
import { Block as B } from './editor'
import { StatefulPluginEditorProps } from '@edtr-io/core'
import { matchingExerciseState } from '.'

export class Row extends React.Component<
  StatefulPluginEditorProps<typeof matchingExerciseState> & RowProps
> {
  static defaultProps: Pick<RowProps, 'renderBlock' | 'renderRow'> = {
    renderBlock: block => {
      return block
    },
    renderRow: row => {
      return row
    }
  }
  public render() {
    const {
      blocks,
      title,
      renderBlock,
      state,
      undo,
      preview,
      renderRow
    } = this.props

    const rows = [...blocks]
    const last = R.last(blocks)
    const lastRowComplete = Boolean(!last || (last[0] && last[1]))

    if (lastRowComplete) {
      rows.push([undefined, undefined])
    }

    return (
      <this.Container>
        <strong>{title}</strong>
        <PoseGroup>
          {rows.map(([leftBlock, rightBlock], index) => {
            let correct = false
            let wrong = false
            if (leftBlock && rightBlock) {
              const test = isCorrectPerRow(state, [leftBlock, rightBlock])
              correct = test
              wrong = !test
            }
            return (
              <this.AnimatedRow key={index}>
                {renderRow(
                  <React.Fragment>
                    <this.Column>
                      {leftBlock ? (
                        renderBlock(
                          <Block
                            block={leftBlock}
                            active
                            correct={preview ? false : correct}
                            wrong={preview ? false : wrong}
                            move={rightBlock ? undefined : undo}
                          />,
                          index
                        )
                      ) : (
                        <this.BlockPlaceholder />
                      )}
                    </this.Column>
                    <this.Column>
                      {rightBlock ? (
                        renderBlock(
                          <Block
                            block={rightBlock}
                            active
                            correct={preview ? false : correct}
                            wrong={preview ? false : wrong}
                          />,
                          index
                        )
                      ) : leftBlock ? (
                        <this.BlockPlaceholder />
                      ) : null}
                    </this.Column>
                  </React.Fragment>,
                  index
                )}
              </this.AnimatedRow>
            )
          })}
        </PoseGroup>
      </this.Container>
    )
  }

  private Container = styled.div({ margin: '10px' })

  private AnimatedRow = styled(
    posed.div({
      enter: { opacity: 1 },
      exit: { opacity: 0 }
    })
  )({
    display: 'flex',
    background: 'white',
    padding: '3px',
    margin: '7px',
    minHeight: '40px'
  })

  private Column = styled.div({
    width: '50%'
  })

  private BlockPlaceholder = styled.div({
    border: '3px dashed #d9edf7',
    height: 'calc(100% - 10px)',
    margin: '5px'
  })
}

export interface RowProps {
  blocks: [B | undefined, B | undefined][]
  title?: string
  preview?: boolean
  undo?: (block: B) => void
  renderRow: (row: React.ReactNode, index: number) => React.ReactNode
  renderBlock: (block: React.ReactNode, index: number) => React.ReactNode
}
