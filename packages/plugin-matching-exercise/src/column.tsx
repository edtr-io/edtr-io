import { styled } from '@edtr-io/ui'
import * as React from 'react'
import Masonry from 'react-masonry-component'
import posed from 'react-pose'

import { Block } from './block'
import { Block as B } from './editor'

export class Column extends React.Component<ColumnProps> {
  static defaultProps: Pick<ColumnProps, 'renderBlock' | 'Container'> = {
    renderBlock: block => {
      return block
    },
    Container: Masonry
  }
  public render() {
    const {
      blocks,
      title,
      renderBlock,
      check,
      width,
      move,
      Container
    } = this.props

    return (
      <this.Container width={width}>
        <strong>{title}</strong>
        {Container && (
          <Container>
            {blocks.map((block, index) => {
              let feedback

              if (check) {
                feedback = check[index] ? 'Richtig' : 'Falsch'
              }

              return (
                <this.AnimatedColumn key={block.id}>
                  {renderBlock(
                    <Block
                      block={block}
                      move={move ? move(index) : undefined}
                    />,
                    index
                  )}
                  {feedback}
                </this.AnimatedColumn>
              )
            })}
          </Container>
        )}
      </this.Container>
    )
  }

  private Container = styled.div<{ width?: string }>(({ width }) => {
    return {
      background: 'white',
      width,
      margin: '10px',
      padding: '3px'
    }
  })

  private AnimatedColumn = posed.div({
    enter: { opacity: 1 },
    exit: { opacity: 0 }
  })
}

export interface ColumnProps {
  blocks: B[]
  title?: string
  check?: boolean[]
  width?: string
  Container?: React.ComponentType
  move?: (index: number) => (block: B) => void
  renderBlock: (block: React.ReactNode, index: number) => React.ReactNode
}
