import * as React from 'react'
import { StateType, StatefulPluginEditorProps } from '@edtr-io/core'

import { styled, faCaretSquareDown, faCaretSquareUp, Icon } from '@edtr-io/ui'

export const expandableBoxState = StateType.object({
  title: StateType.string(''),
  content: StateType.child()
})
export class ExpandableBox extends React.Component<
  ExpandableBoxProps,
  HintState
> {
  public state: HintState = { hideContent: true }

  public render() {
    const { state, kind, editable } = this.props
    const hideContent = !editable && this.state.hideContent

    return (
      <this.Wrapper hideContent={hideContent} kind={kind}>
        <this.Toggle onClick={this.onToggle} kind={kind}>
          {!editable ? (
            hideContent ? (
              <Icon icon={faCaretSquareDown} />
            ) : (
              <Icon icon={faCaretSquareUp} />
            )
          ) : null}
          <a>
            {kind} {this.showTitle()}
          </a>
        </this.Toggle>
        <this.Content hideContent={hideContent}>
          {state.content.render()}
        </this.Content>
      </this.Wrapper>
    )
  }

  private showTitle(): React.ReactNode {
    const { state, editable, kind } = this.props

    if (editable) {
      return (
        <input
          onChange={e => state.title.set(e.target.value)}
          value={state.title()}
          placeholder={
            kind === 'Spoiler' ? 'Titel eingeben' : 'Zusätzlicher Name'
          }
        />
      )
    }
    if (!state.title()) {
      return null
    }
    return <React.Fragment>({state.title()})&nbsp;</React.Fragment>
  }

  private onToggle = () => {
    this.setState({ hideContent: !this.state.hideContent })
  }

  private Wrapper = styled.div<{ hideContent?: boolean; kind?: string }>(
    ({ hideContent, kind }) => {
      return {
        marginTop: '12px',
        marginBottom: '20px',
        border: hideContent
          ? '1px solid transparent'
          : kind === 'Lösung'
          ? '1px solid #d9edf7'
          : kind === 'Hinweis'
          ? '1px solid #a7d21d'
          : '1px solid #f5f5f5',
        borderRadius: '2px',
        boxShadow: hideContent
          ? '0 1px 1px rgba(0, 0, 0, 0)'
          : '0 1px 1px rgba(0, 0, 0, 0.05)'
      }
    }
  )

  private Toggle = styled.div<{ hideContent?: boolean; kind?: string }>(
    ({ hideContent, kind }) => {
      return {
        backgroundColor: hideContent
          ? 'transparent'
          : kind === 'Lösung'
          ? '#d9edf7'
          : kind === 'Hinweis'
          ? '#a7d21d'
          : '#f5f5f5',
        padding: '10px 15px 10px 10px',
        position: 'relative',
        borderColor: hideContent
          ? 'transparent'
          : kind === 'Lösung'
          ? '#d9edf7'
          : kind === 'Hinweis'
          ? '#a7d21d'
          : '#f5f5f5',
        textAlign: 'left',
        cursor: 'pointer',
        '& .fa': {
          position: 'absolute',
          bottom: '13px',
          left: '15px'
        }
      }
    }
  )

  private Content = styled.div<{ hideContent?: boolean }>(({ hideContent }) => {
    return { display: hideContent ? 'none' : 'block' }
  })
}

export type ExpandableBoxProps = StatefulPluginEditorProps<
  typeof expandableBoxState
> & {
  kind?: string
}
export interface HintProps {
  title: React.ReactNode
  kind: string
  shown?: boolean
}

interface HintState {
  hideContent: boolean
}
