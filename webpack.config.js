const path = require('path');

module.exports = {
  mode: 'production',
  target: 'node',
  resolve: {
    extensions: [
      '.ts',
    ],
  },
  output: {
    filename: 'index.js',
    library: {
      root: 'SecretRetriever',
      amd: 'secret-retriever',
      commonjs: 'secret-retriever',
    },
    libraryExport: 'default',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },
};
