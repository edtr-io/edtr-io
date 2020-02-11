/* eslint-disable import/no-commonjs */
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
                  '^@edtr-io/([^/]+)(.*)$': ([_, packageName, filePath]) => {
                    const base = `@edtr-io/${packageName}`
                    if (filePath.startsWith('/__fixtures__')) {
                      return `${base}${filePath}`
                    }
                    if (
                      filePath.startsWith('/beta') ||
                      filePath.startsWith('/internal')
                    ) {
                      return `${base}/src${filePath
                        .replace('/beta', '')
                        .replace('/internal', '')}`
                    }
                    return `${base}/src${filePath}`
                  }
                },
                loglevel: 'silent'
              }
            ]
          ]
        : [])
    ]
  }
}
