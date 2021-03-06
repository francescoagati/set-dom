// Generated by LiveScript 1.5.0
(function(){
  var setDOM, setNode, setAttributes, setChildNodes, keyNodes, getKey, assert, NODE_INDEX, ELEMENT_TYPE, DOCUMENT_TYPE, HTML_ELEMENT, BODY_ELEMENT;
  setDOM = function(plugins){
    return function(prev, next){
      assert(prev && prev.nodeType, 'You must provide a valid node to update.');
      if (prev.nodeType === DOCUMENT_TYPE) {
        prev = prev.documentElement;
      }
      if (typeof next === 'string') {
        if (prev === document.documentElement) {
          HTML_ELEMENT.innerHTML = next;
          next = HTML_ELEMENT;
        } else {
          BODY_ELEMENT.innerHTML = next;
          next = BODY_ELEMENT.firstChild;
        }
      }
      setNode(prev, next);
    };
  };
  setNode = function(plugins, prev, next){
    var i$, len$, plugin, that, newPrev;
    if (prev.nodeType === ELEMENT_TYPE) {
      setChildNodes(plugins, prev, prev.childNodes, next.childNodes);
      if (prev.nodeName === next.nodeName) {
        for (i$ = 0, len$ = plugins.length; i$ < len$; ++i$) {
          plugin = plugins[i$];
          if ((that = plugin.update) != null) {
            that(prev, next);
          }
        }
      } else {
        newPrev = next.cloneNode();
        while (prev.firstChild) {
          newPrev.appendChild(prev.firstChild);
        }
        prev.parentNode.replaceChild(newPrev, prev);
      }
    } else {
      if (prev.nodeType === next.nodeType) {
        prev.nodeValue = next.nodeValue;
      } else {
        prev.parentNode.replaceChild(next, prev);
      }
    }
  };
  setAttributes = function(parent, prev, next){
    var i, a, b, ns;
    i = void 8;
    a = void 8;
    b = void 8;
    ns = void 8;
    i = prev.length;
    while (i--) {
      a = prev[i];
      ns = a.namespaceURI;
      b = next.getNamedItemNS(ns, a.name);
      if (!b) {
        prev.removeNamedItemNS(ns, a.name);
      }
    }
    i = next.length;
    while (i--) {
      a = next[i];
      ns = a.namespaceURI;
      b = prev.getNamedItemNS(ns, a.name);
      if (!b) {
        next.removeNamedItemNS(ns, a.name);
        prev.setNamedItemNS(a);
      } else {
        if (b.value !== a.value) {
          b.value = a.value;
        }
      }
    }
  };
  setChildNodes = function(plugins, parent, prevChildNodes, nextChildNodes){
    var key, a, b, oldPosition, newPosition, prev, next;
    key = void 8;
    a = void 8;
    b = void 8;
    oldPosition = void 8;
    newPosition = void 8;
    prev = keyNodes(prevChildNodes);
    next = keyNodes(nextChildNodes);
    for (key in prev) {
      key = key
      if (next[key]) {
        continue;
      }
      parent.removeChild(prev[key]);
    }
    for (key in next) {
      key = key
      a = prev[key];
      b = next[key];
      if (a) {
        setNode(plugins, a, b);
        oldPosition = a[NODE_INDEX];
        newPosition = b[NODE_INDEX];
        if (oldPosition === newPosition) {
          continue;
        }
        if (prevChildNodes[newPosition] === a) {
          continue;
        }
        parent.insertBefore(a, prevChildNodes[newPosition]);
      } else {
        parent.appendChild(b);
      }
    }
  };
  keyNodes = function(childNodes){
    var result, i, el;
    result = {};
    i = childNodes.length;
    el = void 8;
    while (i--) {
      el = childNodes[i];
      el[NODE_INDEX] = i;
      result[getKey(el) || i] = el;
    }
    return result;
  };
  getKey = function(node){
    if (node.nodeType !== ELEMENT_TYPE) {
      return;
    }
    return node.getAttribute('data-key') || node.id;
  };
  assert = function(val, msg){
    if (!val) {
      throw new Error('set-dom: ' + msg);
    }
  };
  'use strict';
  NODE_INDEX = '__set-dom-index__';
  ELEMENT_TYPE = 1;
  DOCUMENT_TYPE = 9;
  HTML_ELEMENT = document.createElement('html');
  BODY_ELEMENT = document.createElement('body');
  module.exports = setDOM;
}).call(this);
