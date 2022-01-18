import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
// 导入axios用来发送请求
import axios from 'axios'
// 设置请求的根路径
axios.defaults.baseURL = 'http://120.78.12.66:8889/api/private/v1/'
// 设置请求拦截器，实现在请求头中添加token信息,有权限的进行后续的请求
axios.interceptors.request.use(config => {
  // 为请求头添加token信息
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 挂载到vue的原型对象上
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
