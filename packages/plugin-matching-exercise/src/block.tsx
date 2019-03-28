import { styled } from '@edtr-io/ui'
import * as React from 'react'
import posed from 'react-pose'

import { Block as B } from './editor'

export class Block extends React.Component<BlockProps> {
  public render() {
    const { block, move, active, correct, wrong } = this.props
    let pose = 'nonActive'
    if (correct) {
      pose = 'correct'
    } else if (wrong) {
      pose = 'wrong'
    } else if (active) {
      pose = 'active'
    }

    return (
      <this.AnimatedBlock
        pose={pose}
        initialPose={active ? 'active' : 'nonActive'}
        movable={!!move}
        onClick={() => {
          if (move) {
            move(block)
          }
        }}
      >
        {block.content}
      </this.AnimatedBlock>
    )
  }

  private AnimatedBlock = styled(
    posed.div({
      nonActive: { background: '#f8f8f8' },
      active: { background: '#d9edf7' },
      correct: { background: '#95bc1a', transition: { delay: 1000 } },
      wrong: { background: '#f7b07c', transition: { delay: 1000 } }
    })
  )(({ movable }) => {
    return {
      margin: '5px',
      padding: '5px',
      color: 'black',
      textAlign: 'center',

      ['&:hover']: movable
        ? {
            background: '#d9edf7 !important',
            cursor: 'pointer'
          }
        : {}
    }
  })
}

export interface BlockProps {
  block: B
  active?: boolean
  move?: (block: B) => void
  correct?: boolean
  wrong?: boolean
}
