const publicPath = process.env.PUBLIC_PATH ? process.env.PUBLIC_PATH : "./";
module.exports = {
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
          test:/\.js$/,
          loader: 'babel-loader'
        }
      ]
    }
  }

}
