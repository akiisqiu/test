const directiveBindingDirective = {
  mounted(el, binding) {
    const { arg = 'click', value } = binding
    const handleClick = (event) => {
      if (el.isWaiting === 'true') {
        event.preventDefault()
        event.stopPropagation()
        return
      }
      el.isWaiting = 'true'
      const classes = Array.from(el.classList)
      el.className = [...classes, 'is-disabled', 'eacon-pointer-events-none'].join(' ')

      let fn
      let params = []
      if (typeof value == 'function') {
        fn = value
      } else {
        fn = (value ).fn
        params = (value)?.params ?? []
      }

      try {
        fn(event, ...params)?.finally(() => {
          el.isWaiting = false
          el.className = classes.join(' ')
        })
      } catch (error) {
        el.isWaiting = false
        el.className = classes.join(' ')
        throw new Error("回调错误")
      }
    }

    el.isWaiting = false
    el.bindEvent = handleClick
    el.addEventListener(arg, handleClick)
  },
  //销毁事件
  beforeUnmount(el, binding) {
    const { arg = 'click' } = binding
    el.bindEvent && el.removeEventListener(arg, el.bindEvent)
  }
}
export default directiveBindingDirective
