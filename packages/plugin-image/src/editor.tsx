import { StatefulPluginEditorProps } from '@edtr-io/core'
import { Icon, faImages, styled } from '@edtr-io/ui'
import * as React from 'react'

import { ImageLoaded, ImageUploaded, Upload } from './upload'
import { ImageRenderer } from './renderer'
import { ImagePluginConfig, imageState } from '.'

export function createImageEditor<T = unknown>(
  config: ImagePluginConfig<T>
): React.ComponentType<StatefulPluginEditorProps<typeof imageState>> {
  return class ImageEditor extends React.Component<
    StatefulPluginEditorProps<typeof imageState>,
    ImageEditorState
  > {
    public state: ImageEditorState = {}

    public render(): React.ReactNode {
      const { editable, focused, state } = this.props

      return (
        <React.Fragment>
          {state.src.value || this.state.imagePreview ? (
            <ImageRenderer
              state={state}
              imagePreview={this.state.imagePreview}
              disableMouseEvents={editable}
            />
          ) : (
            <div>
              <this.ImgPlaceholderWrapper>
                <Icon icon={faImages} size="5x" />
              </this.ImgPlaceholderWrapper>
            </div>
          )}
          {focused ? (
            <React.Fragment>
              <hr />
              Image location (url)
              <input
                placeholder="http://example.com/image.png"
                value={state.src.value}
                type="text"
                onChange={this.handleChange('src')}
              />
              <br />
              <Upload
                config={config.upload}
                onImageLoaded={this.handleImageLoaded}
                onImageUploaded={this.handleImageUploaded}
              />
              <br />
              Image description
              <textarea
                placeholder="Gib hier eine Bildbeschreibung ein"
                value={state.description.value}
                onChange={this.handleChange('description')}
              />
              <br />
              Link location (url)
              <input
                placeholder="http://example.com"
                type="text"
                value={state.href.value}
                onChange={this.handleChange('href')}
              />
              {state.href.value ? (
                <React.Fragment>
                  <br />
                  Open in new window
                  <input
                    checked={state.target.value === '_blank'}
                    type="checkbox"
                    onChange={this.handleTargetChange}
                  />
                </React.Fragment>
              ) : null}
            </React.Fragment>
          ) : null}
        </React.Fragment>
      )
    }

    private handleChange(name: 'src' | 'description' | 'href') {
      return (
        event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
      ) => {
        const { state } = this.props
        state[name].set(event.target.value)
      }
    }

    private handleTargetChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const { state } = this.props
      if (event.target.checked) {
        state.target.set('_blank'),
          // noopener is safer but not supported in IE, so noreferrer adds some security
          state.rel.set('noreferrer noopener')
      } else {
        state.target.set(''), state.rel.set('')
      }
    }

    private handleImageLoaded = (image: ImageLoaded) => {
      this.setState({ imagePreview: image })
    }

    private handleImageUploaded = (image: ImageUploaded) => {
      this.setState({ imagePreview: undefined })
      this.props.state.src.set(image.src)
    }

    private ImgPlaceholderWrapper = styled.div({
      position: 'relative',
      width: '100%',
      textAlign: 'center'
    })
  }
}

export interface ImageEditorState {
  imagePreview?: ImageLoaded
}
