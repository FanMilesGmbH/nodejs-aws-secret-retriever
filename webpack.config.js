module.exports = {
  mode: 'production',
  target: 'node',
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
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
