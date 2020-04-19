import Vue from 'vue'
import App from './App.vue'
import './assets/font/iconfont.css'

import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
Vue.use(VueAwesomeSwiper)

Vue.config.productionTip = false
Vue.prototype.Bus = new Vue()
new Vue({
  render: h => h(App)
}).$mount('#app')
