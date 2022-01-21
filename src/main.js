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
// 导入树形表格插件
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 将富文本编辑器注册为全局可用组件
Vue.use(VueQuillEditor)

// 设置请求的根路径
axios.defaults.baseURL = 'http://120.78.12.66:8889/api/private/v1/'

// 设置请求拦截器，实现在请求头中添加token信息,有权限的进行后续的请求
axios.interceptors.request.use(config => {
  // 为请求头添加token信息
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

// 将axios请求对象挂载到vue的原型对象上通过this.$http的方式来使用
Vue.prototype.$http = axios

// 阻止显示生产模式的消息
Vue.config.productionTip = false

// 将树形表格注册为全局组件
Vue.component('tree-table', TreeTable)

// 注册一个全局的过滤器，可以实现时间的转化,val为需要处理的时间
Vue.filter('dateFormat', function(val) {
  // 根据拿到的时间，创建一个事件对象
  const date = new Date(val)
  const y = date.getFullYear()
  // padStart(2, '0')表示显示的总位数，不足俩位数就用0来填充
  const m = (date.getMonth() + 1 + '').padStart(2, '0')
  const d = (date.getDay() + '').padStart(2, '0')
  const h = (date.getHours() + '').padStart(2, '0')
  const f = (date.getMinutes() + '').padStart(2, '0')
  const s = (date.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${h}:${f}:${s}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
