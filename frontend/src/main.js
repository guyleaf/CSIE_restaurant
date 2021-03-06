import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import VueCookie from "vue-cookie";
import VueSimpleAlert from "vue-simple-alert";
import axios from "axios";
import {
  cacheAdapterEnhancer,
  throttleAdapterEnhancer,
} from "axios-extensions";

Vue.prototype.$url = "https://api.guyleaf.site:8881";
Vue.prototype.$axios = axios; // no cache response
Vue.prototype.$http = axios.create({
  baseURL: "https://api.guyleaf.site:8881",
  headers: { "Cache-Control": "no-cache" },
  adapter: throttleAdapterEnhancer(
    cacheAdapterEnhancer(axios.defaults.adapter)
  ),
});

// Install BootstrapVue
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
Vue.use(VueCookie)
Vue.use(VueSimpleAlert);
Vue.config.productionTip = false

new Vue({
  el: "#app",
  router,
  store,
  render: (h) => h(App),
});
