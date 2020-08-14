import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vconsole from 'vconsole';
import RecordApp from './recorder';
// import './wechat';
const vconsole = new Vconsole();
Vue.config.productionTip = false
Vue.use(RecordApp);
Vue.use(vconsole);
Vue.prototype.$RecordApp = RecordApp;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
