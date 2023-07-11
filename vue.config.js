module.exports = {
  // 修改 src 目录 为 examples 目录
  publicPath: './',
  pages: {
    index: {
      entry: 'examples/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  // 扩展 webpack 配置，使 packages 加入编译
  chainWebpack: config => {
    config.module
        .rule('js')
        .include
        .add('/packages')
        .end()
        .use('babel')
        .loader('babel-loader')
        .tap(options => {
          // 修改它的选项...
          return options
        })
  },
  // 关闭打包生成的map文件
  productionSourceMap: false,
  // 强制CSS内联
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
