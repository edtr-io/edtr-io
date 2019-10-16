/*
export function serialize(value: ValueJSON) {
  console.log('slate state', value.toJSON())
  return clean(
    handleNode(value.document),
    { wrap: 88, 'add-break-around-tags': ['li', 'ul', 'ol', 'mathblock'] },
    html => {
      console.log('sane html')
      console.log(html)
      console.log(parseHTML(html))
    }
  )
}

function handleNode(node) {
  return node.nodes.map(serializeNode).join('')
}

function serializeNode(node) {
  if (node.object === 'block') {
    if (node.type === 'paragraph') {
      return '<p>' + handleNode(node) + '</p>'
    }
    if (node.type === unorderedListNode) {
      return `<ul>${handleNode(node)}</ul>`
    }
    if (node.type === orderedListNode) {
      return `<ol>${handleNode(node)}</ol>`
    }
    if (node.type === listItemNode) {
      return `<li>${handleNode(node)}</li>`
    }
    if (node.type === listItemChildNode) {
      return handleNode(node)
    }
    if (node.type.includes('@splish-me/h')) {
      const level = node.type.charAt(12)
      return `<h${level}>${handleNode(node)}</h${level}>`
    }
    if (node.type === katexBlockNode) {
      return `<mathblock>${node.data.get('formula')}</mathblock>`
    }
  } else if (node.object === 'inline') {
    if (node.type === linkNode) {
      return `<a href="${node.data.get('href')}">${handleNode(node)}</a>`
    }
    if (node.type === katexInlineNode) {
      return `<math>${node.data.get('formula')}</math>`
    }
  } else if (node.object === 'text') {
    let resultText = node.text
    node.marks.forEach(mark => {
      if (mark.type === colorMark) {
        resultText = `<color index="${mark.data.get(
          'colorIndex'
        )}">${resultText}</color>`
      } else if (mark.type === strongMark) {
        resultText = `<b>${resultText}</b>`
      } else if (mark.type === emphasizeMark) {
        resultText = `<em>${resultText}</em>`
      } else if (mark.type === codeMark) {
        // not implemented
      } else {
        // DONE
        console.error('unhandled mark', node.object, node.type)
      }
    })
    return resultText
  }
  console.error('unhandled', node.object, node.type)
}
*/
