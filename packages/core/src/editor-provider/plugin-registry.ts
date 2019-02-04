import { Plugin } from '../types'

export class PluginRegistry<K extends string = string> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public constructor(private plugins: Record<K, Plugin<any>>) {}

  public getPlugin<S = unknown>(name: K): Plugin<S> | null {
    const plugin = this.plugins[name]

    if (!plugin) {
      return null
    }

    return plugin
  }
}
