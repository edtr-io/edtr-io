import { PluginRepresentation } from '@edtr-io/core'
import convertHastToString from 'hast-util-to-html'

// TODO: The specific type definitions of hast should be used instead of the
// more general type `Node'
import { Node } from 'unist'

/**
 * Converts an editor plugin into text with markup. This text can be reconverted
 * into the editor plugin with the function `deserializePlugin()`.
 *
 * @param plugin Representation of the editor plugin
 */
export function serializePlugin(plugin: PluginRepresentation): string {
  return convertHastToString(convertPluginToHast(plugin))
}

/**
 * Converts a representation of an editor plugin into an hast tree.
 *
 * @param plugin Representation of plugin which shall be converted
 */
export function convertPluginToHast(plugin: PluginRepresentation): Node {
  if (
    typeof plugin.state === 'string' ||
    typeof plugin.state === 'number' ||
    typeof plugin.state === 'boolean'
  ) {
    return convertValueToHast(plugin.plugin, plugin.state)
  } else {
    throw TypeError('The state type of the plugin is not convertable')
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
