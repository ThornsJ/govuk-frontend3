import '../../vendor/polyfills/Function/prototype/bind'
import '../../vendor/polyfills/Event' // addEventListener and event.target normaliziation
import '../../vendor/polyfills/Element/prototype/classList'

function Header ($module) {
  this.$module = $module
}

Header.prototype.init = function () {
  // Check for module
  var $module = this.$module
  if (!$module) {
    return
  }

  // Check for button
  var $toggleButton = $module.querySelector('.govuk-js-header-toggle')
  if (!$toggleButton) {
    return
  }

  // Handle $toggleButton click events
  $toggleButton.addEventListener('click', this.handleClick.bind(this))
}

/**
* An event handler for click event on $toggleButton
* @param {object} event event
*/
Header.prototype.handleClick = function (event) {
  var $module = this.$module
  var $toggleButton = event.target || event.srcElement
  var $target = $module.querySelector('#' + $toggleButton.getAttribute('aria-controls'))

  // If a button with aria-controls, handle click
  if ($toggleButton && $target) {
    $target.classList.toggle('govuk-header__navigation--open')
    $toggleButton.classList.toggle('govuk-header__menu-button--open')

    $toggleButton.setAttribute('aria-expanded', $toggleButton.getAttribute('aria-expanded') !== 'true')
    $target.setAttribute('aria-hidden', $target.getAttribute('aria-hidden') === 'false')
  }
}

export default Header
