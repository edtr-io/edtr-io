import { StatefulPluginEditorProps, OverlayContext } from '@edtr-io/core'
import {
  Icon,
  faImages,
  styled,
  Textarea,
  Overlay,
  OverlayInput,
  Checkbox,
  EditorInput,
  EditorButton,
  faCog
} from '@edtr-io/editor-ui'
import * as React from 'react'

import { FileError, ImageLoaded, ImageUploaded, Upload } from './upload'
import { ImageRenderer } from './renderer'
import { ImagePluginConfig, imageState } from '.'

type ImageProps = StatefulPluginEditorProps<typeof imageState> & {
  renderIntoExtendedSettings?: (children: React.ReactNode) => React.ReactNode
  PrimarySettingsWrapper?: React.ComponentType
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

export function createImageEditor<T = unknown>(
  config: ImagePluginConfig<T>
): React.FunctionComponent<ImageProps> {
  return props => {
    const [imagePreview, setImagePreview] = React.useState<
      ImageLoaded | undefined
    >(undefined)
    const { editable, focused, state } = props
    const imageComponent =
      state.src.value || imagePreview ? (
        <ImageRenderer {...props} disableMouseEvents={editable} />
      ) : (
        <ImgPlaceholderWrapper>
          <Icon icon={faImages} size="5x" />
        </ImgPlaceholderWrapper>
      )
    if (!editable) {
      return imageComponent
    }

    return (
      <React.Fragment>
        {imageComponent}
        {props.PrimarySettingsWrapper ? (
          <props.PrimarySettingsWrapper>
            <PrimaryControls
              {...props}
              config={config}
              handleImageLoaded={handleImageLoaded}
              handleImageUploaded={handleImageUploaded}
            />
          </props.PrimarySettingsWrapper>
        ) : focused ? (
          <PrimaryControls
            {...props}
            config={config}
            handleImageLoaded={handleImageLoaded}
            handleImageUploaded={handleImageUploaded}
          />
        ) : null}
        {props.renderIntoExtendedSettings ? (
          props.renderIntoExtendedSettings(
            <Controls
              {...props}
              config={config}
              handleImageLoaded={handleImageLoaded}
              handleImageUploaded={handleImageUploaded}
            />
          )
        ) : focused ? (
          //use Editor Overlay, if renderIntoExtendedSettings is not supported
          <Overlay>
            <Controls
              {...props}
              config={config}
              handleImageLoaded={handleImageLoaded}
              handleImageUploaded={handleImageUploaded}
            />
          </Overlay>
        ) : null}
      </React.Fragment>
    )
    function handleImageLoaded(image: ImageLoaded | undefined) {
      setImagePreview(image)
    }

    function handleImageUploaded(image: ImageUploaded) {
      setImagePreview(undefined)
      props.state.src.set(image.src)
    }
  }
}

function PrimaryControls<T = unknown>(
  props: ImageProps & {
    config: ImagePluginConfig<T>
    handleImageLoaded: (image: ImageLoaded | undefined) => void
    handleImageUploaded: (image: ImageUploaded) => void
  }
) {
  const overlayContext = React.useContext(OverlayContext)

  return props.state.src() === '' ? (
    <React.Fragment>
      <EditorInput
        label="Bild-Adresse (URL):"
        placeholder="http://beispiel.de/bild.png"
        value={props.state.src.value}
        onChange={handleChange(props)('src')}
        editorInputWidth="70%"
        textfieldWidth="60%"
      />
      <ButtonWrapper>
        <Upload
          config={props.config.upload}
          onImageLoaded={props.handleImageLoaded}
          onImageUploaded={props.handleImageUploaded}
          onError={(errors: FileError[]): void => {
            alert(errors.map(error => error.message).join('\n'))
            props.handleImageLoaded(undefined)
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
    config: ImagePluginConfig<T>
    handleImageLoaded: (image: ImageLoaded | undefined) => void
    handleImageUploaded: (image: ImageUploaded) => void
  }
) {
  const { state, config, handleImageLoaded, handleImageUploaded } = props
  return (
    <React.Fragment>
      <OverlayInput
        label="Bild-Adresse (URL)"
        placeholder="http://beispiel.de/bild.png"
        value={state.src.value}
        onChange={handleChange(props)('src')}
      />
      <OverlayButtonWrapper>
        <Upload
          inOverlay
          config={config.upload}
          onImageLoaded={handleImageLoaded}
          onImageUploaded={handleImageUploaded}
          onError={(errors: FileError[]): void => {
            alert(errors.map(error => error.message).join('\n'))
            handleImageLoaded(undefined)
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
