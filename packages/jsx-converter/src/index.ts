import { EditorProps } from '@edtr-io/core'

/**
 * Converts an editor state into a JSX formatted string.
 *
 * @param state the editor state
 */
export function toJSX(state: EditorProps['initialState']): string {
  return ''
}

/**
 * Converts an object's property to an hast node. This function is used by
 * `convertPluginStateToHast()` in order to convert the properties of an object.
 *
 * @param property The key of the object's property
 * @param value The value of the object's property
 */
// TODO: Use type definitions for hast
export function convertPropertyToHast(
  property: string,
  value: string | number | boolean
): object {
  return hastElement(property, undefined, [hastText(String(value))])
}

/**
 * Creates an hast element with the tag name `tagName` and the given properties
 * and children.
 *
 * @param tagName The tag name of the hast element
 * @param properties Properties of the hast element
 * @param children children of the hast element
 */
function hastElement(tagName: string, properties = {}, children = []) {
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
function hastText(text: string) {
  return {
    type: 'text',
    value: text
  }
}
