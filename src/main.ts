import './animate.scss'

import Vue from 'vue'
import App from './App.vue'
import store from './store'

import VuePaginate from 'vue-paginate'
import TWEEN from '@tweenjs/tween.js'

Vue.use(VuePaginate)

function animate (time: number) {
  requestAnimationFrame(animate)
  TWEEN.update(time)
}
requestAnimationFrame(animate)

// eslint-disable-next-line
new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
