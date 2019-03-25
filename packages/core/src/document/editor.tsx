import * as React from 'react'

import { EditorContext } from '../editor-context'
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

  const document = getDocument(store.state, id)
  if (!document) {
    return null
  }

  const plugin = getPlugin(store.state, document.plugin)
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

  const focused = isFocused(store.state, id)
  const editable = isEditable(store.state)
  return (
    <div onMouseDown={handleFocus} ref={container} data-document>
      <Comp
        {...pluginProps}
        editable={editable}
        focused={focused}
        state={state}
      />
    </div>
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
}
