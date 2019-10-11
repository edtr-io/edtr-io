import { EditorProps } from '@edtr-io/core'

// TODO: The specific type definitions of hast should be used instead of the
// more general type `Node'
import { Node } from 'unist'

/**
 * Converts an editor state into a JSX formatted string.
 *
 * @param state the editor state
 */
export function toJSX(state: EditorProps['initialState']): string {
  return ''
}

/**
 * Converts a plugin state into an hast tree.
 *
 * @param pluginState State of plugin which shall be converted
 */
export function convertPluginStateToHast(pluginState: {
  plugin: string
  state?: unknown
}): Node {
  if (
    typeof pluginState.state === 'string' ||
    typeof pluginState.state === 'number' ||
    typeof pluginState.state === 'boolean'
  ) {
    return convertValueToHast(pluginState.plugin, pluginState.state)
  } else {
    throw TypeError('The plugin state is not convertable')
  }
}

/**
 * Converts the JavaScript value `value` into an hast element node with the name
 * `tagName`.
 *
 * @param tagName The element name of the returned hast node
 * @param value The value which shall be converted into an hast node
 */
export function convertValueToHast(
  tagName: string,
  value: string | number | boolean
): Node {
  return hastElement(tagName, undefined, [hastText(String(value))])
}

/**
 * Creates an hast element with the tag name `tagName` and the given properties
 * and children.
 *
 * @param tagName The tag name of the hast element
 * @param properties Properties of the hast element
 * @param children children of the hast element
 */
function hastElement(
  tagName: string,
  properties: { [key: string]: string } = {},
  children: Node[] = []
): Node {
  return {
    type: 'element',
    tagName: tagName,
    properties: properties,
    children: children
  }
}

/**
 * Converts the string `text` to an hast element.
 *
 * @param text String which shall be converted to an hast element
 */
function hastText(text: string): Node {
  return {
    type: 'text',
    value: text
  }
}
