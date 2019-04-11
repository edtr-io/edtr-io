import * as React from 'react'
import { HotKeys } from 'react-hotkeys'

import { EditorContext } from '../editor-context'
import { useEditorFocus } from '../hooks'
import {
  isStatefulPlugin,
  StatefulPluginEditorProps,
  StatelessPluginEditorProps
} from '../plugin'
import {
  ActionType,
  getDocument,
  getPlugin,
  isEditable,
  isFocused
} from '../store'
import { StoreDeserializeHelpers } from '../plugin-state'
import { DocumentProps } from '.'

export const DocumentEditor: React.FunctionComponent<DocumentProps> = ({
  id,
  pluginProps
}) => {
  const container = React.useRef<HTMLDivElement>(null)
  const store = React.useContext(EditorContext)
  const { focusPrevious, focusNext } = useEditorFocus()
  const focused = isFocused(store.state, id)
  const document = getDocument(store.state, id)
  const plugin = document && getPlugin(store.state, document.plugin)

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
      store.dispatch({
        type: ActionType.Change,
        payload: {
          id,
          state: updater
        }
      })
    }
    state = plugin.state(document.state, onChange)
  }
  const Comp = plugin.Component as React.ComponentType<
    StatefulPluginEditorProps | StatelessPluginEditorProps
  >

  const editable = isEditable(store.state)
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
      store.dispatch({
        type: ActionType.Focus,
        payload: id
      })
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
