var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var loaders = [
  {
    "test": /\.js?$/,
    "exclude": /node_modules/,
    "loader": "babel",
    "query": {
      "presets": [
        "es2015",
        "stage-0"
      ],
      "plugins": []
    }
  },
  {
    "test": /\.css?$/,
    "loader": "style!css?modules&localIdentName=[name]---[local]---[hash:base64:5]"
  },
  {
    "test": /\.scss?$/,
    "loader": "style!css!sass"
  },
  {
    "test": /\.json?$/,
    "loader": "json"
  }
];

module.exports = {
  devtool: 'eval-source-map',
  entry: path.resolve('src', 'main.js'),
  output: {
    path: path.resolve('build'),
    filename: '[name].js',
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('src', 'index.tpl.html'),
      inject: 'body',
      filename: 'index.html'
    })
  ],
  module: {
    loaders: loaders
  }
};
