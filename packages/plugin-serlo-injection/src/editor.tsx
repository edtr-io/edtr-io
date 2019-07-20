import { StatefulPluginEditorProps } from '@edtr-io/core'
import * as React from 'react'

import { injectionState } from '.'
import {
  PrimarySettings,
  EditorInput,
  OverlayInput,
  PreviewOverlay,
  styled
} from '@edtr-io/editor-ui'

const Iframe = styled.iframe({ width: '100%', border: 'none' })

const createURL = (id: string) => {
  if (id.startsWith('/') || id.startsWith('\\')) {
    return (
      'https://de.serlo.org/' +
      id.substring(1, id.length) +
      '?contentOnly&hideBreadcrumbs'
    )
  }
  return 'https://de.serlo.org/' + id + '?contentOnly&hideBreadcrumbs'
}

export const SerloInjectionEditor = (
  props: StatefulPluginEditorProps<typeof injectionState> & {
    renderIntoExtendedSettings?: (children: React.ReactNode) => React.ReactNode
  }
) => {
  const iframeRef = React.useRef<HTMLIFrameElement>(null)

  React.useEffect(() => {
    // console.log('effect')
    window.addEventListener('message', e => {
      const { data } = e

      // Content width in px
      // console.log(data.contentWidth)
      // Content height in px
      // console.log(data.contentHeight)
      // console.log(data.context)

      // Context is always `serlo`
      if (data.context !== 'serlo') {
        return
      }
      // console.log(iframeRef.current)
      if (iframeRef.current) {
        iframeRef.current.setAttribute('height', data.contentHeight)
      }
    })
  }, [])
  return (
    <React.Fragment>
      <PreviewOverlay focused={props.focused || false}>
        <Iframe
          key={props.state.value}
          ref={iframeRef}
          src={createURL(props.state.value)}
        />
      </PreviewOverlay>
      {props.focused ? (
        <PrimarySettings>
          <EditorInput
            label="Serlo ID:"
            placeholder="123456"
            value={props.state.value}
            onChange={e => {
              props.state.set(e.target.value)
            }}
            textfieldWidth="30%"
            editorInputWidth="100%"
          />
        </PrimarySettings>
      ) : null}
      {props.renderIntoExtendedSettings
        ? props.renderIntoExtendedSettings(
            <OverlayInput
              label="Serlo ID:"
              placeholder="123456"
              value={props.state.value}
              onChange={e => {
                props.state.set(e.target.value)
              }}
            />
          )
        : null}
    </React.Fragment>
  )
}
