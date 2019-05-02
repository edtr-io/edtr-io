/* eslint-disable  @typescript-eslint/no-var-requires */
const path = require('path')
const createNodeExternals = require('webpack-node-externals')

module.exports = {
  mode: 'production',
  entry: path.join(__dirname, 'src', 'index.ts'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: require.resolve('babel-loader'),
        exclude: /node_modules/,
        options: {
          rootMode: 'upward'
        }
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: require.resolve('file-loader')
      }
    ]
  },
  externals: [
    createNodeExternals(),
    createNodeExternals({
      modulesDir: path.resolve(__dirname, '../../node_modules')
    })
  ]
}
/* eslint-enable  @typescript-eslint/no-var-requires */
