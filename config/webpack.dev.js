const path = require('path');
const { merge } = require('webpack-merge');
const base = require('./webpack.base.js');

const publicPath = path.resolve(__dirname, '../public');

module.exports = (env, argv) =>
  merge(base(env, argv), {
    devtool: 'source-map',
    output: {
      chunkFilename: '[name].chunk.js',
    },
    devServer: {
      static: publicPath,
      port: 4000,
      historyApiFallback: true,
    },
  });
