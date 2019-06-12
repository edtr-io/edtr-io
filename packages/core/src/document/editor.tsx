import { styled } from '@edtr-io/ui'
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
  isEmpty,
  isFocused
} from '../store'
import { StoreDeserializeHelpers } from '../plugin-state'
import { DocumentProps } from '.'

const StyledDocument = styled.div({
  outline: 'none'
})

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

  const { dispatch } = store

  return React.useMemo(() => {
    console.log('render doc', id)

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
        dispatch({
          type: ActionType.Change,
          payload: {
            id,
            state: updater
          }
        })
      }
      state = plugin.state(document.state, onChange, {
        ...pluginProps,
        name: document.plugin
      })
    }
    const Comp = plugin.Component as React.ComponentType<
      StatefulPluginEditorProps | StatelessPluginEditorProps
    >

    return (
      <HotKeys
        keyMap={{
          FOCUS_PREVIOUS: 'up',
          FOCUS_NEXT: 'down',
          INSERT_TEXT: 'enter',
          DELETE_EMPTY: ['backspace', 'del']
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
          },
          INSERT_TEXT: e => {
            handleKeyDown(e, () => {
              if (pluginProps && typeof pluginProps.insert === 'function') {
                pluginProps.insert({ plugin: 'text' })
              }
            })
          },
          DELETE_EMPTY: e => {
            if (isEmpty(store.state, id)) {
              handleKeyDown(e, () => {
                if (!e) return

                if (pluginProps && typeof pluginProps.remove === 'function') {
                  if (e.key === 'Backspace') {
                    focusPrevious()
                  } else if (e.key === 'Delete') {
                    focusNext()
                  }
                  setTimeout(pluginProps.remove)
                }
              })
            }
          }
        }}
      >
        <StyledDocument
          onMouseDown={handleFocus}
          ref={container}
          data-document
          tabIndex={-1}
        >
          <Comp
            {...pluginProps}
            editable
            focused={focused}
            state={state}
            name={document.plugin}
          />
        </StyledDocument>
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    document,
    // focusNext, TODO:
    // focusPrevious, TODO:
    focused,
    id,
    plugin,
    // pluginProps, TODO:
    dispatch
  ])
}
