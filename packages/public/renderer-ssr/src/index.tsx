/**
 * @module @edtr-io/renderer-ssr
 */
/** Comment needed because of https://github.com/christopherthielen/typedoc-plugin-external-module-name/issues/337 */
import { Renderer, RendererProps } from '@edtr-io/renderer'
import * as React from 'react'
import { renderToString } from 'react-dom/server'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

/** @public */
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

export { RendererProps }
