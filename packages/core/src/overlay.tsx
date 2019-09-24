/**
 * @module @edtr-io/core
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import * as React from 'react'

const portalNode = React.createRef<HTMLDivElement>()

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
  const value = React.useMemo(() => {
    return {
      visible: visible,
      show: () => setVisible(true),
      hide: () => setVisible(false),
      node: portalNode
    }
  }, [visible])
  return (
    <OverlayContext.Provider value={value}>
      {props.children}
      <div ref={portalNode} />
    </OverlayContext.Provider>
  )
}
