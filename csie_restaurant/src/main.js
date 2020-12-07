import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import axios from 'axios'
import { cacheAdapterEnhancer, throttleAdapterEnhancer } from 'axios-extensions';

Vue.prototype.$url = 'https://98ac56da56a5.ap.ngrok.io/'
Vue.prototype.$axios = axios // no cache response
Vue.prototype.$http = axios.create({
	baseURL: 'https://98ac56da56a5.ap.ngrok.io/',
	headers: { 'Cache-Control': 'no-cache' },
	adapter: throttleAdapterEnhancer(cacheAdapterEnhancer(axios.defaults.adapter))
});

// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    render: h => h(App)
})