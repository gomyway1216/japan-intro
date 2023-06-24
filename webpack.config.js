const path = require('path');
const webpack = require("webpack");
const dotenv = require("dotenv");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const env = dotenv.config().parsed;

const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

module.exports = {
  entry: {
    bundle: './src/index.tsx'
  },
  // entry: './src/index.ts',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  devServer: {
    // contentBase: path.join(__dirname, 'dist'),
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    open: true,
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        loader: 'ts-loader',
        test: /\.(ts|tsx)$/,
      },
      {
        test: /\.scss$/i,
        exclude: /\.module\.scss$/i,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: {
                mode: "icss",
              },
            },
          },
          {
            loader: "sass-loader",
          },
        ],
      },
      // --------
      // SCSS MODULES
      {
        test: /\.module\.scss$/i,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: {
                mode: "local",
              },
            },
          },
          {
            loader: "sass-loader",
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [
    // ...
    new webpack.DefinePlugin(envKeys),
    new BundleAnalyzerPlugin()
  ],
}