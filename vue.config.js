const publicPath = process.env.PUBLIC_PATH ? process.env.PUBLIC_PATH : "./";
const { defineConfig } = require('@vue/cli-service')
const CopyPlugin = require('copy-webpack-plugin');

module.exports = defineConfig({
  publicPath: publicPath,
  pages: {
    index: {
      entry: 'examples/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  chainWebpack: config => {
    config.module
        .rule('js')
        .include
        .add('/src')
        .end()
        .use('babel')
        .loader('babel-loader')
        .tap(options => {
          return options
        })
  },
  productionSourceMap: false,
  css: {
    extract: false
  },
  transpileDependencies: true,
  configureWebpack:{
    module: {
      rules: [
        {
          test: /pdf\.worker(\.min)?\.mjs$/,
          use: { loader: 'file-loader' },
        },
        {
          test:/\.js$/,
          loader: 'babel-loader'
        }
      ]
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs', to: 'pdf.worker.min.mjs' },
        ],
      }),
    ]
  }

})
