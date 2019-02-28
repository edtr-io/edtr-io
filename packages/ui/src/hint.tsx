import * as React from 'react'
import { styled } from '@edtr-io/ui'

export class Hint extends React.Component<HintProps, HintState> {
  public state: HintState = { hideContent: true }

  public render() {
    const { children, kind, shown } = this.props
    const hideContent = !shown && this.state.hideContent

    return (
      <this.Wrapper hideContent={hideContent}>
        <this.Toggle onClick={this.onToggle}>
          <a>
            {kind} {this.showTitle()}
            {hideContent ? (
              <span className="fa fa-caret-down" />
            ) : (
              <span className="fa fa-caret-up" />
            )}
          </a>
        </this.Toggle>
        <this.Content hideContent={hideContent}>{children}</this.Content>
      </this.Wrapper>
    )
  }
  private showTitle(): React.ReactNode {
    const { title } = this.props

    if (!title) {
      return null
    }

    return <React.Fragment>({title})&nbsp;</React.Fragment>
  }

  private onToggle = () => {
    this.setState({ hideContent: !this.state.hideContent })
  }

  private Wrapper = styled.div<{ hideContent?: boolean }>(({ hideContent }) => {
    return {
      marginTop: '12px',
      marginBottom: '20px',
      border: hideContent ? '1px solid transparent' : '1px solid #d9edf7',
      borderRadius: '2px',
      boxShadow: hideContent
        ? '0 1px 1px rgba(0, 0, 0, 0)'
        : '0 1px 1px rgba(0, 0, 0, 0.05)'
    }
  })

  private Toggle = styled.div<{ hideContent?: boolean }>(({ hideContent }) => {
    return {
      backgroundColor: hideContent ? 'transparent' : '#d9edf7',
      padding: '10px 15px 10px 10px',
      borderColor: hideContent ? 'transparent' : '#d9edf7',
      textAlign: 'left',
      cursor: 'pointer'
    }
  })

  private Content = styled.div<{ hideContent?: boolean }>(({ hideContent }) => {
    return { display: hideContent ? 'none' : 'block' }
  })
}

export interface HintProps {
  title: React.ReactNode
  kind: string
  shown?: boolean
}

interface HintState {
  hideContent: boolean
}
