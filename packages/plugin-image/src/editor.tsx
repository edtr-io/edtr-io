import { ImageRenderer } from './renderer'
import { Icon, faImages, styled } from '@edtr-io/ui'
import * as React from 'react'

import { ImageLoaded, ImageUploaded, Upload } from './upload'
import { ImagePluginConfig } from '.'
import { StatefulPluginEditorProps, StateType } from '@edtr-io/core'
import { imageState } from '.'
import { stat } from 'fs'

export const createImageEditor = (
  config: ImagePluginConfig
): React.ComponentType<StatefulPluginEditorProps<typeof imageState>> => {
  return class ImageEditor extends React.Component<
    StatefulPluginEditorProps<typeof imageState>,
    ImageEditorState
  > {
    public state: ImageEditorState = {}

    public render(): React.ReactNode {
      const { editable, focused, state } = this.props

      return (
        <React.Fragment>
          {state.value.src.value || this.state.imagePreview ? (
            <ImageRenderer
              state={{
                ...this.props.state,
                src: this.state.imagePreview
                  ? this.state.imagePreview.dataUrl
                  : state.value.src.value
              }}
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
                value={state.value.src.value}
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
                value={state.value.description.value}
                onChange={this.handleChange('description')}
              />
              <br />
              Link location (url)
              <input
                placeholder="http://example.com"
                type="text"
                value={state.value.href.value}
                onChange={this.handleChange('href')}
              />
              {state.value.href.value ? (
                <React.Fragment>
                  <br />
                  Open in new window
                  <input
                    checked={state.value.target.value === '_blank'}
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
        state.value[name].set(event.target.value)
      }
    }

    private handleTargetChange = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      const { state } = this.props
      if (event.target.checked) {
        state.value.target.set('_blank'),
          // noopener is safer but not supported in IE, so noreferrer adds some security
          state.value.rel.set('noreferrer noopener')
      } else {
        state.value.target.set(''), state.value.rel.set('')
      }
    }

    private handleImageLoaded = (image: ImageLoaded) => {
      this.setState({ imagePreview: image })
    }

    private handleImageUploaded = (image: ImageUploaded) => {
      this.setState({ imagePreview: undefined })
      this.props.state.value.src.set(image.src)
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
