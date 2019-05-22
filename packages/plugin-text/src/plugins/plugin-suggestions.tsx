import * as React from 'react'
import { Suggestions } from './suggestions'
import { SlatePluginClosure } from '../factory/types'
import { TextPlugin } from '..'
import { Value, Inline, Block, Editor } from 'slate'
import { defaultNode, isValueEmpty } from '../factory'
import { HoveringOverlay } from '@edtr-io/editor-ui'

/**
 * The decoration mark type that the menu will position itself against. The
 * "context" is just the current text after the / symbol.
 * @type {String}
 */

const CONTEXT_MARK_TYPE = 'mentionContext'

/**
 * The regex to use to find the searchQuery.
 *
 * @type {RegExp}
 */

const CAPTURE_REGEX = /^\/.*$/

function getInput(value: Value) {
  const input = value.document.text
  if (CAPTURE_REGEX.test(input)) {
    return input
  }

  return null
}

function hasValidAncestors(value: Value) {
  const { document, selection } = value
  if (!selection.start.key) {
    return false
  }

  const invalidParent = document.getClosest(
    selection.start.key,

    node => (node as Block | Inline).type !== defaultNode
  )
  return !invalidParent
}

function updateDecorationMarkData(
  editor: Editor,
  inputValue: string,
  dataValue: number
) {
  const { selection } = editor.value
  let decorations = editor.value.decorations.filter(
    //@ts-ignore FIXME
    value => value.mark.type !== CONTEXT_MARK_TYPE
  )

  //@ts-ignore FIXME
  decorations = decorations.push({
    anchor: {
      key: selection.start.key,
      offset: selection.start.offset - inputValue.length
    },
    focus: {
      key: selection.start.key,
      offset: selection.start.offset
    },
    mark: {
      type: CONTEXT_MARK_TYPE,
      data: { selected: dataValue }
    }
  })
  //@ts-ignore FIXME
  editor.setDecorations(decorations)
}

function mapPlugins(pluginClosure: SlatePluginClosure, editor: Editor) {
  if (pluginClosure.current) {
    const plugins = pluginClosure.current.plugins
    const search = (getInput(editor.value) || '').replace('/', '')
    const startPlugins = Object.keys(plugins)
      .filter(pluginKey => {
        const plugin = plugins[pluginKey]
        if (pluginKey === name || pluginKey === 'rows') return false
        if (!search.length) return true

        if (
          plugin.title &&
          plugin.title.toLowerCase().startsWith(search.toLowerCase())
        )
          return true

        // if (pluginKey.toLowerCase().includes(search.toLowerCase()))
        //   return true
        return false
      })
      .map(pluginName => [plugins[pluginName].title || pluginName, pluginName])
    const includePlugins = Object.keys(plugins)
      .filter(pluginKey => {
        const plugin = plugins[pluginKey]
        if (pluginKey === name || pluginKey === 'rows') return false

        if (
          plugin.title &&
          plugin.title.toLowerCase().includes(search.toLowerCase()) &&
          !plugin.title.toLowerCase().startsWith(search.toLowerCase())
        )
          return true

        // if (pluginKey.toLowerCase().includes(search.toLowerCase()))
        //   return true
        return false
      })
      .map(pluginName => [plugins[pluginName].title || pluginName, pluginName])
    return startPlugins.concat(includePlugins)
  }
  return []
}

function decreaseValue(index: number, length: number) {
  return index - 1 < 0 ? length - 1 : index - 1
}
function insertPlugin(editor: Editor) {
  return (option: string) => {
    editor.command('replaceWithPlugin', {
      plugin: option
    })
  }
}
export function pluginSuggestions(
  pluginClosure: SlatePluginClosure
): TextPlugin {
  return {
    renderMark(props, editor, next) {
      const mappedPlugins = mapPlugins(pluginClosure, editor)

      if (
        props.mark.type === CONTEXT_MARK_TYPE &&
        hasValidAncestors(editor.value)
      ) {
        return (
          <React.Fragment>
            <span {...props.attributes} className="mention-context">
              {props.children}
            </span>
            <HoveringOverlay position={'below'}>
              <Suggestions
                selected={props.mark ? props.mark.data.get('selected') : 0}
                options={mappedPlugins}
                onSelect={insertPlugin(editor)}
                currentValue={(getInput(editor.value) || '').replace('/', '')}
                name={pluginClosure.current ? pluginClosure.current.name : ''}
              />
            </HoveringOverlay>
          </React.Fragment>
        )
      }

      return next()
    },
    onKeyDown(event, editor, next) {
      if (pluginClosure.current && pluginClosure.current.replace) {
        const e = (event as unknown) as KeyboardEvent
        const inputValue = getInput(editor.value) || ''
        const decoration = editor.value.decorations.find(decoration =>
          decoration ? decoration.get('mark').type === CONTEXT_MARK_TYPE : false
        )
        const plugins = mapPlugins(pluginClosure, editor)
        if (
          (e.key === '/' && isValueEmpty(editor.value)) ||
          (inputValue && hasValidAncestors(editor.value))
        ) {
          if (e.key === 'Enter' && plugins.length) {
            insertPlugin(editor)(
              plugins[decoration.get('mark').data.get('selected')][1]
            )
            return
          }
          if (e.key === '/') {
            updateDecorationMarkData(editor, inputValue + '/', 0)
          } else {
            updateDecorationMarkData(editor, inputValue, 0)
          }
        }

        if (decoration) {
          const mark = decoration.get('mark')
          if (e.key === 'ArrowDown' && mark) {
            e.preventDefault()
            updateDecorationMarkData(
              editor,
              inputValue,
              (mark.data.get('selected') + 1) % plugins.length
            )
            return
          } else if (e.key === 'ArrowUp' && mark) {
            e.preventDefault()
            updateDecorationMarkData(
              editor,
              inputValue,
              decreaseValue(mark.data.get('selected'), plugins.length)
            )
            return
          }
        }
      }
      return next()
    }
  }
}
