// sessionStorage 操作函数
export default {
  get (key) {
    var v
    if (window.sessionStorage) {
      v = window.sessionStorage.getItem(key) || ''
      try {
        v = JSON.parse(v)
      } catch (e) {}
    } else {
      window.storage = window.storage || {}
      v = window.storage.key || ''
    }
    return v
  },
  set (key, val) {
    if (window.sessionStorage) {
      try {
        val = JSON.stringify(val)
      } catch (e) {}
      window.sessionStorage.setItem(key, val)
    } else {
      window.storage = window.storage || {}
      window.storage.key = val
    }
  },
  clear () {
    if (window.sessionStorage) {
      window.sessionStorage.clear()
    } else {
      window.storage = {}
    }
  },
  remove (key) {
    if (window.sessionStorage) {
      window.sessionStorage.removeItem(key) || ''
    } else {
      window.storage = window.storage || {}
      window.storage.key = ''
    }
  }
}
