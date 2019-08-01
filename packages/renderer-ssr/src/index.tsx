import { Renderer, RendererProps } from '@edtr-io/renderer'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'
import { renderToString } from 'react-dom/server'
import * as React from 'react'

export function render<K extends string = string>(props: RendererProps<K>) {
  const sheet = new ServerStyleSheet()

  const html = renderToString(
    <StyleSheetManager sheet={sheet.instance}>
      <Renderer {...props} />
    </StyleSheetManager>
  )

  return {
    styles: sheet.getStyleTags(),
    html
  }
}
