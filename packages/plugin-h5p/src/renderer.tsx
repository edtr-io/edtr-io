import { StatefulPluginEditorProps } from '@edtr-io/core'
import * as React from 'react'

import { h5pState } from '.'

// Implements functionality of https://serlo.h5p.com/js/h5p-resizer.js
export class H5pRenderer extends React.Component<
  StatefulPluginEditorProps<typeof h5pState>
> {
  public componentDidMount(): void {
    if (!this.iframe.current) {
      return
    }

    window.addEventListener('message', this.handleMessage)
  }

  public render() {
    const { state } = this.props

    if (!state.src) {
      return 'H5P (no source defined)'
    }

    return (
      <React.Fragment>
        <iframe
          ref={this.iframe}
          src={`https://serlo.h5p.com/content/${state.src()}/embed`}
          frameBorder="0"
          allowFullScreen
          allow="geolocation *; microphone *; camera *; midi *; encrypted-media *"
        />
      </React.Fragment>
    )
  }

  public componentWillUnmount(): void {
    window.removeEventListener('message', this.handleMessage)
  }

  private iframe = React.createRef<HTMLIFrameElement>()

  private handleMessage = (event: MessageEvent) => {
    const { current } = this.iframe
    if (current) {
      if (
        event.data.context !== 'h5p' ||
        current.contentWindow !== event.source
      ) {
        return
      }

      const { data } = event

      switch (data.action) {
        case 'hello': {
          current.style.width = '100%'

          // Bugfix for Chrome: Force update of iframe width. If this is not done the
          // document size may not be updated before the content resizes.
          current.getBoundingClientRect()

          // Tell iframe that it needs to resize when our window resizes
          window.addEventListener('resize', resize, false)

          // Respond to let the iframe know we can resize it
          respond('hello')
          return
        }
        case 'prepareResize': {
          if (
            current.clientHeight !== data.scrollHeight ||
            data.scrollHeight !== data.clientHeight
          ) {
            current.style.height = data.clientHeight + 'px'
            respond('resizePrepared')
          }
          return
        }
        case 'resize':
          current.style.height = data.scrollHeight + 'px'
          return
        default:
          return
      }
    }

    function resize() {
      if (current && current.contentWindow) {
        // Limit resize calls to avoid flickering
        respond('resize')
      } else {
        // Frame is gone, unregister.
        window.removeEventListener('resize', resize)
      }
    }

    function respond(action: string, data = {}) {
      if (!event.source) {
        return
      }

      const message = {
        ...data,
        action,
        context: 'h5p'
      }

      event.source.postMessage(message, event.origin as string & Transferable[])
    }
  }
}
