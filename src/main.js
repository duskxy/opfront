// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import moment from 'moment'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import installPlugin from '@/plugin'
import Bus from '@/libs/bus'
import 'iview/dist/styles/iview.css'
import './index.less'
import '@/assets/icons/iconfont.css'
// 实际打包时应该不引入mock
/* eslint-disable */
if (process.env.NODE_ENV !== 'production') require('@/mock')

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})
/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config

/* 自定义 */
Vue.prototype.$bus = Bus
Vue.prototype.$moment = moment;
Vue.filter('moment', function(value, formatString) {
    formatString = formatString || 'YYYY-MM-DD HH:mm:ss';
    return moment(value).format(formatString)
})

if (!String.prototype.moment) {
    String.prototype.moment = function(formatString) {
        formatString = formatString || 'YYYY-MM-DD HH:mm:ss';
        return moment(this).format(formatString)
    };
}
/**
 * 注册指令
 */
importDirective(Vue)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
