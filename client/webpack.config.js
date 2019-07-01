const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")

const path = require('path')
require('babel-polyfill')

const nodeEnv = process.env.NODE_ENV || 'development'
const isProd = nodeEnv === 'production'

const rootPath = 'onestop'
const assetPath = 'static'

const smp = new SpeedMeasurePlugin()

// cesium
const cesiumSource = "node_modules/cesium/Source"
const cesiumWorkers = "../Build/Cesium/Workers"

const basePlugins = [
  new HtmlWebpackPlugin({
    inject: false,
    template: require('html-webpack-template'),
    lang: 'en-US',
  }),
  new CopyWebpackPlugin([
    {
      from: path.join(cesiumSource, cesiumWorkers),
      to: "Workers",
    },
    {
      from: path.join(cesiumSource, "Assets"),
      to: "Assets",
    },
    {
      from: path.join(cesiumSource, "Widgets"),
      to: "Widgets",
    },
  ]),
  new webpack.DefinePlugin({
    CESIUM_BASE_URL: JSON.stringify(""),
  }),
]

const devPlugins = [
  // enable HMR globally
  new webpack.HotModuleReplacementPlugin(),

  // prints more readable module names in the browser console on HMR updates
  new webpack.NamedModulesPlugin(),
]

const prodPlugins = [
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production'),
    },
  }),
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false,
  }),
]

const devEntryPoints = [
  'babel-polyfill',

  // bundle the client for webpack-dev-server and connect to the provided endpoint
  // ensure host and port here matches the host and port specified in the `devServer` section
  // otherwise, you may see console warnings like: `sockjs-node ERR_CONNECTION_REFUSED`
  // see: https://github.com/webpack/webpack-dev-server/issues/416#issuecomment-287797086
  'webpack-dev-server/client?http://localhost:9090',

  // bundle the client for hot reloading hot reload for successful updates
  'webpack/hot/only-dev-server',

  './index.jsx',
]

const prodEntryPoints = [
  'babel-polyfill',
  './index.jsx',
]

module.exports = env => {
  return smp.wrap({
    entry: isProd ? prodEntryPoints : devEntryPoints,
    output:
        {
          path: path.resolve(__dirname, 'build/dist'),
          publicPath: `/${rootPath}/`,
          filename: '[name]-[hash].bundle.js',
          // Needed to compile multiline strings in Cesium
          sourcePrefix: ''
        }
    ,
    amd: {
      // Enable webpack-friendly use of require in Cesium
      toUrlUndefined: true
    },
    node: {
      // Resolve node module use of fs
      fs: 'empty'
    },
    context: path.resolve(__dirname, 'src'),
    devtool:
        isProd ? false : 'cheap-module-eval-source-map',
    devServer:
        isProd ? {} : {
          publicPath: `/${rootPath}/`,
          historyApiFallback: {
            index: `/${rootPath}/`,
          },
          // ensure host and port here matches the host and port specified in the `devEntryPoints` above
          // otherwise, you may see console warnings like: `sockjs-node ERR_CONNECTION_REFUSED`
          // see: https://github.com/webpack/webpack-dev-server/issues/416#issuecomment-287797086
          host: 'localhost',
          port: 9090,
          disableHostCheck: true,
          hot: true,
          proxy: {
            '/onestop-search/*': {
              target: `${env.URL_API_SEARCH}/`,
              secure: false,
            },
          },
        },
    module:
        {
          rules: [{
            enforce: 'pre',
            test: /\.js$/,
            use: 'eslint-loader',
            exclude: /node_modules/,
          }, {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                babelrc: true,
                babelrcRoots: ['.', '../'],
              },
            },
          },
          isProd ? {
            // Strip cesium pragmas for prod
            test: /\.js$/,
            enforce: "pre",
            include: path.resolve(__dirname, cesiumSource),
            use: [
              {
                loader: "strip-pragma-loader",
                options: {
                  pragmas: {
                    debug: false,
                  },
                },
              },
            ],
          } : {},
          {
            test: /\.css$/,
            include: /node_modules/,
            use: [{
              loader: 'style-loader',
              options: {
                sourceMap: !isProd,
              },
            }, {
              loader: 'css-loader',
            }],
          }, {
            test: /\.css$/,
            exclude: /node_modules/,
            use: [{
              loader: 'style-loader',

            }, {
              loader: 'css-loader', options: {url:false}
            }],
          }, {
            test: /\.(jpe?g|png|gif|svg)$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  hash: 'sha512',
                  digestType: 'hex',
                  name: '[hash].[ext]',
                  outputPath: `${assetPath}/img`
                },
              },
            ],
          }, {
            test: /\.(ico)$/,
            exclude: /node_modules/,
            include: /img/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: '[name].[ext]',
                  outputPath: assetPath
                },
              },
            ],
          }, {
            test: /\.(ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
            use: [{loader: 'file-loader'
              , options: {
                name: '/[name].[ext]',
                outputPath: `${assetPath}/fonts`
            }
          }]
          }],
        }
    ,
    resolve: {
      modules: [path.resolve('./node_modules/leaflet/dist', 'root'), 'node_modules',
        path.resolve('./src/common/link')],
      extensions:
          ['.js', '.jsx'],
      unsafeCache:
          !isProd,
      alias:
          {
            'fa':
                path.resolve(__dirname, 'img/font-awesome/white/svg/'),
            cesium$: 'cesium/Cesium',
            cesium: 'cesium/Source'
          },
    }
    ,
    plugins: isProd ? basePlugins.concat(prodPlugins) : basePlugins.concat(devPlugins),
  })
}
