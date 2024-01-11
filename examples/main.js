import Vue from 'vue'
import App from './App.vue'

// Import component library
import VuePdfEditor from './../src/index'
// Registered component library
Vue.use(VuePdfEditor)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
