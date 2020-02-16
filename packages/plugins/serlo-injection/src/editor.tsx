import { OverlayInput } from '@edtr-io/core'
import {
  EditorInlineSettings,
  EditorInput,
  PreviewOverlay,
  styled
} from '@edtr-io/editor-ui'
import { Icon, faNewspaper } from '@edtr-io/ui'
import * as React from 'react'

import { SerloInjectionProps } from '.'
import { SerloInjectionRenderer } from './renderer'

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

const PlaceholderWrapper = styled.div({
  position: 'relative',
  width: '100%',
  textAlign: 'center'
})

export const SerloInjectionEditor = (props: SerloInjectionProps) => {
  const [cache, setCache] = React.useState(props.state.value)
  const [preview, setPreview] = React.useState(false)

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setCache(props.state.value)
    }, 2000)
    return () => {
      clearTimeout(timeout)
    }
  }, [props.focused, props.state.value])

  if (!props.editable) {
    return <SerloInjectionRenderer src={createURL(props.state.value)} />
  }

  return (
    <React.Fragment>
      {cache ? (
        <PreviewOverlay
          focused={props.focused || false}
          onChange={nextActive => {
            setPreview(nextActive)
            if (nextActive) {
              setCache(props.state.value)
            }
          }}
        >
          <SerloInjectionRenderer src={createURL(cache)} />
        </PreviewOverlay>
      ) : (
        <PlaceholderWrapper>
          <Icon icon={faNewspaper} size="5x" />
        </PlaceholderWrapper>
      )}
      {props.focused && !preview ? (
        <EditorInlineSettings>
          <EditorInput
            label="Serlo ID:"
            placeholder="123456"
            value={props.state.value}
            onChange={e => {
              props.state.set(e.target.value)
            }}
            textfieldWidth="30%"
            editorInputWidth="100%"
            ref={props.defaultFocusRef}
          />
        </EditorInlineSettings>
      ) : null}
      {props.renderIntoSettings(
        <React.Fragment>
          <OverlayInput
            label="Serlo ID:"
            placeholder="123456"
            value={props.state.value}
            onChange={e => {
              props.state.set(e.target.value)
            }}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  )
}
