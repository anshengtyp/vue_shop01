
// 向外导出配置
module.exports = {
  configureWebpack: {
    // 关闭提示
    performance: {
      hints: false
    }
  },
  // 配置不同编译模式下的打包入口文件
  chainWebpack: config => {
    // process.env.NODE_ENV拿到当前的编译模式
    // 发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main-prod.js')
      // 在发布模式下，配置并加载外部的CDN资源
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })
      // 用于实现首页定制
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })
    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')
      // 用于实现首页定制
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }
}
