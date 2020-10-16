import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';

import './assets/css/base.css';

import router from './routers/index.js';

import http from './config/axios.js';
Vue.prototype.$axios = http;

Vue.use(ElementUI);

Vue.config.productionTip = false



new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
