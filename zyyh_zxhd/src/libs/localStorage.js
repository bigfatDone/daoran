// localStorage 操作函数
export default {
  get (key) {
    var v
    if (window.localStorage) {
      v = window.localStorage.getItem(key) || ''
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
    if (window.localStorage) {
      try {
        val = JSON.stringify(val)
      } catch (e) {}
      window.localStorage.setItem(key, val)
    } else {
      window.storage = window.storage || {}
      window.storage.key = val
    }
  },
  clear () {
    if (window.localStorage) {
      window.localStorage.clear()
    } else {
      window.storage = {}
    }
  },
  remove (key) {
    if (window.localStorage) {
      window.localStorage.removeItem(key) || ''
    } else {
      window.storage = window.storage || {}
      window.storage.key = ''
    }
  }
}
