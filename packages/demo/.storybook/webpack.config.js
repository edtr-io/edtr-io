module.exports = (baseConfig, env, config) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve('babel-loader'),
    options: {
      rootMode: 'upward',
      plugins: [
        [
          'babel-plugin-module-resolver',
          {
            alias: {
              '@edtr-io/core': '@edtr-io/core/src',
              '@edtr-io/ui': '@edtr-io/ui/src',
              '@edtr-io/plugin-anchor': '@edtr-io/plugin-anchor/src',
              '@edtr-io/plugin-blockquote': '@edtr-io/plugin-blockquote/src',
              '@edtr-io/plugin-geogebra': '@edtr-io/plugin-geogebra/src',
              '@edtr-io/plugin-spoiler': '@edtr-io/plugin-spoiler/src',
              '@edtr-io/plugin-text': '@edtr-io/plugin-text/src'
            }
          }
        ]
      ]
    }
  })
  config.resolve.extensions.push('.ts', '.tsx')
  return config
}
