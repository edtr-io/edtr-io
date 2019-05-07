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
  faCog,
  FileError,
  LoadedFile,
  UploadedFile,
  Upload
} from '@edtr-io/editor-ui'
import * as React from 'react'

import { ImageRenderer } from './renderer'
import { ImagePluginConfig, imageState } from '.'

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
): React.FunctionComponent<StatefulPluginEditorProps<typeof imageState>> {
  return props => {
    const [imagePreview, setImagePreview] = React.useState<
      LoadedFile | undefined
    >(undefined)
    const overlayContext = React.useContext(OverlayContext)
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
        {focused ? (
          <React.Fragment>
            {state.src() === '' ? (
              <EditorInput
                label="Bild-Adresse (URL):"
                placeholder="http://beispiel.de/bild.png"
                value={state.src.value}
                onChange={handleChange('src')}
                editorInputWidth="70%"
                textfieldWidth="60%"
              />
            ) : (
              showAlternativeMenu()
            )}
            <ButtonWrapper>
              {state.src() === '' && (
                <Upload
                  config={config.upload}
                  onFileLoaded={handleImageLoaded}
                  onFileUploaded={handleImageUploaded}
                  onError={(errors: FileError[]): void => {
                    alert(errors.map(error => error.message).join('\n'))
                    setImagePreview(undefined)
                  }}
                />
              )}
              <EditorButton
                onClick={overlayContext.show}
                title="Weitere Einstellungen"
              >
                <Icon icon={faCog} />
              </EditorButton>
            </ButtonWrapper>

            <Overlay>
              <OverlayInput
                label="Bild-Adresse (URL)"
                placeholder="http://beispiel.de/bild.png"
                value={state.src.value}
                onChange={handleChange('src')}
              />
              <OverlayButtonWrapper>
                <Upload
                  inOverlay
                  config={config.upload}
                  onFileLoaded={handleImageLoaded}
                  onFileUploaded={handleImageUploaded}
                  onError={(errors: FileError[]): void => {
                    alert(errors.map(error => error.message).join('\n'))
                    setImagePreview(undefined)
                  }}
                />
              </OverlayButtonWrapper>
              <Textarea
                label="Bildbeschreibung"
                placeholder="Gib hier eine Bildbeschreibung ein (mindestens 3 Wörter)"
                value={state.description.value}
                onChange={handleChange('description')}
              />

              <OverlayInput
                label="Verlinke das Bild (optional)"
                placeholder="http://beispiel.de"
                type="text"
                value={state.href.value}
                onChange={handleChange('href')}
              />
              {state.href.value ? (
                <React.Fragment>
                  <Checkbox
                    label="In neuem Fenster öffnen"
                    checked={state.target.value === '_blank'}
                    onChange={handleTargetChange}
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
            </Overlay>
          </React.Fragment>
        ) : null}
      </React.Fragment>
    )
    function showAlternativeMenu() {
      switch (config.secondInput) {
        case 'description':
          return (
            <React.Fragment>
              <EditorInput
                label="Bildbeschreibung:"
                placeholder="Gib eine Bildbeschreibung ein (mind. 3 Wörter)"
                value={state.description.value}
                onChange={handleChange('description')}
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
                value={state.href.value}
                onChange={handleChange('href')}
                editorInputWidth="90%"
                textfieldWidth="70%"
              />
            </React.Fragment>
          )
        default:
          return null
      }
    }
    function handleChange(name: 'src' | 'description' | 'href') {
      return (
        event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
      ) => {
        const { state } = props
        state[name].set(event.target.value)
      }
    }

    function handleTargetChange(checked: boolean) {
      const { state } = props
      if (checked) {
        state.target.set('_blank'),
          // noopener is safer but not supported in IE, so noreferrer adds some security
          state.rel.set('noreferrer noopener')
      } else {
        state.target.set(''), state.rel.set('')
      }
    }

    function handleImageLoaded(image: LoadedFile) {
      setImagePreview(image)
    }

    function handleImageUploaded(image: UploadedFile) {
      setImagePreview(undefined)
      props.state.src.set(image.location)
    }
  }
}
