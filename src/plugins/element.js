import Vue from 'vue'
// 按需导入所需要的组件，导入弹框提示
import { Button, Form, FormItem, Input, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 将消息组件绑定在vue原型对象上，直接可以this.$message来使用Message
Vue.prototype.$message = Message
