import { child, EditorPluginProps, EditorPlugin } from '@edtr-io/plugin'

import { WrapperEditor } from './editor'

function createWrapperState(content: Parameters<typeof child>) {
  return child(...content)
}

export type WrapperState = ReturnType<typeof createWrapperState>
export type WrapperProps = EditorPluginProps<WrapperState>

export function createWrapperPlugin({
  content = []
}: {
  content?: Parameters<typeof child>
} = {}): EditorPlugin<WrapperState> {
  return {
    Component: WrapperEditor,
    state: createWrapperState(content),
    config: {}
  }
}
