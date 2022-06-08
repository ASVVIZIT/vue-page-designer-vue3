# vue-page-designer-vue3 and vue2

<p align="center">
  <a href="https://ASVVIZIT.github.io/vue-page-designer-vue3/" target="_blank">
    <img src="screen.png" width="700px">
    <br>
    Live Demo
  </a>
</p>

A drag-and-drop mobile website builder base on Vue.

## Install

```bash
yarn add vue-page-designer-vue3
```

You can start it quickly, in main.js:

```js
import Vue from 'vue';
import vuePageDesigner from 'vue-page-designer-vue3'
import 'vue-page-designer-vue3/dist/vue-page-designer-vue3.css'
import App from './App.vue';

Vue.use(vuePageDesigner);

new Vue({
  el: '#app',
  render: h => h(App)
});
```

Next, use it:

```html
<template>
  <div id="app">
    <vue-page-designer-vue3 />
  </div>
</template>

<style>
#app {
  height: 100%;
}
</style>
```

A [example](https://ASVVIZIT.github.io/vue-page-designer-vue3/) ▶️, and [source](./example/). Also a [custom widget source](./example/widgets)

# Options

You can add custom components, save callback.

| Props | Type | Description |
| -------- | -------- | -------- |
| value | `Object` | Editor initial value, you can pass the value of the save callback and resume the draft |
| locale | `String` | Editor default locale. Now support 'ru' and 'cn' and 'en', default 'ru'. |
| widgets | `Object` | Vue Components. Custom components for editor. see [Example](https://github.com/ASVVIZIT/vue-page-designer-widgets-vue3/blob/master/src/index.js) |
| save | `(data) => void` | When you click the Save button, feed back to you to save the data |
| upload | `(files) => Promise` | Editor upload function, allowing you to implement your own upload-file's request |

## Parameter: `value`

The `value` came from `save`.

```html
<template>
  <div id="app">
    <vue-page-designer-vue3 :value="value" />
  </div>
</template>
```

## Parameter: `widgets`

You can install default widget in `vue-page-designer-widgets-vue3`

```bash
yarn add vue-page-designer-widgets-vue3
```

Import and use it

```html
<template>
  <div id="app">
    <vue-page-designer-vue3 :widgets="widgets" />
  </div>
</template>
<script>
import widgets from './widgets'

export default {
  data () {
    return {
      widgets
    }
  }
}
</script>
```

Set locale to RU

```html
<template>
  <div id="app">
    <vue-page-designer-vue3 locale="ru" />
  </div>
</template>
```

## Parameter: `save`

```html
<template>
  <div id="app">
    <vue-page-designer-vue3 @save="(data) => { console.log('send the value data to your server', data) }" />
  </div>
</template>
```

## Parameter: `upload`

```html
<template>
  <div id="app">
    <vue-page-designer-vue3 :upload="upload" />
  </div>
</template>
<script>
export default {
  methods: {
    upload (files) {
      return yourApiUpload(files).then(res => {
        return res.data
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
```
