// Загрузите спрайт
export default function (url, id) {
  var x = new XMLHttpRequest()

  // Если идентификатор установлен и спрайт существует, залог
  if (document.querySelector('#' + id)) {
    return
  }

  // Создать заполнитель (чтобы предотвратить повторную загрузку)
  var container = document.createElement('div')
  container.setAttribute('hidden', '')
  container.setAttribute('id', id)
  document.body.insertBefore(container, document.body.childNodes[0])

  // Проверить поддержку CORS
  if ('withCredentials' in x) {
    x.open('GET', url, true)
  } else {
    return
  }

  // Внедрить скрытый div со спрайтом при загрузке
  x.onload = function () {
    container.innerHTML = x.responseText
  }

  x.send()
}
