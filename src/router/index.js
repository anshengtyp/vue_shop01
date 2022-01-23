import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/login.vue'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/login.vue')// 路由懒加载将Login，Home，Welcome这三个组件，放在同一个组中
// import Home from '../components/Home.vue'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
// import Welcome from '../components/welcome.vue'
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/welcome.vue')

// import Users from '../components/user/users.vue'
const Users = () => import(/* webpackChunkName: "user_rights_roles" */ '../components/user/users.vue')
// import Rights from '../components/power/rights.vue'
const Rights = () => import(/* webpackChunkName: "user_rights_roles" */ '../components/power/rights.vue')
// import Roles from '../components/power/roles.vue'
const Roles = () => import(/* webpackChunkName: "user_rights_roles" */ '../components/power/roles.vue')

// import GoodsClass from '../components/goods/goodsClass.vue'
const GoodsClass = () => import(/* webpackChunkName: "GoodsClass_ClassParameter" */ '../components/goods/goodsClass.vue')
// import ClassParameter from '../components/goods/ClassParameter.vue'
const ClassParameter = () => import(/* webpackChunkName: "GoodsClass_ClassParameter" */ '../components/goods/ClassParameter.vue')

// import GoodsList from '../components/goods/GoodsList.vue'
const GoodsList = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/goods/GoodsList.vue')
// import Add from '../components/goods/add.vue'
const Add = () => import(/* webpackChunkName: "GoodsList_Add" */ '../components/goods/add.vue')

// import Order from '../components/order/order.vue'
const Order = () => import(/* webpackChunkName: "Order_Report" */ '../components/order/order.vue')
// import Report from '../components/report/report.vue'
const Report = () => import(/* webpackChunkName: "Order_Report" */ '../components/report/report.vue')

Vue.use(VueRouter)

const routes = [
  // 重定向到登录界面
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    // 做home的子路由，可以实现在右侧实现数据显示
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: GoodsClass },
      { path: '/params', component: ClassParameter },
      { path: '/goods', component: GoodsList },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航首位
router.beforeEach((to, from, next) => {
  // to代表将要访问的路径
  // from代表从哪个路径来
  // next是一个函数，表示放行，next()放行，next('/login')强制跳转
  if (to.path === '/login') return next()
  // 获取token值
  const tokenStr = window.sessionStorage.getItem('token')
  // 判断是否携带token值，有直接放行，没有就强制跳转到登录页
  if (!tokenStr) return next('/login')
  next()
})

export default router
