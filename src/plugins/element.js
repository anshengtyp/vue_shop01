import Vue from 'vue'
// 按需导入所需要的组件
import {
  Button, Form, FormItem, Input, Message, Container, Header, Aside, Main, Menu, Submenu, MenuItem,
  Breadcrumb, BreadcrumbItem, Card, Row, Col, Table, TableColumn, Switch, Tooltip, Pagination,
  Dialog, MessageBox
} from 'element-ui'

// 进行全局注册
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)

// 将消息组件绑定在vue原型对象上，直接可以this.$message来使用Message
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
