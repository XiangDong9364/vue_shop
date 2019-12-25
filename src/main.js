import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'

// 导入axios包
import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
// 配置axios请求拦截器
axios.interceptors.request.use(config => {
  /*
    判断当前请求是否有网络
    console.log('当前网络状态：' + window.navigator.onLine)
    if (!window.navigator.onLine) {
      this.$message.error('网络连接有误，请求失败~！')
      return
    }
  */
  // 为请求头对象添加 Token 验证的 Authorization 字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 注册axios至vue
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
