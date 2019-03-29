import { StatefulPluginEditorProps } from '@edtr-io/core'
import axios from 'axios'
import { debounce } from 'lodash'
import * as React from 'react'

import { injectionState } from '.'

export class InjectionRenderer extends React.Component<
  InjectionRendererProps,
  InjectionRendererState
> {
  public state: InjectionRendererState = {}

  public render() {
    const { state, disableCursorEvents } = this.props
    const { loaded } = this.state

    if (loaded) {
      return (
        <div className="panel panel-default">
          <div
            className="panel-body"
            dangerouslySetInnerHTML={{ __html: loaded }}
          />
        </div>
      )
    }

    return (
      <div>
        <a
          href={state.src()}
          onClick={
            disableCursorEvents
              ? e => {
                  e.preventDefault()
                }
              : undefined
          }
        >
          {state.alt() || 'Injection'}
        </a>
      </div>
    )
  }

  public componentDidMount(): void {
    if (!this.state.loaded && this.props.state.src) {
      this.createRequest(this.props.state.src())
    }
  }

  public UNSAFE_componentWillReceiveProps(
    nextProps: InjectionRendererProps
  ): void {
    if (this.props.state.src !== nextProps.state.src) {
      this.createRequest(nextProps.state.src())
    }
  }

  private createRequest = debounce((src: string): void => {
    src = this.correctUrl(src)
    axios
      .get<{ response: string }>(src)
      .then(({ data }) => {
        this.setState({ loaded: JSON.parse(data.response) })
      })
      .catch(() => {
        this.setState({
          loaded: '<div class="alert alert-info">Illegal injection found </div>'
        })
      })
  }, 500)

  private correctUrl(src: string): string {
    const url = src.split('/')
    // Url does start with http
    if (url[0] === 'http:' || url[0] === 'https:') {
      // is invalid for injections, but do nothing
      return url.join('/')
    }

    // first item is empty, means there already is a leading slash
    if (url[0] === '') {
      url.shift()
    }

    // Url does not start with / or http
    return '/' + url.join('/')
  }
}

export type InjectionRendererProps = StatefulPluginEditorProps<
  typeof injectionState
> & {
  disableCursorEvents?: boolean
}

export interface InjectionRendererState {
  loaded?: string
}
