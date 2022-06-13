import {
  OverlayButton,
  OverlayCheckbox,
  OverlayInput,
  OverlayTextarea,
  useScopedStore,
} from '@edtr-io/core'
import {
  EditorButton,
  EditorInput,
  EditorInlineSettings,
} from '@edtr-io/editor-ui'
import { isTempFile, usePendingFileUploader } from '@edtr-io/plugin'
import { isEmpty, hasFocusedChild } from '@edtr-io/store'
import {
  EditorThemeProps,
  Icon,
  faImages,
  faRedoAlt,
  styled,
} from '@edtr-io/ui'
import * as React from 'react'

import { ImageProps } from '.'
import { useImageConfig } from './config'
import { ImageRenderer } from './renderer'
import { Upload } from './upload'

const ImgPlaceholderWrapper = styled.div<EditorThemeProps>((props) => {
  return {
    position: 'relative',
    width: '100%',
    textAlign: 'center',
    opacity: '0.4',
    color: props.theme.editor.primary.background,
  }
})

const InputRow = styled.span({
  display: 'flex',
  justifyContent: 'space-between',
  flexDirection: 'row',
})

const OverlayButtonWrapper = styled.div({
  marginTop: '5px',
  textAlign: 'right',
})

const Failed = styled.div<EditorThemeProps>((props) => {
  return {
    fontWeight: 'bold',
    color: props.theme.editor.danger.background,
  }
})

const Caption = styled.div({
  marginTop: '1rem',
  textAlign: 'center',
  fontStyle: 'italic',
  'span[contenteditable]': { width: 'auto !important' },
})

export function ImageEditor(props: ImageProps) {
  const { editable, focused, state } = props
  const config = useImageConfig(props.config)
  const scopedStore = useScopedStore()
  usePendingFileUploader(state.src, config.upload)
  const { i18n } = config

  const captionIsEmpty =
    !state.caption.defined || isEmpty(state.caption.id)(scopedStore.getState())
  const hasFocus = focused || hasFocusedChild(props.id)(scopedStore.getState())

  if (!editable)
    return (
      <>
        {renderImage()}
        {captionIsEmpty ? null : renderCaption()}
      </>
    )

  if (!state.caption.defined) state.caption.create({ plugin: 'text' })

  return (
    <>
      {renderImage()}
      {hasFocus ? (
        <>
          <EditorInlineSettings>
            <PrimaryControls {...props} config={config} />
          </EditorInlineSettings>
          {props.renderIntoSettings(
            <SettingsControls {...props} config={config} />
          )}
        </>
      ) : null}
      {!captionIsEmpty || hasFocus ? renderCaption() : null}
    </>
  )

  function renderImage() {
    return state.src.value === '' ||
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
  }

  function renderCaption() {
    if (!state.caption.defined) return null
    return (
      <Caption>
        {state.caption.render({
          config: { placeholder: i18n.caption.placeholder },
        })}
      </Caption>
    )
  }
}

function PrimaryControls(props: ImageProps) {
  const config = useImageConfig(props.config)
  const { i18n } = config
  const { src } = props.state
  return (
    <>
      <InputRow>
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
          inputWidth="80%"
          ref={props.autofocusRef}
        />
        {isTempFile(src.value) && src.value.failed ? (
          <EditorButton
            onClick={() => {
              if (isTempFile(src.value) && src.value.failed) {
                void src.upload(src.value.failed, props.config.upload)
              }
            }}
          >
            <Icon icon={faRedoAlt} />
          </EditorButton>
        ) : null}
        <Upload
          config={config}
          onFile={(file) => {
            void src.upload(file, props.config.upload)
          }}
        />
      </InputRow>
      {renderAlternativeInput()}
    </>
  )

  function renderAlternativeInput() {
    switch (props.config.secondInput) {
      case 'link': {
        const { link } = props.state
        return (
          <>
            <EditorInput
              label={i18n.link.href.label}
              placeholder={i18n.link.href.placeholder}
              value={link.defined ? link.href.value : ''}
              onChange={handleChange(props)('href')}
              width="90%"
              inputWidth="70%"
              ref={props.autofocusRef}
            />
          </>
        )
      }
      default:
        return null
    }
  }
}

function SettingsControls(props: ImageProps) {
  const { state } = props
  const config = useImageConfig(props.config)
  const { i18n } = config

  return (
    <>
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
                void state.src.upload(
                  state.src.value.failed,
                  props.config.upload
                )
              }
            }}
            label={i18n.src.retryLabel}
          >
            <Icon icon={faRedoAlt} />
          </OverlayButton>
        ) : null}
        <Upload
          config={config}
          inOverlay
          onFile={(file) => {
            void state.src.upload(file, props.config.upload)
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
        <>
          <OverlayCheckbox
            label={i18n.link.openInNewTab.label}
            checked={state.link.defined ? state.link.openInNewTab.value : false}
            onChange={handleTargetChange(props)}
          />
        </>
      ) : null}
      <OverlayInput
        label={i18n.maxWidth.label}
        placeholder={i18n.maxWidth.placeholder}
        type="number"
        value={state.maxWidth.defined ? state.maxWidth.value : ''}
        onChange={(event) => {
          const value = parseInt(event.target.value)
          if (state.maxWidth.defined) {
            state.maxWidth.set(value)
          } else {
            state.maxWidth.create(value)
          }
        }}
      />
    </>
  )
}

function handleChange(props: ImageProps) {
  return function (name: 'src' | 'description' | 'href') {
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
              openInNewTab: false,
            })
          }
          break
        }
      }
    }
  }
}

function handleTargetChange(props: ImageProps) {
  return function (checked: boolean) {
    const { state } = props
    if (checked) {
      if (state.link.defined) {
        state.link.openInNewTab.set(true)
      } else {
        state.link.create({
          href: '',
          openInNewTab: true,
        })
      }
    } else {
      if (state.link.defined) {
        state.link.openInNewTab.set(false)
      } else {
        state.link.create({
          href: '',
          openInNewTab: false,
        })
      }
    }
  }
}
