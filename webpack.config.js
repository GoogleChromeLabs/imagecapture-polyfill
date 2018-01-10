const path = require('path');

module.exports = {
  context: path.join(__dirname, 'docs'),
  entry: './index.js',

  devServer: {
    contentBase: './docs',
    inline: true,
  },

  output: {
    path: path.join(__dirname, 'docs'),
    filename: './bundle.js',
  },
};
