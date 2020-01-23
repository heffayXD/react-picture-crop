const nodeExternals = require('webpack-node-externals')
const path = require('path')
const { name } = require('./package.json')

module.exports = {
  context: __dirname,
  entry: './src/PictureCrop/index.js',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    alias: {
      react: path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
      assets: path.resolve(__dirname, 'assets')
    }
  },
  output: {
    path: __dirname,
    filename: 'index.js',
    library: name,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals: [nodeExternals()]
}
