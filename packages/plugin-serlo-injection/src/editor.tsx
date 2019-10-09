import {
  PrimarySettings,
  EditorInput,
  OverlayInput,
  PreviewOverlay,
  styled,
  Icon,
  faNewspaper,
  Button,
  EditorButton
} from '@edtr-io/editor-ui'
import { StatefulPluginEditorProps } from '@edtr-io/plugin'
import * as React from 'react'

import { serloInjectionState } from '.'
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

const ButtonWrapper = styled.span({
  float: 'right',
  display: 'flex',
  flexDirection: 'row',

  justifyContent: 'flex-end'
})

const Clearfix = styled.div({
  clear: 'both'
})

export const SerloInjectionEditor = (
  props: StatefulPluginEditorProps<typeof serloInjectionState> & {
    renderIntoExtendedSettings?: (children: React.ReactNode) => React.ReactNode
  }
) => {
  const [cache, setCache] = React.useState(props.state.value)
  const [preview, setPreview] = React.useState(false)

  React.useEffect(() => {
    setCache(props.state.value)
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
        <PrimarySettings>
          <EditorInput
            label="Serlo ID:"
            placeholder="123456"
            value={props.state.value}
            onChange={e => {
              props.state.set(e.target.value)
            }}
            textfieldWidth="60%"
            editorInputWidth="70%"
          />
          <ButtonWrapper>
            <EditorButton
              onClick={() => {
                setCache(props.state.value)
              }}
            >
              Laden
            </EditorButton>
          </ButtonWrapper>
          <Clearfix />
        </PrimarySettings>
      ) : null}
      {props.renderIntoExtendedSettings
        ? props.renderIntoExtendedSettings(
            <React.Fragment>
              <OverlayInput
                label="Serlo ID:"
                placeholder="123456"
                value={props.state.value}
                onChange={e => {
                  props.state.set(e.target.value)
                }}
              />
              <ButtonWrapper>
                <Button
                  onClick={() => {
                    setCache(props.state.value)
                  }}
                >
                  Laden
                </Button>
              </ButtonWrapper>
              <Clearfix />
            </React.Fragment>
          )
        : null}
    </React.Fragment>
  )
}
