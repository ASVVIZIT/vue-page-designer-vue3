import VuePageDesignerVue3 from './App.vue'

import slider from './components/slider.vue'
import icon from './components/icon.vue'

import './app.scss'

const install = function (Vue, opts = {}) {
  Vue.component('VpdSlider', slider)
  Vue.component('VpdIcon', icon)

  Vue.component('VuePageDesignerVue3', VuePageDesignerVue3)
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  VuePageDesignerVue3
}
