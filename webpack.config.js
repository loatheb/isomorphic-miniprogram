const path = require('path')

module.exports = {
  entry: './client/index.ts',
  output: {
    filename: 'build.js',
    path: path.resolve(__dirname, 'public/script')
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      { test: /\.ts$/, exclude: /node_modules/, loaders: ['babel-loader', 'awesome-typescript-loader'] },
    ]
  }
}
