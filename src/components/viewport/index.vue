<template>
  <div
    id="viewport"
    class="holder">
    <div
      :style="{
        backgroundColor: backgroundColor,
        height: height + 'px',
        transform: 'scale(' + zoom / 100 + ')'
      }"
      class="screen"
      @dblclick="replaceImage">

      <!-- Составные части -->
      <component
        v-for="val in widgetStore"
        :is="val.type"
        :data-title="val.type"
        :class="{'g-active': id === val.uuid}"
        :key="val.uuid"
        :val="val"
        :h="height"
        :w="750"
        :data-type="val.type"
        :data-uuid="val.uuid"
        :play-state="playState"
        class="layer">
        <component
          v-for="child in getChilds(val.name)"
          :is="child.type"
          :data-title="child.type"
          :class="{'g-active': id === child.uuid}"
          :key="child.uuid"
          :val="child"
          :h="height"
          :w="750"
          :data-type="child.type"
          :data-uuid="child.uuid"
          :play-state="playState"
          class="layer layer-child" />
      </component>

      <!-- опорная линия -->
      <ref/>

      <!-- регулятор размера -->
      <control/>
    </div>
  </div>
</template>

<script>
import ref from './ref-lines.vue'
import control from './size-control.vue'
import { move } from '../../mixins'
import vpd from '../../mixins/vpd'

export default {
  name: 'Viewport',
  components: {
    ref: ref, // опорная линия
    control: control // контроль размера
  },

  mixins: [move, vpd],

  props: ['zoom'],

  data () {
    return {}
  },

  computed: {
    // добавленные компоненты
    widgetStore () {
      return this.$vpd.state.widgets.filter(item => item.belong === 'page')
    },

    // высота холста
    height () {
      return this.$vpd.state.page.height
    },

    // цвет фона страницы
    backgroundColor () {
      return this.$vpd.state.page.backgroundColor
    },

    // Выбранный элемент id
    id () {
      // var type = this.$vpd.state.type
      // var index = this.$vpd.state.index
      // index = index >= 0 ? index : ''
      // return type + index
      return this.$vpd.state.uuid
    },

    // Статус воспроизведения анимации
    playState () {
      return this.$vpd.state.playState
    }
  },

  mounted () {
    // Используйте прокси-сервер событий для мониторинга операции выбора компонентов
    document
      .getElementById('viewport')
      .addEventListener('mousedown', this.handleSelection, false)

    // Привязать клавиатуру вверх, вниз, влево и вправо для перемещения компонентов
    document.addEventListener(
      'keydown',
      e => {
        e.stopPropagation()
        var target = this.$vpd.state.activeElement

        // Arrow Left
        if (e.keyCode === 37 && target.left) {
          target.left -= 1
          return
        }
        // Arrow Up
        if (e.keyCode === 38 && target.top) {
          e.preventDefault()
          target.top -= 1
          return
        }
        // Arrow Right
        if (e.keyCode === 39 && target.left) {
          target.left += 1
          return
        }

        // Arrow Down
        if (e.keyCode === 40 && target.top) {
          e.preventDefault()
          target.top += 1
        }
      },
      true
    )
  },

  methods: {
    handleSelection (e) {
      var target = e.target
      var type = target.getAttribute('data-type')

      if (type) {
        var uuid = target.getAttribute('data-uuid')

        // установить выбранный элемент
        this.$vpd.commit('select', {
          uuid: uuid || -1
        })

        // Привязка событий перемещения: только те, которые принадлежат странице, могут перемещаться, за исключением фонового изображения.
        target = this.$vpd.state.activeElement
        if (target.belong === 'page' && target.dragable) {
          this.initmovement(e) // см миксины mixins
        }
      } else {
        // снять флажок с элемента
        this.$vpd.commit('select', {
          uuid: -1
        })
      }
    },

    // заменить элемент изображения
    replaceImage (e) {
      if (this.$vpd.state.activeElement.isUpload) {
        this.$vpd.$emit('upload', payload => {
          this.$vpd.commit('replaceImage', payload)
        })
      }
    },

    // получить дочерний компонент
    getChilds (name) {
      return this.$vpd.state.widgets.filter(
        item => item.belong === name
      )
    }
  }
}
</script>

<style scoped>
.holder {
  display: flex;
  justify-content: center;
  height: 100%;
  overflow: auto;
  font-size: 0;
  border: 1px solid #f5f5f5;
  border-width: 0 1px;
  background-image: linear-gradient(
      45deg,
      #f5f5f5 25%,
      transparent 0,
      transparent 75%,
      #f5f5f5 0
    ),
    linear-gradient(
      45deg,
      #f5f5f5 25%,
      transparent 0,
      transparent 75%,
      #f5f5f5 0
    );
  background-position: 0 0, 13px 13px;
  background-size: 26px 26px;
}
.screen {
  width: 750px;
  margin: 25px auto;
  transform-origin: center top;
  position: relative;
}
</style>
