<template>
  <div>
    <ul class="tab tab-block panel-tab">
      <li
        :class="{active: activeTab === 1}"
        class="tab-item"
        @click="activeTab = 1"><a>{{ $t('data.names.params') }}</a></li>
      <li
        :class="{active: activeTab === 2}"
        class="tab-item"
        @click="activeTab = 2"><a>{{ $t('data.names.event') }}</a></li>
      <li
        :class="{active: activeTab === 3}"
        class="tab-item"
        @click="activeTab = 3"><a>{{ $t('data.names.animation') }}</a></li>
    </ul>

    <page
      :active-element="activeElement"
      :tab="activeTab"/>
    <appearance
      :active-element="activeElement"
      :tab="activeTab"/>
    <event
      :active-element="activeElement"
      :tab="activeTab"/>
    <animation
      :active-element="activeElement"
      :tab="activeTab"/>
  </div>
</template>

<script>
import page from './page.vue'
import style from './style.vue'
import event from './event.vue'
import animation from './animation.vue'
import vpd from '../../mixins/vpd'

export default {
  components: {
    page: page,
    appearance: style,
    event: event,
    animation: animation
  },
  mixins: [vpd],

  data () {
    return {
      activeTab: 1
    }
  },

  computed: {
    // выбранный элемент объекта
    activeElement () {
      return this.$vpd.state.activeElement
    }
  }
}
</script>

<style lang="scss">
@import '../../_variables.scss';
.panel-tab {
  padding: 0;
}
.panel-wrap {
  height: calc(100% - 50px);
  padding: 15px 20px;
  position: relative;
  overflow-y: auto;
  .btn-action {
    background-color: none;
    border: none;
    border-radius: 50%;
  }
  .btn-action:hover {
    background-color: #f5f5f5;
  }
}
.panel-row {
  display: flex;
  font-size: 13px;
  line-height: 36px;
}
.panel-row .svg-icon {
  font-size: 16px;
  color: $gray-color;
}
.panel-label {
  display: inline-block;
  width: 160px;
  height: 36px;
  padding-left: 6px;
  color: #999;
}
.panel-value {
  min-width: 80px;
  display: flex;
  align-items: center;
}
.panel-slider-wrap {
  flex-grow: 1;
  padding: 6px 5px;
  opacity: 0;
  transition: opacity 0.3s;
}
.panel-row:hover .panel-slider-wrap {
  opacity: 1;
}
.panel-cell {
  flex-grow: 1;
}
.panel-wrap input:checked ~ .svg-icon svg {
  stroke: #333;
}
.panel-select {
  width: 100%;
  height: 32px;
  border: 1px solid #ccc;
}
.panel-wrap hr {
  margin: 20px 0;
  border: none;
  border-top: 1px solid #f5f5f5;
}
.panel-wrap select,
.panel-wrap input[type="text"] {
  width: 100%;
}
.panel-preview {
  width: 50px;
  height: 32px;
  background: no-repeat center/100%;
  cursor: pointer;
}
</style>
