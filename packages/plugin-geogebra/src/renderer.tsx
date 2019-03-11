import axios from 'axios'
import { debounce } from 'lodash'
import * as React from 'react'
import { v4 } from 'uuid'
import { StatefulPluginEditorProps } from '@edtr-io/core'
import { geogebraState } from '.'

const cache: { [src: string]: { width: number; height: number } } = {}

export class GeogebraRenderer extends React.Component<
  GeogebraRendererProps,
  GeogebraRendererState
> {
  public state = {
    id: 'gtApplet' + v4(),
    width: 800,
    height: 500
  }

  public render(): React.ReactNode {
    const { state, disableCursorEvents } = this.props
    const { width, height } = this.state
    return (
      <div>
        {state.value ? (
          <iframe
            title={state.value}
            scrolling="no"
            src={'https://www.geogebra.org/material/iframe/id/' + state.value}
            width={width}
            height={height}
            style={{
              border: '0px',
              pointerEvents: disableCursorEvents ? 'none' : 'auto'
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              textAlign: 'center',
              border: '2px lightgrey solid',
              borderRadius: '4px',
              padding: '10px'
            }}
          >
            <img
              src="https://cdn.geogebra.org/static/img/GeoGebra-logo.png"
              alt="Geogebra"
            />
          </div>
        )}
      </div>
    )
  }

  public componentDidMount(): void {
    this.mounted = true
    this.requestHeight(this.props.state.value)
  }

  public UNSAFE_componentWillReceiveProps(
    nextProps: Readonly<GeogebraRendererProps>
  ): void {
    if (this.props.state.value !== nextProps.state.value) {
      this.requestHeight(nextProps.state.value)
    }
  }

  public componentWillUnmount(): void {
    this.mounted = false
  }

  private mounted = false

  private requestHeight = debounce((src?: string) => {
    if (!this.mounted) {
      return
    }

    if (!src) {
      return
    }

    if (cache[src]) {
      this.setState(cache[src])
      return
    }

    axios
      .post(
        'https://www.geogebra.org/api/json.php',
        {
          request: {
            '-api': '1.0.0',
            task: {
              '-type': 'fetch',
              fields: {
                field: [{ '-name': 'width' }, { '-name': 'height' }]
              },
              filters: {
                field: [{ '-name': 'id', '#text': src }]
              },
              limit: { '-num': '1' }
            }
          }
        },
        // TODO: This is a (temporary?) workaround since GeoGebra Materials API doesn't handle preflight
        // requests correctly.
        {
          headers: {
            'Content-Type': 'text/plain'
          }
        }
      )
      .then(res => {
        if (this.mounted) {
          const { width, height } = res.data.responses.response.item
          const newState = { width: width, height: height }
          cache[src] = newState
          this.setState(newState)
        }
      })
  }, 500)
}

export type GeogebraRendererProps = StatefulPluginEditorProps<
  typeof geogebraState
> & {
  disableCursorEvents?: boolean
}

export interface GeogebraRendererState {
  id: string
  width: number
  height: number
}
