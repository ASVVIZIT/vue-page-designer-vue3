<template>
  <div
    v-show="moving"
    class="guides">
    <!-- Горизонтальная полоса -->
    <div
      v-for="val in horiz"
      v-show="attachHoriz(val.val)"
      :key="val.id"
      :style="{top: val.val + 'px'}"
      class="horiz"/>
    <!-- Вертикальная полоса -->
    <div
      v-for="val in verti"
      v-show="attachVerti(val.val)"
      :key="val.id"
      :style="{left: val.val + 'px'}"
      class="verti"/>
  </div>
</template>

<script>
import vpd from '../../mixins/vpd'

export default {
  name: 'RefLines',
  mixins: [vpd],
  computed: {
    moving () {
      return this.$vpd.state.moving
    },
    guides () {
      var state = this.$vpd.state
      var guides = []
      var uuid = state.uuid

      state.widgets.forEach(item => {
        // Исключить выбранные элементы
        if (item.hasGuide && item.uuid === uuid) return
        // Исключить компоненты из контейнеров
        if (item.hasGuide && item.belong !== 'page') return

        guides.push({
          uuid: item.uuid,
          width: item.width,
          height: item.height,
          top: item.top,
          left: item.left
        })
      })

      return guides
    },
    /**
     * Получить опорные линии
     *
     * Возьмите центральную линию холста и координаты верхнего и нижнего краев каждого компонента.
     * Исключить движущиеся компоненты
     * Исключить координаты края холста
     * Исключить повторяющиеся координаты
     */
    horiz () {
      var guides = this.guides
      var cor = []

      guides.forEach(val => {
        var top = val.top
        var bottom = top + val.height

        if (cor.indexOf(top) < 0 && top !== 0) {
          cor.push({
            id: `horiz-${val.uuid}-${top}`,
            val: top
          })
        }
        if (cor.indexOf(bottom) < 0) {
          cor.push({
            id: `horiz-${val.uuid}-${bottom}`,
            val: bottom
          })
        }
      })

      return cor
    },

    verti () {
      var guides = this.guides
      var cor = [375]

      guides.forEach(val => {
        var left = val.left
        var right = left + val.width

        if (cor.indexOf(left) < 0 && left !== 0) {
          cor.push({
            id: `verti-${val.uuid}-${left}`,
            val: left
          })
        }
        if (cor.indexOf(right) < 0 && right < 750) {
          cor.push({
            id: `verti-${val.uuid}-${right}`,
            val: right
          })
        }
      })

      return cor
    },

    // Переместить верхнюю и нижнюю координаты элемента
    horizontal () {
      var a = this.$vpd.state.activeElement
      if (a) {
        var h = Math.round(a.height)
        return [a.top, a.top + h]
      } else {
        return []
      }
    },

    // Переместить левую, среднюю и правую координаты элемента
    vertical () {
      var a = this.$vpd.state.activeElement
      if (a) {
        var w = Math.round(a.width / 2)
        return [a.left, a.left + w, a.left + w * 2]
      } else {
        return []
      }
    }
  },
  methods: {
    attachHoriz (value) {
      return this.horizontal.some(val => Math.abs(val - value) <= 1)
    },
    attachVerti (value) {
      return this.vertical.some(val => Math.abs(val - value) <= 1)
    }
  }
}
</script>

<style scoped>
.guides {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
}
.verti {
  position: absolute;
  width: 1px;
  height: 1200%;
  top: -50px;
  background: #18ffff;
}
.horiz {
  position: absolute;
  height: 0.5px;
  width: 1200%;
  left: -500%;
  background: #18ffff;
}
</style>
