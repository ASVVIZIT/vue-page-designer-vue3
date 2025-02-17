const path = require('path')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const crypto = require('crypto')
const crypto_orig_createHash = crypto.createHash
crypto.createHash = algorithm => crypto_orig_createHash(algorithm === 'md4' ? 'sha256' : algorithm)

const env = process.env.NODE_ENV
const production = env === 'production'

// render page
const page = (name) => {
  return new HtmlWebpackPlugin({
    inject: true,
    template: path.join(__dirname, `./${name}.html`),
    filename: path.join(__dirname, `./dist/${name}.html`)
  })
}

const config = {
  mode: production ? 'production' : 'development',
  devtool: production ? 'source-map' : 'cheap-source-map',
  entry: {
    app: path.join(__dirname, './index.js')
  },
  output: {
    hashFunction: 'sha256',
    path: path.join(__dirname, 'dist'),
    filename: 'js/[name].js'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/style.css'
    }),
    new CleanWebpackPlugin(['./dist']),
    new VueLoaderPlugin(),
    new webpack.LoaderOptionsPlugin({ options: {} }),
    new FriendlyErrorsWebpackPlugin(),
    new ProgressBarPlugin(),
    page('index')
  ],
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  devServer: {
    contentBase: path.join(__dirname),
    // historyApiFallback: true,
    hot: true,
    inline: true,
    stats: 'errors-only',
    host: '127.0.0.1',
    port: 9001
  },
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        enforce: 'pre'
      },
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: { babelrc: true }
        }
      },
      {
        test: /\.vue$/,
        loader: 'eslint-loader',
        enforce: 'pre'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            js: [{ loader: 'cache-loader' }],
          },
          extractCSS: true,
        },
      },
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss?$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(ttf|eot|svg)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: 'font/[name].[ext]'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.scss', '.vue']
  }
}

module.exports = config
