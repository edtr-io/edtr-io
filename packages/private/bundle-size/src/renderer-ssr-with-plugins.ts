import { render as core, RendererProps } from '@edtr-io/renderer-ssr'

import { plugins } from './shared/plugins'

export function render(props: Omit<RendererProps, 'plugins'>) {
  return core({ plugins, ...props })
}
