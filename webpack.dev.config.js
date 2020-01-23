const HtmlWebPackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
  context: __dirname,
  entry: './src/index.js',
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
    extensions: ['*', '.js', '.jsx']
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: path.join(__dirname, 'public/index.html'),
      filename: 'index.html'
    })
  ],
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
  }
}
