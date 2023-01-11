import {
  Configuration,
  EnvironmentPlugin,
  ModuleOptions,
  WebpackPluginInstance,
} from 'webpack'

export const core = {
  builder: 'webpack5',
}

export const stories = ['../__stories__/*.@(ts|tsx)']
export const addons = ['@storybook/addon-actions', '@storybook/addon-knobs']

interface WebpackConfiguration extends Configuration {
  module: ModuleOptions
  plugins: WebpackPluginInstance[]
  devServer: {
    stats: string
  }
}

export async function webpackFinal(
  config: WebpackConfiguration
): Promise<WebpackConfiguration> {
  if (!config.module.rules) {
    config.module.rules = []
  }

  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve('babel-loader'),
    options: {
      rootMode: 'upward',
    },
  })
  config.plugins.push(
    new EnvironmentPlugin({
      TITLE: '',
    })
  )
  config.devServer = {
    stats: 'errors-only',
  }
  return config
}
