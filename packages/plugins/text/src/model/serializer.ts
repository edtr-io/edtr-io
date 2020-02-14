import { Value } from 'slate'
import Html from 'slate-html-serializer'

import { rules } from './rules'
import { defaultNode } from './schema'

const serializer = new Html({ rules, defaultBlock: { type: defaultNode } })

/** @internal */
export function htmlToSlateValue(html: string) {
  return serializer.deserialize(html, { toJSON: false })
}

/** @internal */
export function slateValueToHtml(value: Value) {
  return serializer.serialize(value, { render: true })
}
