/* eslint-disable @typescript-eslint/no-var-requires, import/no-commonjs */
const fs = require('fs')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

const src = path.join(__dirname, 'src')

const entry = {}
fs.readdirSync(src)
  .filter(fileName => path.extname(fileName) === '.tsx')
  .forEach(fileName => {
    entry[path.basename(fileName)] = path.join(src, fileName)
  })

module.exports = {
  mode: 'production',
  entry,
  output: {
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: '[name].[chunkhash:8].js',
    filename: '[name].js',
    devtoolModuleFilenameTemplate(info) {
      const relativePath = path.relative(
        path.join(__dirname, '..', '..'),
        info.absoluteResourcePath
      )
      return `webpack:///${relativePath}`
    }
  },
  module: {
    rules: [
      {
        test: /\.(tsx?|js)$/,
        exclude: /node_modules/,
        loader: require.resolve('babel-loader'),
        options: {
          rootMode: 'upward'
        }
      },
      {
        test: /\.mjs$/,
        resolve: {
          mainFields: ['module', 'main']
        },
        include: /node_modules/,
        type: 'javascript/auto'
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp3|ogg)(\?.*)?$/,
        loader: require.resolve('file-loader'),
        options: {
          name: '[name].[hash:8].[ext]'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.mjs', '.js']
  },
  target: 'web',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static'
    }),
    new MiniCssExtractPlugin({
      chunkFilename: '[id].[chunkhash:8].css',
      filename: '[name].css'
    })
  ],
  optimization: {
    minimizer: [
      new OptimizeCssAssetsPlugin(),
      new TerserPlugin({
        parallel: true
      })
    ]
  }
}
