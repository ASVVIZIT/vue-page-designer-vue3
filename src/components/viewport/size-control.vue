<template>
  <div v-show="elm">
    <!-- влево -->
    <div
      :style="{
        height: elm.height + 'px',
        top: elm.top + 'px',
        left: elm.left + 'px'
      }"
      class="verti"
      @mousedown="handlemousedown($event, 'left', 'left', 'width')">
      <div class="square"/>
    </div>

    <!-- Вправо -->
    <div
      :style="{
        height: elm.height + 'px',
        top: elm.top + 'px',
        left: elm.left + elm.width + 'px'
      }"
      class="verti"
      @mousedown="handlemousedown($event, 'right', 'width')">
      <div class="square"/>
    </div>

    <!-- Вверх -->
    <div
      :style="{
        width: elm.width + 'px',
        top: elm.top + 'px',
        left: elm.left + 'px'
      }"
      class="horiz"
      @mousedown="handlemousedown($event, 'up', 'top', 'height')">
      <div class="square"/>
    </div>

    <!-- вниз -->
    <div
      :style="{
        width: elm.width + 'px',
        top: elm.top + elm.height + 'px',
        left: elm.left + 'px'
      }"
      class="horiz"
      @mousedown="handlemousedown($event, 'down', 'height')">
      <div class="square"/>
    </div>
  </div>
</template>

<script>
import vpd from '../../mixins/vpd'
export default {
  mixins: [vpd],
  data () {
    return {
      type: '' // Отрегулировать направление (влево | вправо | вверх | вниз ||| left | right | up | down)
    }
  },
  computed: {
    elm () {
      var target = this.$vpd.state.activeElement

      if (!target.resizable || target.belong !== 'page') return ''

      return target
    }
  },

  methods: {
    handlemousedown (e, type, originX, originY) {
      e.stopPropagation()
      this.type = type
      this.$vpd.commit('initmove', {
        startX: e.pageX,
        startY: e.pageY,
        originX: this.elm[originX],
        originY: this.elm[originY]
      })

      document.addEventListener('mousemove', this.handlemousemove, true)
      document.addEventListener('mouseup', this.handlemouseup, true)
    },

    handlemousemove (e) {
      e.stopPropagation()
      e.preventDefault()

      this.$vpd.commit('resize', {
        x: e.pageX,
        y: e.pageY,
        type: this.type
      })
    },

    handlemouseup () {
      document.removeEventListener('mousemove', this.handlemousemove, true)
      document.removeEventListener('mouseup', this.handlemouseup, true)
      this.$vpd.commit('stopmove')
    }
  }
}
</script>

<style scoped>
.verti,
.horiz {
  position: absolute;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.verti {
  width: 0;
  cursor: ew-resize;
}
.horiz {
  height: 0;
  cursor: ns-resize;
}
.square {
  width: 10px;
  height: 10px;
  border: 1px solid #2196f3;
  background-color: #fff;
  flex-shrink: 0;
}
</style>
