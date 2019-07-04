const nodeExternals = require('webpack-node-externals');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    filename: 'index.js',
    libraryTarget: 'this'
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        }
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.js' ],
  },
  externals: [nodeExternals()],
  plugins: [
    new CleanWebpackPlugin()
  ]
}
