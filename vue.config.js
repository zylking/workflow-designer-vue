/* eslint-disable */
'use strict';
const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

// page title
const name = '工作流设计器';

// 如果你将端口设置为80
// 需要管理员权限执行命令行
// 例如mac：sudo npm run
// 开发端口
const port = 9599;

// 所有配置项均可在https://cli.vuejs.org/config/配置参考中找到
module.exports = {
  // 部署应用包时的基本 URL
  publicPath: '/',
  // 运行 vue-cli-service build 时生成的生产环境构建文件的目录
  outputDir: '../../nginx-1.12.2/html/workflow-designer',
  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
  assetsDir: 'static',
  // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码
  // 设置为 true 时，eslint-loader 会将 lint 错误输出为编译警告。默认情况下，警告仅仅会被输出到命令行，且不会使得编译失败
  lintOnSave: false,  //process.env.NODE_ENV === 'development',

  productionSourceMap: false,
  devServer: {
    port: port,
    // 告诉开发服务器在服务器启动后打开浏览器。将其设置为true以打开默认浏览器
    open: false,
    // 当出现编译器错误或警告时，在浏览器中显示全屏覆盖：此处则错误显示全屏，警告不显示
    overlay: {warnings: false, errors: true},
    // 如果你的前端应用和后端 API 服务器没有运行在同一个主机上，你需要在开发环境下将 API 请求代理到 API 服务器
    // 代理 process.env.VUE_APP_BASE_API可在.env.development和.env.production中配置
    // http://10.8.0.22:8050
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: 'http://192.168.124.47:10013',
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    }
  },

  css: {
    loaderOptions: {
      scss: {
        // @/ 是 src/ 的别名
        // 注意：在 sass-loader v7 中，这个选项名是 "data"
        data: `@import "~@/styles/variables.scss";`
      }
    }
  },

  // 如果这个值是一个对象，则会通过 webpack-merge 合并到最终的配置中
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },

    // 打包时，不去打包由index.html中引入的第三方依赖
    externals: {
      vue: 'Vue',
      'vue-router': 'VueRouter',
      vuex: 'Vuex',
      'element-ui': 'ELEMENT'
    },
  },

  // 是一个函数，会接收一个基于 webpack-chain 的 ChainableConfig 实例。允许对内部的 webpack 配置进行更细粒度的修改
  chainWebpack(config) {
    config.entry('main').add('babel-polyfill');
    config.plugins.delete('preload');   // TODO: need test
    config.plugins.delete('prefetch');  // TODO: need test

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end();

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();

    // https://webpack.js.org/configuration/devtool/#development
    config
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      );

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end();
          config
            .optimization.splitChunks({
            chunks: 'all',
            cacheGroups: {
              libs: {
                name: 'chunk-libs',
                test: /[\\/]node_modules[\\/]/,
                priority: 10,
                chunks: 'initial' // 仅打包最初依赖的第三方
              },
              // 由于本项目已将element-ui相关由外部引入，故无需打包
              // elementUI: {
              //   name: 'chunk-elementUI', // 将elementui拆分为一个包
              //   priority: 20, // 权重必须大于libs和app，否则将打包成libs或app
              //   test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
              // },
              commons: {
                name: 'chunk-commons',
                test: resolve('src/components'), // can customize your rules
                minChunks: 3, //  minimum common number
                priority: 5,
                reuseExistingChunk: true
              }
            }
          });
          config.optimization.runtimeChunk('single')
        }
      )
  }
};
