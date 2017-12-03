function onRoute() {
  util.redirectTo(curr.url)
  Bus.emit('route', getViewIds().length, curr)
  const arr = []
  let view = curr
  while (view) {
    arr.push(view.url)
    if (view.pid != null) {
      view = getViewById(view.pid)
    } else {
      view = null
    }
  }
  const str = arr.reverse().join('|')
  sessionStorage.setItem('routes', str)
}

export function navigateTo(path) {
  path = normalize(path)
  const exists = tabViews[path]
  if (curr) curr.hide()
  if (exists) {
    curr = exists
    exists.show()
  } else {
    const isTabView = util.isTabbar(path)
    const pid = curr ? curr.id : null
    const v = curr = new View(path)
    curr.pid = isTabView ? null : pid
    views[v.id] = v
    if (isTabView) tabViews[path] = curr
  }
  onRoute()
}
