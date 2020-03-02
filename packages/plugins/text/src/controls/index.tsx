import { EditorBottomToolbar, styled } from '@edtr-io/editor-ui'
import * as React from 'react'
import { Editor, EditorProps } from 'slate-react'

import { TextPluginConfig, TextPlugin, TextConfig } from '..'
import { SlatePluginClosure } from '../factory/types'
import { HoveringOverlay } from '../plugins/hovering-overlay'
import { ColorControls } from './colors'
import { DefaultControls } from './default'
import { HeadingControls } from './headings'
import { ListControls } from './lists'

export enum VisibleControls {
  All,
  Headings,
  Lists,
  Colors
}

export interface ControlProps {
  config: TextPluginConfig
  editor: Editor
  pluginClosure: SlatePluginClosure
  plugins: {
    suggestions?: boolean
    math?: boolean
    headings?: boolean
    lists?: boolean
    colors?: boolean
  }
  readOnly?: boolean
}

export interface SubControlProps extends ControlProps {
  switchControls: (control: VisibleControls) => void
  onChange: (editor: Editor) => Editor
  config: TextPluginConfig
}

export interface UiPluginOptions {
  Component: React.ComponentType<Partial<EditorProps> & ControlProps>
  plugins?: TextConfig['plugins']
}

function ControlsSwitch({
  visibleControls,
  setVisibleControls,
  onChange,
  ...props
}: {
  visibleControls: VisibleControls
  setVisibleControls: (controls: VisibleControls) => void
  onChange: (editor: Editor) => Editor
} & ControlProps) {
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

const TimeoutBottomToolbar = styled(EditorBottomToolbar)<{
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

export function Controls(props: ControlProps) {
  const selectionCollapsed = props.editor.value.selection.isCollapsed
  const [visibleControls, setVisibleControls] = React.useState(
    VisibleControls.All
  )
  const [bottomToolbarVisible, setBottomToolbarVisible] = React.useState(false)

  function showBottomToolbar() {
    setVisibleControls(VisibleControls.All)
    setBottomToolbarVisible(true)
  }
  const currentValue = JSON.stringify(props.editor.value.toJSON())
  const memoized = React.useRef({
    value: currentValue,
    selectionCollapsed
  })
  React.useEffect(() => {
    let debounceTimeout = setTimeout(showBottomToolbar, 2500)
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

    return () => {
      clearTimeout(debounceTimeout)
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
  const {
    Component,
    plugins = {
      suggestions: true,
      math: true,
      headings: true,
      lists: true,
      colors: true
    }
  } = options

  return {
    renderEditor(props, editor, next) {
      const { readOnly } = props
      if (readOnly) {
        editor.blur()
      }
      const config = pluginClosure.current
        ? pluginClosure.current.config
        : undefined
      if (!config) return null
      const children = next()
      return (
        <React.Fragment>
          {!readOnly ? (
            <Component
              editor={(editor as unknown) as Editor}
              {...props}
              config={config}
              pluginClosure={pluginClosure}
              plugins={plugins}
            />
          ) : null}
          {children}
        </React.Fragment>
      )
    }
  }
}
