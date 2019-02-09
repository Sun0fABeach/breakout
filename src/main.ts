import './animate.scss'

import Vue from 'vue'
import App from './App.vue'
import store from './store'

// @ts-ignore there is no declaration file
import VuePaginate from 'vue-paginate'

Vue.use(VuePaginate)

// eslint-disable-next-line
new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
