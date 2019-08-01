module.exports = function(api) {
  return {
    presets: [
      '@babel/preset-env',
      '@babel/preset-react',
      '@babel/preset-typescript'
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-transform-runtime',
      ...(api.env(['development', 'test'])
        ? [
            [
              'babel-plugin-module-resolver',
              {
                alias: {
                  '@edtr-io/core': '@edtr-io/core/src',
                  '@edtr-io/renderer': '@edtr-io/renderer/src',
                  '@edtr-io/renderer-ssr': '@edtr-io/renderer-ssr/src',
                  '@edtr-io/ui': '@edtr-io/ui/src',
                  '@edtr-io/editor-ui': '@edtr-io/editor-ui/src',
                  '@edtr-io/renderer-ui': '@edtr-io/renderer-ui/src',
                  '@edtr-io/plugin-anchor': '@edtr-io/plugin-anchor/src',
                  '@edtr-io/plugin-blockquote':
                    '@edtr-io/plugin-blockquote/src',
                  '@edtr-io/plugin-equations': '@edtr-io/plugin-equations/src',
                  '@edtr-io/plugin-files': '@edtr-io/plugin-files/src',
                  '@edtr-io/plugin-geogebra': '@edtr-io/plugin-geogebra/src',
                  '@edtr-io/plugin-h5p': '@edtr-io/plugin-h5p/src',
                  '@edtr-io/plugin-highlight': '@edtr-io/plugin-highlight/src',
                  '@edtr-io/plugin-hint': '@edtr-io/plugin-hint/src',
                  '@edtr-io/plugin-image': '@edtr-io/plugin-image/src',
                  '@edtr-io/plugin-important-statement':
                    '@edtr-io/plugin-important-statement/src',
                  '@edtr-io/plugin-input-exercise':
                    '@edtr-io/plugin-input-exercise/src',
                  '@edtr-io/plugin-rows': '@edtr-io/plugin-rows/src',
                  '@edtr-io/plugin-sc-mc-exercise':
                    '@edtr-io/plugin-sc-mc-exercise/src',
                  '@edtr-io/plugin-serlo-injection':
                    '@edtr-io/plugin-serlo-injection/src',
                  '@edtr-io/plugin-solution': '@edtr-io/plugin-solution/src',
                  '@edtr-io/plugin-spoiler': '@edtr-io/plugin-spoiler/src',
                  '@edtr-io/plugin-table': '@edtr-io/plugin-table/src',
                  '@edtr-io/plugin-text': '@edtr-io/plugin-text/src',
                  '@edtr-io/plugin-video': '@edtr-io/plugin-video/src'
                },
                loglevel: 'silent'
              }
            ]
          ]
        : [])
    ]
  }
}
