import { Value } from 'slate'
import Html from 'slate-html-serializer'

import { rules } from './rules'
import { defaultNode } from './schema'

const serializer = new Html({ rules, defaultBlock: { type: defaultNode } })

/**
 * @param html - The HTML string that should be deserialized to a Slate value
 * @internal
 */
export function htmlToSlateValue(html: string) {
  return serializer.deserialize(html, { toJSON: false })
}

/**
 * @param value - The Slate value that should be serialized as HTML
 * @internal
 */
export function slateValueToHtml(value: Value) {
  return serializer.serialize(value, { render: true })
}
