const path = require('path');
// webpack.config.js
module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.frag$/i,
        use: 'raw-loader',
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
