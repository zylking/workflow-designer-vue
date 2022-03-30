// import Vue from 'vue'
import App from './App.vue';
import router from './router';
import store from './store';
import message from '@/utils/message';

// A modern alternative to CSS resets
import 'normalize.css/normalize.css';

// 全局css
import "@/styles/index.scss";
// svg图标
import "@/icons";

Vue.prototype.$g6 = G6;

Vue.config.productionTip = false;
Vue.prototype.$promptMessage = message.promptMessage;
Vue.prototype.$confirmMessage = message.confirmMessageBox;

// 请求队列，当需要取消pending状态的请求时需要用到
Vue.$httpRequestList = [];

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
