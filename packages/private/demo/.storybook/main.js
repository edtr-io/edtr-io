const webpack = require('webpack')

module.exports = {
  stories: ['../__stories__/*.@(ts|tsx)'],
  addons: ['@storybook/addon-actions', '@storybook/addon-knobs'],
  async webpackFinal(config) {
    config.plugins.push(new webpack.EnvironmentPlugin(['TITLE']))
    config.devServer = {
      stats: 'errors-only',
    }
    return config
  },
}
