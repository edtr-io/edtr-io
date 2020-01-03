import * as React from 'react'
import Modal from 'react-modal'

export const Overlay = ({
  open,
  setOpen,
  content
}: {
  open: boolean
  setOpen: (newValue: boolean) => void
  content: React.ReactNode
}) => {
  return (
    <Modal
      ariaHideApp={false}
      isOpen={open}
      onRequestClose={() => {
        setOpen(false)
      }}
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
      {content}
    </Modal>
  )
}
