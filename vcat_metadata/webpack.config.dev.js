require('dotenv').config()

const HtmlWebpackPlugin = require('html-webpack-plugin')
// const CleanWebpackPlugin = require('clean-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: {
    main: './client/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  devServer: {
    port: 9000,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    // publicPath: '/dist/',
    hot: true,
  },
  devtool: 'inline-source-map',
  resolve: {
    alias: {
      'vcat-header': path.resolve(__dirname, '../app/components/common/header.component.js'),
      'vcat-auth-reducer': path.resolve(__dirname, '../app/reducers/auth.reducer.js'),
    }
  },
  plugins: [
    // new CleanWebpackPlugin(['dist']),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"',
      'process.env.S3_HOST': '"' + process.env.S3_HOST + '"',
      'process.env.API_HOST': '"http://127.0.0.1:8000"',

    }),
    new HtmlWebpackPlugin({
      title: 'VFrame Metadata',
      meta: {
        viewport: 'width=device-width,initial-scale=1.0'
      }
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.js$/,
        // include: path.resolve(__dirname, 'client'),
        exclude: /(node_modules|bower_components|build)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
            plugins: [
              require('babel-plugin-transform-runtime'),
              require('babel-plugin-transform-es2015-arrow-functions'),
              require('babel-plugin-transform-object-rest-spread'),
              require('babel-plugin-transform-class-properties'),
              require('babel-plugin-transform-react-jsx'),
              require('react-hot-loader/babel')
            ]
          }
        }
      }
    ]
  }
};
