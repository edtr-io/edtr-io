import * as React from 'react'
import { Editor } from 'slate'
import { EditorProps } from 'slate-react'
import { TextPlugin } from '..'
import { HoveringOverlay, BottomToolbar, styled } from '@edtr-io/editor-ui'
import { SlatePluginClosure } from '../factory/types'
import { DefaultControls } from './default'
import { HeadingControls } from './headings'
import { ListControls } from './lists'
import { ColorControls } from './colors'
export enum VisibleControls {
  All,
  Headings,
  Lists,
  Colors
}

export interface ControlProps {
  editor: Editor
  name: string
  pluginClosure: SlatePluginClosure
  readOnly?: boolean
}

export interface SubControlProps extends ControlProps {
  switchControls: (control: VisibleControls) => void
  onChange: (editor: Editor) => Editor
}

export interface UiPluginOptions {
  Component: React.ComponentType<Partial<EditorProps> & ControlProps>
}

const ControlsSwitch: React.FunctionComponent<
  {
    visibleControls: VisibleControls
    setVisibleControls: (controls: VisibleControls) => void
    onChange: (editor: Editor) => Editor
  } & ControlProps
> = ({ visibleControls, setVisibleControls, onChange, ...props }) => {
  switch (visibleControls) {
    case VisibleControls.All:
      return (
        <DefaultControls
          {...props}
          switchControls={setVisibleControls}
          onChange={onChange}
        />
      )
    case VisibleControls.Headings:
      return (
        <HeadingControls
          {...props}
          switchControls={setVisibleControls}
          onChange={onChange}
        />
      )
    case VisibleControls.Lists:
      return (
        <ListControls
          {...props}
          switchControls={setVisibleControls}
          onChange={onChange}
        />
      )
    case VisibleControls.Colors:
      return (
        <ColorControls
          {...props}
          switchControls={setVisibleControls}
          onChange={onChange}
        />
      )
  }
}

const TimeoutBottomToolbar = styled(BottomToolbar)<{
  visible: boolean
  isTouch: boolean
}>(props => {
  const touchStyles = props.isTouch
    ? { bottom: 'unset', top: 0, transform: 'translate(-50%, 50%)' }
    : {}

  return {
    opacity: props.visible ? 1 : 0,
    transition: '500ms opacity ease-in-out',
    ...touchStyles
  }
})

let debounceTimeout: number
export const Controls: React.FunctionComponent<ControlProps> = props => {
  const selectionCollapsed = props.editor.value.selection.isCollapsed
  const [visibleControls, setVisibleControls] = React.useState(
    VisibleControls.All
  )
  const [bottomToolbarVisible, setBottomToolbarVisible] = React.useState(false)

  function showBottomToolbar() {
    setVisibleControls(VisibleControls.All)
    setBottomToolbarVisible(true)
  }
  React.useEffect(() => {
    debounceTimeout = setTimeout(showBottomToolbar, 2500)

    return function cleanUp() {
      clearTimeout(debounceTimeout)
    }
  }, [])
  const currentValue = JSON.stringify(props.editor.value.toJSON())
  const memoized = React.useRef({
    value: currentValue,
    selectionCollapsed
  })
  React.useEffect(() => {
    const valueChanged = memoized.current.value !== currentValue
    if (
      valueChanged ||
      memoized.current.selectionCollapsed !== selectionCollapsed
    ) {
      memoized.current = {
        value: currentValue,
        selectionCollapsed
      }
      if (debounceTimeout) {
        clearTimeout(debounceTimeout)
      }
      const timeout = valueChanged ? 2500 : 1000
      if (selectionCollapsed) {
        debounceTimeout = setTimeout(showBottomToolbar, timeout)
      }
      setBottomToolbarVisible(false)
    }
  }, [currentValue, selectionCollapsed])

  const onChange = React.useCallback((editor: Editor) => {
    memoized.current = {
      ...memoized.current,
      value: JSON.stringify(editor.value.toJSON())
    }
    return editor
  }, [])

  return (
    <React.Fragment>
      {!selectionCollapsed && (
        <HoveringOverlay position={isTouchDevice() ? 'below' : 'above'}>
          <ControlsSwitch
            {...props}
            visibleControls={visibleControls}
            setVisibleControls={setVisibleControls}
            onChange={onChange}
          />
        </HoveringOverlay>
      )}
      {!props.readOnly && (
        <TimeoutBottomToolbar
          isTouch={isTouchDevice()}
          visible={selectionCollapsed && bottomToolbarVisible}
        >
          {bottomToolbarVisible && (
            <ControlsSwitch
              {...props}
              visibleControls={visibleControls}
              setVisibleControls={setVisibleControls}
              onChange={onChange}
            />
          )}
        </TimeoutBottomToolbar>
      )}
    </React.Fragment>
  )
}

export function isTouchDevice(): boolean {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  )
}

export const createUiPlugin = (options: UiPluginOptions) => (
  pluginClosure: SlatePluginClosure
): TextPlugin => {
  const { Component } = options

  return {
    renderEditor(props, editor, next) {
      const { readOnly } = props
      if (readOnly) {
        editor.blur()
      }
      const name = pluginClosure.current ? pluginClosure.current.name : ''
      const children = next()
      return (
        <React.Fragment>
          {!readOnly ? (
            <Component
              editor={editor}
              {...props}
              name={name}
              pluginClosure={pluginClosure}
            />
          ) : null}
          {children}
        </React.Fragment>
      )
    }
  }
}
