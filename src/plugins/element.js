import Vue from 'vue'
import {
  Button, Form, FormItem, Input, Message
} from 'element-ui'/* 按需导入组件 */

/* 把组件注册为全局可用的组件 */
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message
