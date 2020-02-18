import { PluginToolbarOverlayButtonProps } from '@edtr-io/plugin-toolbar/beta'
import * as React from 'react'
import Modal from 'react-modal'

import { Button } from './button'
import { DefaultPluginToolbarConfig } from './config'
import { StyledIconContainer } from './icon-container'

export function createPluginToolbarOverlayButton(
  _config: DefaultPluginToolbarConfig
) {
  return function PluginToolbarOverlayButton({
    className,
    icon,
    label,
    ...modalProps
  }: PluginToolbarOverlayButtonProps) {
    const [open, setOpen] = React.useState(false)
    return (
      <React.Fragment>
        <WrappedModal
          {...modalProps}
          isOpen={open}
          onRequestClose={() => {
            setOpen(false)
          }}
        />
        <Button
          className={className}
          onClick={() => {
            setOpen(true)
          }}
          title={label}
        >
          <StyledIconContainer>{icon}</StyledIconContainer>
        </Button>
      </React.Fragment>
    )
  }
}

function WrappedModal({
  renderContent,
  contentRef,
  ...props
}: Pick<PluginToolbarOverlayButtonProps, 'contentRef' | 'renderContent'> &
  Omit<Modal.Props, 'contentRef'> & { onRequestClose(): void }) {
  const appended = React.useRef(false)
  const children = (
    <div
      ref={ref => {
        // The ref `appended` ensures that we only append the content once so that we don't lose focus on every render
        if (ref && contentRef.current && !appended.current) {
          appended.current = true
          ref.appendChild(contentRef.current)
        } else if (!props.isOpen) {
          appended.current = false
        }
      }}
    />
  )

  return (
    <Modal
      {...props}
      ariaHideApp={false}
      style={{
        overlay: {
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.1)'
        },
        content: {
          borderRadius: 0,
          backgroundColor: '#ffffff',
          width: '90%',
          maxWidth: '600px',
          inset: 'auto',
          margin: '0 auto'
        }
      }}
    >
      {renderContent
        ? renderContent(children, {
            close() {
              props.onRequestClose()
            }
          })
        : children}
    </Modal>
  )
}
