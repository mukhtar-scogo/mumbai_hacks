const webpack = require('webpack');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');
const path = require('path')

module.exports = (async () => {
  const accountId = await slsw.lib.serverless.providers.aws.getAccountId();
  return {
    entry: slsw.lib.entries,
    target: 'node',
    devtool: 'source-map',
    externals: [nodeExternals({
      modulesDir: path.join(__dirname, './node_modules')
    })],
    mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
    performance: {
      hints: false, // Turn off size warnings for entry points
    },
    stats: 'minimal', // https://github.com/serverless-heaven/serverless-webpack#stats
    plugins: [
      new webpack.DefinePlugin({
        AWS_ACCOUNT_ID: `${accountId}`,
      }),
      new webpack.DefinePlugin({
        'process.browser': 'true'
      }),
    ],
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'eslint-loader',
          options: {
            emitError: true
          }
        },
        {
          test: /\.js$/,
          include: __dirname,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
      ],
    },
  };
})();