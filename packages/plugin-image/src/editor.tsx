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

const ImgPlaceholderWrapper = styled.div({
  position: 'relative',
  width: '100%',
  textAlign: 'center'
})
const UploadButtonWrapper = styled.span({
  float: 'right',
  display: 'flex',
  flexDirection: 'row',

  justifyContent: 'flex-end'
})

export function createImageEditor<T = unknown>(
  config: ImagePluginConfig<T>
): React.FunctionComponent<StatefulPluginEditorProps<typeof imageState>> {
  return props => {
    const [imagePreview, setImagePreview] = React.useState<
      ImageLoaded | undefined
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
            <React.Fragment>
              <EditorInput
                label="Image location (URL):"
                placeholder="http://example.com/image.png"
                value={state.src.value}
                onChange={handleChange('src')}
                editorInputWidth="70%"
                textfieldWidth="60%"
              />
              <UploadButtonWrapper>
                <Upload
                  config={config.upload}
                  onImageLoaded={handleImageLoaded}
                  onImageUploaded={handleImageUploaded}
                  onError={(errors: FileError[]): void => {
                    alert(errors.map(error => error.message).join('\n'))
                    setImagePreview(undefined)
                  }}
                />
                <EditorButton onClick={overlayContext.show}>
                  <Icon icon={faCog} />
                </EditorButton>
              </UploadButtonWrapper>
            </React.Fragment>
            <Overlay>
              <Textarea
                label="Image description"
                placeholder="Gib hier eine Bildbeschreibung ein"
                value={state.description.value}
                onChange={handleChange('description')}
              />

              <OverlayInput
                label="Link location (url)"
                placeholder="http://example.com"
                type="text"
                value={state.href.value}
                onChange={handleChange('href')}
              />
              {state.href.value ? (
                <React.Fragment>
                  <Checkbox
                    label="Open in new window"
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

    function handleImageLoaded(image: ImageLoaded) {
      setImagePreview(image)
    }

    function handleImageUploaded(image: ImageUploaded) {
      setImagePreview(undefined)
      props.state.src.set(image.src)
    }
  }
}
