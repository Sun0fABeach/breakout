import './animate.scss'

import Vue from 'vue'
import App from './App.vue'
import store from './store'

// @ts-ignore there is no declaration file
import VuePaginate from 'vue-paginate'
// @ts-ignore there is no declaration file
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
