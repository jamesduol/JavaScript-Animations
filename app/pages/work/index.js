/* eslint-disable constructor-super */
import Page from 'classes/Page'

export default class extends Page {
  constructor () {
    super({
      id: 'work',

      classes: {
        active: 'work--active'
      },

      element: '.work',
      elements: {
        wrapper: '.work__wrapper',

        navigation: document.querySelector('.navigation'),
        title: '.work__title'
      }
    })
  }

  /**
   * Animations.
   */
  async show (url) {
    this.element.classList.add(this.classes.active)

    return super.show(url)
  }

  async hide (url) {
    this.element.classList.remove(this.classes.active)

    return super.hide(url)
  }
}
