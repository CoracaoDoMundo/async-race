const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: path.join(__dirname, 'src', 'index.ts'),
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  output: {
    filename: 'index.[contenthash:8].js',
    path: path.join(__dirname, 'dist'),
  },
  module: {
    rules: [
      { test: /\.ts$/i, use: 'ts-loader' },
      {
        test: /\.(scss|css)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: path.join('assets', 'img', '[name].[contenthash:8][ext]'),
        },
      },
      {
        test: /\.(ico)$/,
        type: 'asset/resource',
        generator: {
          filename: path.join('assets', 'icons', '[name].[contenthash:8][ext]'),
        },
      },
      {
        test: /\.(mp3|wav)$/,
        type: 'asset',
        generator: {
          filename: path.join(
            'assets',
            'sounds',
            '[name].[contenthash:8][ext]'
          ),
        },
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: path.join('assets', 'fonts', '[name].[contenthash:8][ext]'),
        },
      },
    ],
  },
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html'),
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
    }),
  ],
  devServer: {
    watchFiles: path.join(__dirname, 'src'),
    port: 9000,
  },
  devtool: 'inline-source-map',
};
