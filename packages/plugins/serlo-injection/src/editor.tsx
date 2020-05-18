import { OverlayInput } from '@edtr-io/core'
import {
  EditorInlineSettings,
  EditorInput,
  PreviewOverlay,
  styled,
} from '@edtr-io/editor-ui/internal'
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
  textAlign: 'center',
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
          onChange={(nextActive) => {
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
            label={props.config.i18n.label}
            placeholder={props.config.i18n.placeholder}
            value={props.state.value}
            onChange={(e) => {
              props.state.set(e.target.value)
            }}
            width="30%"
            inputWidth="100%"
            ref={props.autofocusRef}
          />
        </EditorInlineSettings>
      ) : null}
      {props.renderIntoSettings(
        <OverlayInput
          label={props.config.i18n.label}
          placeholder={props.config.i18n.placeholder}
          value={props.state.value}
          onChange={(e) => {
            props.state.set(e.target.value)
          }}
        />
      )}
    </React.Fragment>
  )
}
