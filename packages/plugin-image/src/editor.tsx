import {
  StateType,
  StatefulPluginEditorProps,
  OverlayContext
} from '@edtr-io/core'
import {
  Checkbox,
  EditorButton,
  EditorInput,
  Icon,
  Overlay,
  OverlayInput,
  PrimarySettings,
  Textarea,
  faCog,
  faImages,
  styled
} from '@edtr-io/editor-ui'
import * as React from 'react'

import { Upload } from './upload'
import { ImageRenderer } from './renderer'
import { ImagePluginConfig, imageState } from '.'

type ImageProps = StatefulPluginEditorProps<typeof imageState> & {
  renderIntoExtendedSettings?: (children: React.ReactNode) => React.ReactNode
}

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

export function createImageEditor(
  config: ImagePluginConfig
): React.FunctionComponent<ImageProps> {
  return function ImageEditor(props) {
    const { editable, focused, state } = props

    StateType.usePendingFileUploader(state.src, config.upload)

    const imageComponent =
      state.src.value === '' ||
      (StateType.isTempFile(state.src.value) && !state.src.value.loaded) ? (
        <ImgPlaceholderWrapper>
          <Icon icon={faImages} size="5x" />
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
        {focused && (
          <PrimarySettings>
            <PrimaryControls {...props} config={config} />
          </PrimarySettings>
        )}
        {props.renderIntoExtendedSettings ? (
          props.renderIntoExtendedSettings(
            <Controls {...props} config={config} />
          )
        ) : focused ? (
          //use Editor Overlay, if renderIntoExtendedSettings is not supported
          <Overlay>
            <Controls {...props} config={config} />
          </Overlay>
        ) : null}
      </React.Fragment>
    )
  }
}

function PrimaryControls(
  props: ImageProps & {
    config: ImagePluginConfig
  }
) {
  const overlayContext = React.useContext(OverlayContext)

  const { src } = props.state
  return src.value === '' ? (
    <React.Fragment>
      <EditorInput
        label="Bild-Adresse (URL):"
        placeholder="http://beispiel.de/bild.png"
        onChange={handleChange(props)('src')}
        editorInputWidth="70%"
        textfieldWidth="60%"
      />
      <ButtonWrapper>
        <Upload
          onFile={file => {
            src.upload(file, props.config.upload)
          }}
        />
        {!props.renderIntoExtendedSettings && (
          <EditorButton
            onClick={overlayContext.show}
            title="Weitere Einstellungen"
          >
            <Icon icon={faCog} />
          </EditorButton>
        )}
      </ButtonWrapper>
    </React.Fragment>
  ) : (
    <React.Fragment>
      {showAlternativeMenu()}
      <ButtonWrapper>
        {!props.renderIntoExtendedSettings && (
          <EditorButton
            onClick={overlayContext.show}
            title="Weitere Einstellungen"
          >
            <Icon icon={faCog} />
          </EditorButton>
        )}
      </ButtonWrapper>
    </React.Fragment>
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
        placeholder="http://beispiel.de/bild.png"
        value={
          !StateType.isTempFile(state.src.value)
            ? state.src.value
            : 'Wird hochgeladen...'
        }
        disabled={StateType.isTempFile(state.src.value)}
        onChange={handleChange(props)('src')}
      />
      <OverlayButtonWrapper>
        <Upload
          inOverlay
          onFile={file => {
            state.src.upload(file, props.config.upload)
          }}
        />
      </OverlayButtonWrapper>
      <Textarea
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
          <Checkbox
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
      state.target.set('_blank'),
        // noopener is safer but not supported in IE, so noreferrer adds some security
        state.rel.set('noreferrer noopener')
    } else {
      state.target.set(''), state.rel.set('')
    }
  }
}
