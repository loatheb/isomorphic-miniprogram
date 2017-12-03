export function createFrame(id, src, hidden, parent = document.body) {
  const el = document.createElement('iframe')
  el.setAttribute('src', src)
  el.setAttribute('id', id)
  el.setAttribute('name', id)
  el.setAttribute('seamless', 'seamless')
  el.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-modals')
  el.setAttribute('frameborder', '0')
  el.setAttribute('width', hidden ? '0' : '100%')
  el.setAttribute('height', hidden ? '0' : '100%')
  if (hidden) {
    el.setAttribute('style', 'width:0;height:0;border:0; display:none;')
  }
  parent.appendChild(el)
  return el
}
