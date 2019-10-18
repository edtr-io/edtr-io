import { Value } from 'slate'
import Html from 'slate-html-serializer'

import { rules } from './rules'
import { defaultNode } from './slate'

const serializer = new Html({ rules, defaultBlock: { type: defaultNode } })

export function htmlToSlateValue(html: string) {
  return serializer.deserialize(html, { toJSON: false })
}

export function slateValueToHtml(value: Value) {
  return serializer.serialize(value, { render: true })
}
