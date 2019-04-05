import * as React from 'react'
import { HotKeys } from 'react-hotkeys'

import { useEditorFocus } from '../hooks'
import {
  isStatefulPlugin,
  StatefulPluginEditorProps,
  StatelessPluginEditorProps
} from '../plugin'
import { StoreDeserializeHelpers } from '../plugin-state'
import { DocumentDispatchProps, DocumentProps, DocumentStateProps } from '.'

export const DocumentEditor: React.FunctionComponent<
  DocumentProps & DocumentStateProps & DocumentDispatchProps
> = ({ id, pluginProps, ...props }) => {
  const container = React.useRef<HTMLDivElement>(null)
  const { focusPrevious, focusNext } = useEditorFocus()
  const focused = props.isFocused(id)
  const document = props.getDocument(id)
  const plugin = document && props.getPlugin(document.plugin)

  React.useEffect(() => {
    if (
      focused &&
      container.current &&
      plugin &&
      (!isStatefulPlugin(plugin) || !plugin.getFocusableChildren)
    ) {
      container.current.focus()
    }
  }, [focused, plugin])

  if (!document) {
    return null
  }

  if (!plugin) {
    // TODO:
    // eslint-disable-next-line no-console
    console.log('Plugin does not exist')
    return null
  }

  let state: unknown
  if (isStatefulPlugin(plugin)) {
    const onChange = (
      updater: (value: unknown, helpers: StoreDeserializeHelpers) => void
    ) => {
      props.change({
        id,
        state: updater
      })
    }
    state = plugin.state(document.state, onChange)
  }
  const Comp = plugin.Component as React.ComponentType<
    StatefulPluginEditorProps | StatelessPluginEditorProps
  >

  const editable = props.isEditable
  return (
    <HotKeys
      keyMap={{
        FOCUS_PREVIOUS: 'up',
        FOCUS_NEXT: 'down'
      }}
      handlers={{
        FOCUS_PREVIOUS: e => {
          handleKeyDown(e, () => {
            focusPrevious()
          })
        },
        FOCUS_NEXT: e => {
          handleKeyDown(e, () => {
            focusNext()
          })
        }
      }}
    >
      <div
        onMouseDown={handleFocus}
        ref={container}
        data-document
        tabIndex={-1}
      >
        <Comp
          {...pluginProps}
          editable={editable}
          focused={focused}
          state={state}
          name={document.plugin}
        />
      </div>
    </HotKeys>
  )

  function handleFocus(e: React.MouseEvent<HTMLDivElement>) {
    // Find closest document
    const target = (e.target as HTMLDivElement).closest('[data-document]')

    if (!focused && target === container.current) {
      props.focus(id)
    }
  }

  function handleKeyDown(e: KeyboardEvent | undefined, next: () => void) {
    if (
      e &&
      plugin &&
      isStatefulPlugin(plugin) &&
      typeof plugin.onKeyDown === 'function' &&
      !plugin.onKeyDown(e)
    ) {
      return
    }
    e && e.preventDefault()
    next()
  }
}
