<template>
  <header class="header">
    <div class="navbar container grid-xl">
      <section class="logo navbar-section">
        <vpd-icon name="anchor" />
      </section>
      <section class="navbar-section">
        <a
          class="btn btn-link tooltip tooltip-bottom"
          data-tooltip="Копировать элемент (Ctrl + C)"
          @click="copyWidget">
          <vpd-icon name="copy" /> {{ $t('data.actions.copy') }}
        </a>
        <a
          class="btn btn-link tooltip tooltip-bottom"
          data-tooltip="Удалить компонент (Delete)"
          @click="dele">
          <vpd-icon name="trash-2" /> {{ $t('data.actions.delete') }}
        </a>
        <a
          class="btn btn-link tooltip tooltip-bottom"
          data-tooltip="Сохранить (Ctrl + S)"
          @click="save"><vpd-icon name="save" /> {{ $t('data.actions.save') }}</a>
        <select
          class="lang-change"
          @change="changeLang">
          <option
            v-for="(lang, i) in langs"
            :selected="lang === $inter.currentLocale ? 'selected' : ''"
            :key="`Lang${i}`"
            :value="lang">{{ lang }}</option>
        </select>
      </section>
    </div>
  </header>
</template>

<script>
import vpd from '../mixins/vpd'
export default {
  mixins: [vpd],
  data () {
    return {
      langs: this.$inter.availableLocales
    }
  },
  computed: {
    show () {
      return this.$vpd.state.type !== 'page'
    }
  },
  mounted () {
    // Копировать элемент (Ctrl + C)
    document.addEventListener(
      'keyup',
      e => {
        e.stopPropagation()
        if ((e.ctrlKey || e.metaKey) && e.keyCode === 67) {
          this.copyWidget()
        }
      },
      true
    )

    // Удалить выбранный элемент (Delete)
    document.addEventListener(
      'keyup',
      e => {
        e.stopPropagation()
        if (e.keyCode === 46) {
          this.dele()
        }
      },
      true
    )

    // Сохранить (Ctrl + S)
    document.addEventListener(
      'keydown',
      e => {
        e.preventDefault()
        e.stopPropagation()
        if ((e.ctrlKey || e.metaKey) && e.keyCode === 83) {
          this.save()
        }
        e.preventDefault()
        e.stopPropagation()
      },
      true
    )
  },
  beforeDestroy () {
    document.removeEventListener('keyup', this.dele)
    document.removeEventListener('keyup', this.copyWidget)
    document.removeEventListener('keydown', this.save)
  },
  methods: {
    // Сохранить
    save () {
      this.$vpd.dispatch('save')
    },

    // Копировать элемент
    copyWidget () {
      this.$vpd.commit('copy')
    },

    // Удалить компонент
    dele () {
      this.$vpd.commit('delete')
    },

    // Смена языка
    changeLang (e) {
      this.$inter.setCurrentLocale(e.target.value)
    }
  }
}
</script>

<style lang="scss">
@import '../_variables.scss';
.header {
  background-color: #24292e;
  padding: 12px 0;
}
.navbar {
  .svg-icon {
    svg {
      vertical-align: middle;
    }
  }
  .btn.btn-link {
    color: $gray-color;
    margin-right: 15px;
  }
  .btn.btn-link:hover {
    color: $light-color;
  }
  .logo {
    font-size: 20px;
    .svg-icon {
      width: 30px;
      text-align: center;
      background-color: $light-color;
      border-radius: 50%;
    }
  }
  .lang-change {
    width: 80px;
  }
}
</style>
