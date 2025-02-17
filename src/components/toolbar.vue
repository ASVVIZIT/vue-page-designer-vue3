<template>
  <div class="menu-bar">
    <details open>
      <summary><vpd-icon name="list" />{{ $t('data.components') }}</summary>
      <ul
        class="widget-list columns"
        @mousedown="updateSrollTop">
        <li
          v-for="item in widgets"
          :key="item.name"
          class="menu-item column col-6"
          @click="(e) => {addWidget(e, item)}">
          <vpd-icon
            :svg="item.icon"
            :title="item.title" />
          <span class="menu-caption">{{ item.title }}</span>
        </li>
      </ul>
    </details>
    <details>
      <summary><vpd-icon name="layers" />{{ $t('data.added_components') }}</summary>
      <ul class="layer-list">
        <li
          v-for="layer in layers"
          :class="{'layer-active': layer === activeElement}"
          :key="layer.uuid"
          @click="(e) => {activeLayer(e, layer)}">{{ getWidgetTitle(layer.type) }}</li>
      </ul>
    </details>
  </div>
</template>

<script>
import widget from '../plugins/widget'
import { move } from '../mixins'
import { cumulativeOffset, checkInView } from '../utils/offset'
import vpd from '../mixins/vpd'

export default {
  mixins: [move, vpd],
  props: ['zoom'],
  data () {
    return {}
  },
  computed: {
    widgets () {
      return widget.getWidgets()
    },
    layers () {
      return this.$vpd.state.widgets
    },
    activeElement () {
      return this.$vpd.state.activeElement
    }
  },
  methods: {
    // Добавить компоненты
    addWidget (e, item) {
      this.$vpd.dispatch('addWidget', item)
    },

    // Чтобы добавленные компоненты отображались в видимой области
    // Используйте расстояние прокрутки холста в качестве начального верхнего значения элемента.
    updateSrollTop () {
      var top = document.getElementById('viewport').scrollTop / this.zoom * 100
      this.$vpd.commit('updateSrollTop', top)
    },

    activeLayer (e, item) {
      this.$vpd.commit('select', {
        uuid: item.uuid
      })
      let viewport = document.querySelector('#viewport')
      let target = viewport.querySelector(`[data-uuid='${item.uuid}']`)
      if (target && !checkInView(target)) {
        viewport.scrollTop = (cumulativeOffset(target).top - 50) * this.zoom / 100
      }
    },

    getWidgetTitle (type) {
      return this.widgets[type].title || ''
    }
  }
}
</script>

<style lang="scss">
@import '../_variables.scss';
.menu-bar {
  ul {
    list-style: none;
    margin: 0;
  }
  details {
    padding: 16px;
  }
  summary {
    padding: 5px 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    border-bottom: 1px solid #f5f5f5;
    .svg-icon {
      margin-right: 5px;
    }
  }
}
.widget-list {
  padding: 0;
}
.menu-item {
  text-align: center;
  cursor: pointer;
  padding: 15px 0 8px;
  transition: all 0.2s;
  position: relative;
  &:hover {
    transform: scale(1.2);
  }
  .svg-icon {
    font-size: 24px;
  }
  .menu-caption {
    display: block;
    font-size: 12px;
    width: 100%;
  }
}
.layer-list {
  padding: 10px;
  li {
    text-align: left;
    cursor: pointer;
    white-space: nowrap;
    line-height: 24px;
    padding-left: 5px;
    &:hover {
      background: #f5f5f5;
    }
    &::before {
      content: '› ';
    }
    &.layer-active {
      color: $light-color;
      background: $primary-color;
    }
  }
}
</style>
