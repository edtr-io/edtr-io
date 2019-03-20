import * as React from 'react'

let portalNode = React.createRef<HTMLDivElement>()

export const OverlayContext = React.createContext<OverlayContextValue>({
  visible: false,
  show: () => {},
  hide: () => {},
  node: portalNode
})

export interface OverlayContextValue {
  visible: boolean
  show: () => void
  hide: () => void
  node: React.RefObject<HTMLDivElement>
}

export const OverlayContextProvider: React.FunctionComponent = props => {
  const [visible, setVisible] = React.useState(false)
  return (
    <OverlayContext.Provider
      value={{
        visible: visible,
        show: () => setVisible(true),
        hide: () => setVisible(false),
        node: portalNode
      }}
    >
      {props.children}
      <div ref={portalNode} />
    </OverlayContext.Provider>
  )
}
