import {
  OverlayButton,
  OverlayCheckbox,
  OverlayInput,
  OverlayTextarea
} from '@edtr-io/core'
import {
  EditorButton,
  EditorInput,
  EditorInlineSettings
} from '@edtr-io/editor-ui'
import { isTempFile, usePendingFileUploader } from '@edtr-io/plugin'
import {
  EditorThemeProps,
  Icon,
  faImages,
  faRedoAlt,
  styled
} from '@edtr-io/ui'
import * as React from 'react'

import { ImageProps } from '.'
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
          <Failed>{config.i18n.failedUploadMessage}</Failed>
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
          <EditorInlineSettings>
            <PrimaryControls {...props} config={config} />
          </EditorInlineSettings>
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

function PrimaryControls(props: ImageProps) {
  const { i18n } = props.config
  const { src } = props.state
  return src.value === '' || isTempFile(src.value) ? (
    <React.Fragment>
      <EditorInput
        label={i18n.src.label}
        placeholder={
          !isTempFile(src.value)
            ? i18n.src.placeholder.empty
            : !src.value.failed
            ? i18n.src.placeholder.uploading
            : i18n.src.placeholder.failed
        }
        value={!isTempFile(src.value) ? src.value : ''}
        disabled={isTempFile(src.value) && !src.value.failed}
        onChange={handleChange(props)('src')}
        width="70%"
        inputWidth="60%"
        ref={props.autofocusRef}
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
          config={props.config}
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
      case 'description': {
        const { alt } = props.state
        return (
          <React.Fragment>
            <EditorInput
              label={i18n.alt.label}
              placeholder={i18n.alt.placeholder}
              value={alt.defined ? alt.value : ''}
              onChange={handleChange(props)('description')}
              width="90%"
              inputWidth="70%"
              ref={props.autofocusRef}
            />
          </React.Fragment>
        )
      }
      case 'link': {
        const { link } = props.state
        return (
          <React.Fragment>
            <EditorInput
              label={i18n.link.href.label}
              placeholder={i18n.link.href.placeholder}
              value={link.defined ? link.href.value : ''}
              onChange={handleChange(props)('href')}
              width="90%"
              inputWidth="70%"
              ref={props.autofocusRef}
            />
          </React.Fragment>
        )
      }
      default:
        return null
    }
  }
}

function Controls<T = unknown>(props: ImageProps) {
  const { state } = props
  const { i18n } = props.config

  return (
    <React.Fragment>
      <OverlayInput
        label={i18n.src.label}
        placeholder={
          !isTempFile(state.src.value)
            ? i18n.src.placeholder.empty
            : !state.src.value.failed
            ? i18n.src.placeholder.uploading
            : i18n.src.placeholder.failed
        }
        value={!isTempFile(state.src.value) ? state.src.value : ''}
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
            label={i18n.src.retryLabel}
          >
            <Icon icon={faRedoAlt} />
          </OverlayButton>
        ) : null}
        <Upload
          config={props.config}
          inOverlay
          onFile={file => {
            state.src.upload(file, props.config.upload)
          }}
        />
      </OverlayButtonWrapper>
      <OverlayTextarea
        label={i18n.alt.label}
        placeholder={i18n.alt.placeholder}
        value={state.alt.defined ? state.alt.value : ''}
        onChange={handleChange(props)('description')}
      />

      <OverlayInput
        label={i18n.link.href.label}
        placeholder={i18n.link.href.placeholder}
        type="text"
        value={state.link.defined ? state.link.href.value : ''}
        onChange={handleChange(props)('href')}
      />
      {state.link.defined && state.link.href.value ? (
        <React.Fragment>
          <OverlayCheckbox
            label={i18n.link.openInNewTab.label}
            checked={state.link.defined ? state.link.openInNewTab.value : false}
            onChange={handleTargetChange(props)}
          />
        </React.Fragment>
      ) : null}
      <OverlayInput
        label={i18n.maxWidth.label}
        placeholder={i18n.maxWidth.placeholder}
        type="number"
        value={state.maxWidth.defined ? state.maxWidth.value : ''}
        onChange={event => {
          const value = parseInt(event.target.value)
          if (state.maxWidth.defined) {
            state.maxWidth.set(value)
          } else {
            state.maxWidth.create(value)
          }
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
      const value = event.target.value

      switch (name) {
        case 'src':
          state.src.set(value)
          break
        case 'description': {
          if (state.alt.defined) {
            if (value) {
              state.alt.set(value)
            } else {
              state.alt.remove()
            }
          } else {
            state.alt.create(value)
          }
          break
        }
        case 'href': {
          if (state.link.defined) {
            if (value) {
              state.link.href.set(value)
            } else {
              state.link.remove()
            }
          } else {
            state.link.create({
              href: value,
              openInNewTab: false
            })
          }
          break
        }
      }
    }
  }
}

function handleTargetChange(props: ImageProps) {
  return function(checked: boolean) {
    const { state } = props
    if (checked) {
      if (state.link.defined) {
        state.link.openInNewTab.set(true)
      } else {
        state.link.create({
          href: '',
          openInNewTab: true
        })
      }
    } else {
      if (state.link.defined) {
        state.link.openInNewTab.set(false)
      } else {
        state.link.create({
          href: '',
          openInNewTab: false
        })
      }
    }
  }
}
