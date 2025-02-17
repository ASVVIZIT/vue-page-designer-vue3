// Дефолт widgets
import defaultWidgets from 'vue-page-designer-widgets-vue3'
import vpd from '../mixins/vpd'

var widgets
var widgetStyle = {}

const install = (Vue, config = {}) => {
  if (install.installed) return

  widgets = Object.assign({}, defaultWidgets, config.widgets)

  Object.keys(widgets).forEach(key => {
    Vue.component(key, widgets[key])
    Vue.component(key, Vue.extend(widgets[key]).extend(vpd))
    // панель стилей style panel
    if (widgets[key]['panel']) {
      let panel = Object.assign({}, widgets[key]['panel'], {
        type: key
      })
      Vue.component(panel.name, Vue.extend(panel).extend(vpd))
      widgetStyle[panel.name] = panel
      // удалить панель с объекта remove panel from object
      delete widgets[key]['panel']
    }
  })
}

export default {
  install,
  getWidgets () {
    return widgets
  },
  getWidgetStyle () {
    return widgetStyle
  }
}
