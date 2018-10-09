const resolve = require('path').resolve
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const url = require('url')
const publicPath = ''

module.exports = (options = {}) => ({
  entry: {
    vendor: './src/vendor',
    index: './src/main.js'
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: options.dev ? '[name].js' : '[name].js?[chunkhash]',
    chunkFilename: '[id].js?[chunkhash]',
    publicPath: options.dev ? '/assets/' : publicPath
  },
  module: {
    rules: [{
      test: /\.vue$/,
      use: ['vue-loader']
    },
    {
      test: /\.js$/,
      use: [{
          loader: 'babel-loader',
          options: {
             presets: ['es2015']
          }
        }],
      exclude: /node_modules/
    },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader', 'postcss-loader']
    },
    {
      test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }]
    }
    ],
    loaders: [
      { test: /\.vue$/, loaders: ['strip-loader?strip[]=console.log,strip[]=console.warn', 'vue'] },
      { test: /\.js$/, exclude: /node_modules/, loaders: ['strip-loader?strip[]=console.log,strip[]=console.warn', 'babel'] },
      { test: /\.js$/,exclude: /(node_modules|bower_components)/,loader: 'babel',query: {presets: ['es2015']} }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ],
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src')
    }
  },
  resolveLoader: {
    alias: {
      'scss-loader': 'sass-loader',
    },
  },
  devServer: {
    host: '127.0.0.1',
    port: 8012,
    proxy: {
      '/app-discovery/': {
        target: 'http://localhost:9006/',
        changeOrigin: true,
        pathRewrite: {
          // '^/app-discovery': '/development'
        }
      }
    },
    historyApiFallback: {
      index: url.parse(options.dev ? '/assets/' : publicPath).pathname
    }
  },
  devtool: options.dev ? '#eval-source-map' : '#source-map'
})
