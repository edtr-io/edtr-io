const { EnvironmentPlugin } = require('webpack')

/* eslint-disable import/no-commonjs */
module.exports = {
  core: {
    builder: 'webpack5',
  },
  stories: ['../__stories__/*.@(ts|tsx)'],
  addons: ['@storybook/addon-actions', '@storybook/addon-knobs'],

  webpackFinal(config) {
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
  },
}
