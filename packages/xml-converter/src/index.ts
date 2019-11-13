import * as R from 'ramda'
import { js2xml, Element as XmlElement } from 'xml-js'

/*
 * Type for the plugin state which can be converted with
 */
// TODO: Move the following types to @edtr-io/core
export type PluginState = number | boolean | string | PluginStateArray |
                          { [property: string]: PluginState }

// Workaround because Typescript does not support recursive types before version
// 3.7 (see https://stackoverflow.com/a/45999529/1165155 ). With Typescript 3.7
// or above, this Workaround should be removed.
//
// TODO: Remove this workaround when Typescript 3.7 or above is used.
export interface PluginStateArray extends Array<PluginState> { }

/*
 * Type guard for `PluginStateArray`.
 */
function isPluginStateArray(arg: any): arg is PluginStateArray {
  return Array.isArray(arg)
}

/*
 * Converts a plugin state into a XML string. With the function
 * `xmlToPluginState()` this string can be converted back into the same
 * plugin state.
 *
 * @param state Plugin state which shall be converted
 */
export function pluginStateToXml(state: PluginState): string {
  return js2xml(
    { elements: [pluginStateToXmlElement(state)] },
    { spaces: 2, fullTagEmptyElement: true }
  )
}

/*
 * Converts a plugin state into XML using the JSON representation of the
 * project `xml-js`. If `prefix` is set the converted XML element has the tag
 * name `<prefix>.<type of state>` instead of `<type of state>`.
 *
 * @param state Plugin state which shall be converted
 * @param prefix Optional prefix for the created XML element
 */
function pluginStateToXmlElement(
  state: PluginState,
  prefix?: string
): XmlElement {
  let tagType;
  let attributes;
  let children;

  if (typeof state === 'number') {
    tagType = 'number'
    children = [xmlText(String(state))]
  } else if (typeof state === 'boolean') {
    tagType = 'boolean'
    children = [xmlText(String(state))]
  } else if (typeof state === 'string') {
    tagType = 'string'
    children = [xmlText(String(state))]
  } else if (isPluginStateArray(state)) {
    tagType = 'list'
    children = state.map(x => pluginStateToXmlElement(x))
  } else {
    tagType = 'object',
    children = R.toPairs(state).map(R.apply(R.flip(pluginStateToXmlElement)))
  }

  let tagName = prefix ? prefix + "." + tagType : tagType

  return xmlElement(tagName, attributes, children)
}

/*
 * Helper function for creating an XML element in the JSON representation of the
 * package `xml-js`.
 *
 * @param tagName Tag name of the created XML element
 * @param attributes Attributes of the created XML element
 * @param children Children of the created XML element
 */
function xmlElement(
  tagName: string,
  attributes: { [key: string]: string } = {},
  children: XmlElement[] = []
) {
  return {
    type: 'element',
    name: tagName,
    attributes: attributes,
    elements: children
  }
}

/*
 * Helper function for creating a XML text node in the JSON representation of
 * the package `xml-js`.
 *
 * @param text Text value of the created text node
 */
function xmlText(text: string): XmlElement {
  return { type: 'text', text: text }
}
