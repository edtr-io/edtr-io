import { Plugin } from '../types'

export class PluginRegistry<K extends string = string> {
  constructor(private plugins: Record<K, Plugin<any>>) {}

  public getPlugin<S = any>(name: K): Plugin<S> | null {
    const plugin = this.plugins[name]

    if (!plugin) {
      return null
    }

    return plugin
  }
}
