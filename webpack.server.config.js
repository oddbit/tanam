const path = require('path');
const webpack = require('webpack');

const APP_NAME = 'tanam';

module.exports = {
  entry: { server: './server.ts' },
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
    mainFields: ["main", "module"],
    mainFiles: ['index.node', 'index']
  },
  mode: 'development',
  target: 'node',
  externals: [
    /* There are a bunch of issues if we webpack firebase:
        A) the CJS versions of things like firebase/firestore aren't registering on the app
        B) grpc has native components, it is very unhappy when webpacked
        C) @firebaes/firestore can't find it's protos, presumably since they aren't in extensions */
    /^firebase/
  ],
  output: {
    path: path.join(__dirname, `dist/${APP_NAME}-webpack`),
    library: 'app',
    libraryTarget: 'umd',
    filename: '[name].js'
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  },
  plugins: [
    new webpack.ContextReplacementPlugin(
      /(.+)?angular(\\|\/)core(.+)?/,
      path.join(__dirname, 'src'), // location of your src
      {} // a map of your routes
    ),
    new webpack.ContextReplacementPlugin(
      /(.+)?express(\\|\/)(.+)?/,
      path.join(__dirname, 'src'),
      {}
    )
  ]
}
