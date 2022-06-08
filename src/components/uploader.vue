<template>
  <input
    id="uploader"
    :multiple="multiple ? 'multiple' : false"
    type="file"
    accept="image/png, image/jpeg, image/gif"
    style="display: none"
    @change="handleUpload">
</template>

<script>
import vpd from '../mixins/vpd'
export default {
  name: 'VpdUploader',
  mixins: [vpd],
  props: {
    upload: Function,
    uploadOption: Object
  },
  data () {
    return {
      multiple: false, // Разрешить ли множественную загрузку
      uploader: null, // входной файл input file
      cb: null // Перезвонить cb
    }
  },

  computed: {
    // Ордината начального положения изображения
    top () {
      return this.$vpd.state.top
    }
  },

  mounted () {
    this.uploader = document.getElementById('uploader')

    /**
     * Зарегистрируйте пользовательское событие загрузки изображения в глобальном коммуникационном посредничестве
     * Все места, где нужно загрузить фотографии, можно назвать
     *
     * метод вызова：
     * this.$vpd.$emit('upload', function (payload) {/.../})
     * @param payload { Array } Массив, содержащий все объекты изображения после завершения загрузки и загрузки изображения.
     * @param multiple { Boolean } Загружать ли несколько листов, по умолчанию false
     */
    this.$vpd.$on('upload', (cb, multiple) => {
      this.multiple = !!multiple
      this.cb = cb
      setTimeout(() => {
        this.uploader.click()
      }, 0)
    })
  },

  methods: {
    // Обработка операции добавления изображений и триггерных событий：change
    handleUpload () {
      var files = this.uploader.files

      if (!files || files.length === 0) return

      files = Array.prototype.slice.call(this.uploader.files)

      let uploadFn = this.upload || this.defaultUpload

      uploadFn(files).then(res => {
        console.log('status: ', res.status)
        // Выполнить обратный вызов после завершения очереди загрузки изображений
        new Promise(resolve => {
          this.handleLoadQueue(resolve, res.files)()
        }).then(payload => {
          this.cb(payload)
        })
      })
    },

    defaultUpload (files) {
      if (this.uploadOption.url) {
        var data = new FormData()
        files.forEach(file => data.append('file[]', file))

        return fetch(this.uploadOption.url, {
          method: 'POST',
          body: data
        })
      } else {
        alert(this.$t('messages.alerts.imageUploadApiConfigurator'))
      }
    },

    /**
     * Обработка очередей загрузки
     * Изображения загружаются по порядку, а затем загружается следующее, чтобы убедиться, что массив изображений находится в порядке загрузки.
     */
    handleLoadQueue (resolve, files) {
      var i = 0
      var len = files.length
      var payload = []

      var download = () => {
        // После подключения к бэкэнду файлы должны быть изменены на параметры обратного вызова (files)
        // url = files[i]
        var url = window.URL.createObjectURL(files[i])

        new Promise(resolve => {
          this.getImageWidth(url, resolve)
        }).then(size => {
          payload.push({
            width: size.w,
            height: size.h,
            top: this.top,
            url: url, // Адрес предварительного просмотра изображения
            src: 'images/' + files[i].name // Фактический адрес картины
          })

          // После загрузки всех изображений перейдите к следующему шагу, в противном случае продолжите загрузку.
          if (++i === len) {
            resolve(payload)
          } else {
            download()
          }
        })
      }

      return download
    },

    /**
     * Используйте новый метод предварительной загрузки изображения, чтобы получить ширину и высоту изображения. (new Image)
     * Это асинхронная операция и должна быть (promise)
     *
     * @param url { URL | base64 } картина url
     * @param res { Promise resolve }
     *
     * @return { Object } Объект, содержащий ширину и высоту изображения
     */
    getImageWidth (url, res) {
      var img = new Image()
      img.src = url
      img.onload = function () {
        res({
          w: Math.round(img.width),
          h: Math.round(img.height)
        })
      }
    }
  }
}
</script>
