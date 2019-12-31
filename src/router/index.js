import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Orders from '../components/order/Orders.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/login', component: Login }, // 配置路由规则，如果用户访问 /login则跳转 Login 组件
  { path: '/', redirect: '/login' }, // 配置路由规则，如果用户访问 / 则跳转 Login 组件
  {
    path: '/home',
    component: Home,
    redirect: '/content',
    children: [
      { path: '/content', component: Welcome },
      { path: '/users', component: Users },
      { path: '/orders', component: Orders },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next() 放行  next('/login') 强制跳转页面路径
  if (to.path === '/login') return next() // 访问登录页面 放行
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (tokenStr == null || tokenStr === '') return next('/login') // 没有token说明未登录，强制跳转登录页面
  next() // 有token 放行
})

// 暴露路由对象
export default router
