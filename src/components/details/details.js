/**
 * JavaScript 'polyfill' for HTML5's <details> and <summary> elements
 * and 'shim' to add accessiblity enhancements for all browsers
 *
 * http://caniuse.com/#feat=details
 *
 * Usage instructions:
 * the 'polyfill' will be automatically initialised
 */
import '../../vendor/polyfills/Function/prototype/bind'
import '../../vendor/polyfills/Event' // addEventListener and event.target normaliziation

var KEY_ENTER = 13
var KEY_SPACE = 32

// Create a flag to know if the browser supports navtive details
var NATIVE_DETAILS = typeof document.createElement('details').open === 'boolean'

function Details () {
}

/**
* Handle cross-modal click events
* @param {object} node element
* @param {function} callback function
*/
Details.prototype.handleKeyDown = function (node, callback) {
  node.addEventListener('keypress', function (event) {
    var target = event.target
    // When the key gets pressed - check if it is enter or space
    if (event.keyCode === KEY_ENTER || event.keyCode === KEY_SPACE) {
      if (target.nodeName.toLowerCase() === 'summary') {
        // Prevent space from scrolling the page
        // and enter from submitting a form
        event.preventDefault()
        // Click to let the click event do all the necessary action
        if (target.click) {
          target.click()
        } else {
          // except Safari 5.1 and under don't support .click() here
          callback(event, target)
        }
      }
    }
  })

  // Prevent keyup to prevent clicking twice in Firefox when using space key
  node.addEventListener('keyup', function (event) {
    var target = event.target
    if (event.keyCode === KEY_SPACE) {
      if (target.nodeName.toLowerCase() === 'summary') {
        event.preventDefault()
      }
    }
  })

  node.addEventListener('click', function (event) {
    var target = event.target
    callback(event, target)
  })
}

/**
* Get the nearest ancestor element of a node that matches a given tag name
* @param {object} node element
* @param {string} match tag name (e.g. div)
*/
Details.prototype.getAncestor = function (node, match) {
  do {
    if (!node || node.nodeName.toLowerCase() === match) {
      break
    }
    node = node.parentNode
  } while (node)

  return node
}

/**
* Initialise the script on a list of details elements in a container
* @param {object} list of details elements
* @param {string} container where to look for details elements
*/
Details.prototype.init = function (list, container) {
  container = container || document.body

  // Get the collection of details elements, but if that's empty
  // then we don't need to bother with the rest of the scripting
  if ((list = container.getElementsByTagName('details')).length === 0) {
    return
  }
  // else iterate through them to apply their initial state
  var n = list.length
  var i = 0
  for (i; i < n; i++) {
    var details = list[i]

    // Save shortcuts to the inner summary and content elements
    details.__summary = details.getElementsByTagName('summary').item(0)
    details.__content = details.getElementsByTagName('div').item(0)

    // If <details> doesn't have a <summary> and a <div> representing the content
    // it means the required HTML structure is not met so the script will stop
    if (!details.__summary || !details.__content) {
      return
    }

    // If the content doesn't have an ID, assign it one now
    // which we'll need for the summary's aria-controls assignment
    if (!details.__content.id) {
      details.__content.id = 'details-content-' + i
    }

    // Add ARIA role="group" to details
    details.setAttribute('role', 'group')

    // Add role=button to summary
    details.__summary.setAttribute('role', 'button')

    // Add aria-controls
    details.__summary.setAttribute('aria-controls', details.__content.id)

    // Set tabIndex so the summary is keyboard accessible for non-native elements
    // http://www.saliences.com/browserBugs/tabIndex.html
    if (!NATIVE_DETAILS) {
      details.__summary.tabIndex = 0
    }

    // Detect initial open state
    var openAttr = details.getAttribute('open') !== null
    if (openAttr === true) {
      details.__summary.setAttribute('aria-expanded', 'true')
      details.__content.setAttribute('aria-hidden', 'false')
    } else {
      details.__summary.setAttribute('aria-expanded', 'false')
      details.__content.setAttribute('aria-hidden', 'true')
      if (!NATIVE_DETAILS) {
        details.__content.style.display = 'none'
      }
    }

    // Create a circular reference from the summary back to its
    // parent details element, for convenience in the click handler
    details.__summary.__details = details
  }

  // Bind an event to handle summary elements
  this.handleKeyDown(container, function (event, summary) {
    if (!(summary = this.getAncestor(summary, 'summary'))) {
      return true
    }
    return this.stateChange(summary)
  }.bind(this))
}

/**
* Define a statechange function that updates aria-expanded and style.display
* @param {object} summary element
*/
Details.prototype.stateChange = function (summary) {
  var expanded = summary.__details.__summary.getAttribute('aria-expanded') === 'true'
  var hidden = summary.__details.__content.getAttribute('aria-hidden') === 'true'

  summary.__details.__summary.setAttribute('aria-expanded', (expanded ? 'false' : 'true'))
  summary.__details.__content.setAttribute('aria-hidden', (hidden ? 'false' : 'true'))

  if (!NATIVE_DETAILS) {
    summary.__details.__content.style.display = (expanded ? 'none' : '')

    var hasOpenAttr = summary.__details.getAttribute('open') !== null
    if (!hasOpenAttr) {
      summary.__details.setAttribute('open', 'open')
    } else {
      summary.__details.removeAttribute('open')
    }
  }
  return true
}

/**
* Remove the click event from the node element
* @param {object} node element
*/
Details.prototype.destroy = function (node) {
  node.removeEventListener('keypress')
  node.removeEventListener('keyup')
  node.removeEventListener('click')
}

export default Details
