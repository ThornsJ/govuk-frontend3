/**
* Add event construct for modern browsers or IE8
* which fires the callback with a pre-converted target reference
* @param {object} node element
* @param {string} type event type (e.g. click, load, or error)
* @param {function} callback function
*/
export function addEvent (node, type, callback) {
  // Support: IE9+ and other browsers
  if (node.addEventListener) {
    node.addEventListener(type, function (event) {
      callback(event, event.target)
    }, false)
  // Support: IE8
  } else if (node.attachEvent) {
    node.attachEvent('on' + type, function (event) {
      callback(event, event.srcElement)
    })
  }
}

/**
* Remove event utility for modern browsers or IE8
* @param {object} node element
* @param {string} type event type (e.g. click, load, or error)
* @param {function} callback function
*/
export function removeEvent (node, type, callback) {
  // Support: IE9+ and other browsers
  if (node.removeEventListener) {
    node.removeEventListener(type, function (event) {
      callback(event, event.target)
    }, false)
  // Support: IE8
  } else if (node.detachEvent) {
    node.detachEvent('on' + type, function (event) {
      callback(event, event.srcElement)
    })
  }
}

/**
* Cross-browser character code / key pressed
* @param {object} event event
* @returns {number} character code
*/
export function charCode (event) {
  return (typeof event.which === 'number') ? event.which : event.keyCode
}

/**
* Cross-browser preventing default action
* @param {object} event event
*/
export function preventDefault (event) {
  // Support: IE9+ and other browsers
  if (event.preventDefault) {
    event.preventDefault()
  // Support: IE8
  } else {
    event.returnValue = false
  }
}

/**
 * TODO: Ideally this would be a NodeList.prototype.forEach polyfill
 * This seems to fail in IE8, requires more investigation.
 * See: https://github.com/imagitama/nodelist-foreach-polyfill
 */
export function nodeListForEach (nodes, callback) {
  if (window.NodeList.prototype.forEach) {
    return nodes.forEach(callback)
  }
  for (var i = 0; i < nodes.length; i++) {
    callback.call(window, nodes[i], i, nodes)
  }
}

// Used to generate a unique string, allows multiple instances of the component without
// Them conflicting with each other.
// https://stackoverflow.com/a/8809472
export function generateUniqueID () {
  var d = new Date().getTime()
  if (typeof window.performance !== 'undefined' && typeof window.performance.now === 'function') {
    d += window.performance.now() // use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}
