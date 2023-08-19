const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = (_, argv) => {
  const __DEV__ = argv.mode === 'development';

  return {
    entry: {
      index: './src/index',
    },
    output: {
      publicPath: '/',
      filename: __DEV__ ? '[name].js' : '[name].[contenthash].js',
      chunkFilename: __DEV__ ? '[id].js' : '[id].[contenthash].js',
    },
    devtool: __DEV__ ? 'eval-source-map' : false,
    context: __dirname,
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      alias: {
        mobxact: path.resolve(__dirname, '../dist'),
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            onlyCompileBundledFiles: true,
          },
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: true,
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './src/index.html'),
      }),
    ],
    devServer: {
      hot: true,
      historyApiFallback: true,
    },
  };
};
