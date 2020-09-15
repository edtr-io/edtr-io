import {
  Configuration,
  EnvironmentPlugin,
  Module,
  Options,
  Plugin,
} from 'webpack'

export const stories = ['../__stories__/*.@(ts|tsx)']
export const addons = ['@storybook/addon-actions', '@storybook/addon-knobs']

interface WebpackConfiguration extends Configuration {
  module: Module
  plugins: Plugin[]
  devServer: {
    stats: Options.Stats
  }
}

export async function webpackFinal(
  config: WebpackConfiguration
): Promise<WebpackConfiguration> {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve('babel-loader'),
    options: {
      rootMode: 'upward',
    },
  })
  config.plugins.push(new EnvironmentPlugin(['TITLE']))
  config.devServer = {
    stats: 'errors-only',
  }
  return config
}
