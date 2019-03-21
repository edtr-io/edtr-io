module.exports = function(api) {
  return {
    presets: [
      '@babel/preset-env',
      '@babel/preset-react',
      '@babel/preset-typescript'
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties',
      ...(api.env(['development', 'test'])
        ? [
            [
              'babel-plugin-module-resolver',
              {
                alias: {
                  '@edtr-io/core': '@edtr-io/core/src',
                  '@edtr-io/ui': '@edtr-io/ui/src',
                  '@edtr-io/plugin-anchor': '@edtr-io/plugin-anchor/src',
                  '@edtr-io/plugin-blockquote':
                    '@edtr-io/plugin-blockquote/src',
                  '@edtr-io/plugin-equations': '@edtr-io/plugin-equations/src',
                  '@edtr-io/plugin-geogebra': '@edtr-io/plugin-geogebra/src',
                  '@edtr-io/plugin-highlight': '@edtr-io/plugin-highlight/src',
                  '@edtr-io/plugin-image': '@edtr-io/plugin-image/src',
                  '@edtr-io/plugin-input-exercise': '@edtr-io/plugin-input-exercise/src',
                  '@edtr-io/plugin-rows': '@edtr-io/plugin-rows/src',
                  '@edtr-io/plugin-sc-mc-exercise':
                    '@edtr-io/plugin-sc-mc-exercise/src',
                  '@edtr-io/plugin-spoiler': '@edtr-io/plugin-spoiler/src',
                  '@edtr-io/plugin-text': '@edtr-io/plugin-text/src',
                  '@edtr-io/plugin-video': '@edtr-io/plugin-video/src'
                }
              }
            ]
          ]
        : [])
    ]
  }
}
