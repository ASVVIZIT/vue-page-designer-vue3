<template>
  <div class="app">
    <navbar/>
    <div class="body container">
      <div class="columns col-gapless">
        <toolbar
          :zoom="zoom"
          class="toolbar column"/>
        <div class="viewport column">
          <viewport :zoom="zoom"/>
          <div class="zoom-wrap">
            <vpd-slider
              :value="zoom"
              :step="1"
              :tuning="false"
              @input="dozoom" />
            <div class="zoom-value">{{ zoom }}%</div>
          </div>
        </div>
        <panel class="control-panel column"/>
      </div>
    </div>
    <vpd-uploader
      :upload="upload"
      :upload-option="uploadOption"/>
    <vpd-toast/>
  </div>
</template>

<script>
import Vue from 'vue'
import widget from './plugins/widget'
import navbar from './components/navbar.vue'
import toolbar from './components/toolbar.vue'
import panel from './components/panel/index.vue'
import viewport from './components/viewport/index.vue'
import loadSprite from './utils/load-sprite'
import vpd from './mixins/vpd'
import toast from './components/toast.vue'
import uploader from './components/uploader.vue'
import slider from './components/slider.vue'
import inter from './plugins/i18n'

export default {
  name: 'VuePageDesignerVue3',
  inter,
  components: {
    navbar, // Верхняя панель навигации
    toolbar, // Левая строка меню
    panel, // Правая панель параметров
    viewport, // Холст страницы
    [toast.name]: toast, // Компонент подсказки
    [uploader.name]: uploader, // Загрузить компонент
    [slider.name]: slider
  },
  mixins: [vpd],
  props: {
    value: Object,
    locale: {
      type: String,
      default: 'ru'
    },
    widgets: Object,
    upload: Function,
    uploadOption: Object
  },

  computed: {
    zoom () {
      return this.$vpd.state.zoom
    }
  },
  beforeCreate () {
    // TODO: custom svg path by config
    loadSprite('//unpkg.com/vue-page-designer@0.7.1/dist/icons.svg', 'svgspriteit')
  },
  created () {
    // Переключение языка по умолчанию
    inter.setCurrentLocale(this.locale)
    // Регистр widgets
    Vue.use(widget, {
      widgets: this.widgets
    })
    // Инициализировать существующие данные
    if (this.value) {
      this.$vpd.replaceState(this.value)
    }
    this.$vpd.$on('save', () => {
      this.$emit('save', this.$vpd.state)
    })
  },
  mounted () {
    // Инициализировать выбранный компонент (использовать страницу в качестве начального выбранного компонента)
    this.$vpd.commit('initActive')
  },

  methods: {
    dozoom (val) {
      this.$vpd.commit('zoom', val)
    }
  }
}
</script>

<style lang="scss">
.body {
  width: 100%;
  height: calc(100% - 54px);
  overflow: hidden;
  flex-direction: row;
  &.container {
    padding: 0;
  }
}
.columns {
  height: 100%;
}
.toolbar,
.viewport,
.control-panel {
  height: 100%;
}
.toolbar {
  background: #fff;
  user-select: none;
  box-sizing: content-box;
  &.column {
    flex: none;
    width: 180px;
  }
}
.viewport {
  position: relative;
  overflow: hidden;
}
.control-panel {
  background: #fff;
  user-select: none;
  &.column {
    flex: none;
    width: 400px;
  }
}
.zoom-wrap {
  width: 200px;
  height: 30px;
  position: absolute;
  bottom: 20px;
  right: 20px;
  opacity: 0;
  transition: opacity 0.3s;
}
.viewport:hover .zoom-wrap {
  opacity: 1;
}
.zoom-value {
  position: absolute;
  top: 4px;
  left: -36px;
}
#svgspriteit {
  position: absolute;
  z-index: -1;
  opacity: 0;
}
</style>
