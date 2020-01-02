import {
  OverlayButton,
  OverlayCheckbox,
  OverlayInput,
  OverlayTextarea
} from '@edtr-io/core'
import { EditorButton, EditorInput, PrimarySettings } from '@edtr-io/editor-ui'
import { isTempFile, usePendingFileUploader } from '@edtr-io/plugin'
import {
  EditorThemeProps,
  Icon,
  faImages,
  faRedoAlt,
  styled
} from '@edtr-io/ui'
import * as React from 'react'

import { ImagePluginConfig, ImageProps } from '.'
import { ImageRenderer } from './renderer'
import { Upload } from './upload'

const ImgPlaceholderWrapper = styled.div({
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

const OverlayButtonWrapper = styled.div({
  marginTop: '5px',
  textAlign: 'right'
})

const Failed = styled.div<EditorThemeProps>(props => {
  return {
    fontWeight: 'bold',
    color: props.theme.editor.danger.background
  }
})

export function ImageEditor(props: ImageProps) {
  const { config, editable, focused, state } = props

  usePendingFileUploader(state.src, config.upload)

  const imageComponent =
    state.src.value === '' ||
    (isTempFile(state.src.value) && !state.src.value.loaded) ? (
      <ImgPlaceholderWrapper>
        <Icon icon={faImages} size="5x" />
        {isTempFile(state.src.value) && state.src.value.failed ? (
          <Failed>Hochladen fehlgeschlagen</Failed>
        ) : null}
      </ImgPlaceholderWrapper>
    ) : (
      <ImageRenderer {...props} disableMouseEvents={editable} />
    )
  if (!editable) {
    return imageComponent
  }

  return (
    <React.Fragment>
      {imageComponent}
      {focused ? (
        <React.Fragment>
          <PrimarySettings>
            <PrimaryControls {...props} config={config} />
          </PrimarySettings>
          {props.renderIntoSettings(
            <React.Fragment>
              <Controls {...props} config={config} />
            </React.Fragment>
          )}
        </React.Fragment>
      ) : null}
    </React.Fragment>
  )
}

function PrimaryControls(
  props: ImageProps & {
    config: ImagePluginConfig
  }
) {
  const { src } = props.state
  return src.value === '' || isTempFile(src.value) ? (
    <React.Fragment>
      <EditorInput
        label="Bild-Adresse (URL):"
        placeholder={
          !isTempFile(src.value)
            ? 'http://beispiel.de/bild.png'
            : !src.value.failed
            ? 'Wird hochgeladen...'
            : 'Upload fehlgeschlagen...'
        }
        value={!isTempFile(src.value) ? src.value : ''}
        disabled={isTempFile(src.value) && !src.value.failed}
        onChange={handleChange(props)('src')}
        editorInputWidth="70%"
        textfieldWidth="60%"
        ref={props.defaultFocusRef}
      />
      <ButtonWrapper>
        {isTempFile(src.value) && src.value.failed ? (
          <EditorButton
            onClick={() => {
              if (isTempFile(src.value) && src.value.failed) {
                src.upload(src.value.failed, props.config.upload)
              }
            }}
          >
            <Icon icon={faRedoAlt} />
          </EditorButton>
        ) : null}
        <Upload
          onFile={file => {
            src.upload(file, props.config.upload)
          }}
        />
      </ButtonWrapper>
    </React.Fragment>
  ) : (
    showAlternativeMenu()
  )

  function showAlternativeMenu() {
    switch (props.config.secondInput) {
      case 'description':
        return (
          <React.Fragment>
            <EditorInput
              label="Bildbeschreibung:"
              placeholder="Gib eine Bildbeschreibung ein (mind. 3 Wörter)"
              value={props.state.description.value}
              onChange={handleChange(props)('description')}
              editorInputWidth="90%"
              textfieldWidth="70%"
              ref={props.defaultFocusRef}
            />
          </React.Fragment>
        )
      case 'link':
        return (
          <React.Fragment>
            <EditorInput
              label="Link: "
              placeholder="Verlinke das Bild (optional)"
              value={props.state.href.value}
              onChange={handleChange(props)('href')}
              editorInputWidth="90%"
              textfieldWidth="70%"
              ref={props.defaultFocusRef}
            />
          </React.Fragment>
        )
      default:
        return null
    }
  }
}

function Controls<T = unknown>(
  props: ImageProps & {
    config: ImagePluginConfig
  }
) {
  const { state } = props

  return (
    <React.Fragment>
      <OverlayInput
        label="Bild-Adresse (URL)"
        placeholder={
          !isTempFile(state.src.value)
            ? 'http://beispiel.de/bild.png'
            : !state.src.value.failed
            ? 'Wird hochgeladen...'
            : 'Upload fehlgeschlagen...'
        }
        value={!isTempFile(state.src.value) ? state.src.value : undefined}
        disabled={isTempFile(state.src.value) && !state.src.value.failed}
        onChange={handleChange(props)('src')}
      />
      <OverlayButtonWrapper>
        {isTempFile(state.src.value) && state.src.value.failed ? (
          <OverlayButton
            onClick={() => {
              if (isTempFile(state.src.value) && state.src.value.failed) {
                state.src.upload(state.src.value.failed, props.config.upload)
              }
            }}
            label="Upload erneut versuchen"
          >
            <Icon icon={faRedoAlt} />
          </OverlayButton>
        ) : null}
        <Upload
          inOverlay
          onFile={file => {
            state.src.upload(file, props.config.upload)
          }}
        />
      </OverlayButtonWrapper>
      <OverlayTextarea
        label="Bildbeschreibung"
        placeholder="Gib hier eine Bildbeschreibung ein (mindestens 3 Wörter)"
        value={state.description.value}
        onChange={handleChange(props)('description')}
      />

      <OverlayInput
        label="Verlinke das Bild (optional)"
        placeholder="http://beispiel.de"
        type="text"
        value={state.href.value}
        onChange={handleChange(props)('href')}
      />
      {state.href.value ? (
        <React.Fragment>
          <OverlayCheckbox
            label="In neuem Fenster öffnen"
            checked={state.target.value === '_blank'}
            onChange={handleTargetChange(props)}
          />
        </React.Fragment>
      ) : null}
      <OverlayInput
        label="Maximale Breite (px)"
        placeholder="Gib hier die Breite ein"
        type="number"
        value={state.maxWidth.value || ''}
        onChange={event => {
          state.maxWidth.set(parseInt(event.target.value))
        }}
      />
    </React.Fragment>
  )
}

function handleChange(props: ImageProps) {
  return function(name: 'src' | 'description' | 'href') {
    return (
      event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
      const { state } = props
      state[name].set(event.target.value)
    }
  }
}

function handleTargetChange(props: ImageProps) {
  return function(checked: boolean) {
    const { state } = props
    if (checked) {
      state.target.set('_blank')
      // noopener is safer but not supported in IE, so noreferrer adds some security
      state.rel.set('noreferrer noopener')
    } else {
      state.target.set('')
      state.rel.set('')
    }
  }
}
