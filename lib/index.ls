setDOM = (plugins) -> (prev, next) ->
  assert prev && prev.nodeType, 'You must provide a valid node to update.'
  prev = prev.documentElement if prev.nodeType is DOCUMENT_TYPE
  if typeof next is 'string'
    if prev is document.documentElement
      HTML_ELEMENT.innerHTML = next
      next = HTML_ELEMENT
    else
      BODY_ELEMENT.innerHTML = next
      next = BODY_ELEMENT.firstChild
  setNode prev, next
  return

setNode = (plugins,prev, next) ->
  if prev.nodeType is ELEMENT_TYPE
    setChildNodes plugins,prev, prev.childNodes, next.childNodes
    if prev.nodeName is next.nodeName
      for plugin in plugins
        that prev,next if plugin.update?
      #setAttributes prev, prev.attributes, next.attributes
    else
      newPrev = next.cloneNode!
      while prev.firstChild
        newPrev.appendChild prev.firstChild
      prev.parentNode.replaceChild newPrev, prev
  else
    if prev.nodeType is next.nodeType then prev.nodeValue = next.nodeValue else prev.parentNode.replaceChild next, prev
  return

setAttributes = (parent, prev, next) ->
  i = void
  a = void
  b = void
  ns = void
  i = prev.length
  while i--
    a = prev[i]
    ns = a.namespaceURI
    b = next.getNamedItemNS ns, a.name
    prev.removeNamedItemNS ns, a.name if not b
  i = next.length
  while i--
    a = next[i]
    ns = a.namespaceURI
    b = prev.getNamedItemNS ns, a.name
    if not b
      next.removeNamedItemNS ns, a.name
      prev.setNamedItemNS a
    else
      if b.value isnt a.value then b.value = a.value
  return

setChildNodes = (plugins,parent, prevChildNodes, nextChildNodes) ->
  key = void
  a = void
  b = void
  oldPosition = void
  newPosition = void
  prev = keyNodes prevChildNodes
  next = keyNodes nextChildNodes
  for key of prev
    ``key = key``
    continue if next[key]
    parent.removeChild prev[key]
  (for key of next
    ``key = key``
    a = prev[key]
    b = next[key]
    if a
      setNode plugins,a, b
      oldPosition = a[NODE_INDEX]
      newPosition = b[NODE_INDEX]
      continue if oldPosition is newPosition
      if prevChildNodes[newPosition] is a then continue
      parent.insertBefore a, prevChildNodes[newPosition]
    else
      parent.appendChild b)
  return

keyNodes = (childNodes) ->
  result = {}
  i = childNodes.length
  el = void
  while i--
    el = childNodes[i]
    el[NODE_INDEX] = i
    result[(getKey el) or i] = el
  result

getKey = (node) ->
  return  if node.nodeType isnt ELEMENT_TYPE
  (node.getAttribute 'data-key') or node.id

assert = (val, msg) ->
  throw new Error 'set-dom: ' + msg if not val
  return

'use strict'

NODE_INDEX = '__set-dom-index__'
ELEMENT_TYPE = 1
DOCUMENT_TYPE = 9
HTML_ELEMENT = document.createElement 'html'
BODY_ELEMENT = document.createElement 'body'
module.exports = setDOM
