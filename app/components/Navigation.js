/* eslint-disable no-labels */
/* eslint-disable no-dupe-class-members */
/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-constructor */
import GSAP from 'gsap'

import each from 'lodash/each'

import Link from 'animations/Link'
import Component from 'classes/Component'

import { COLOR_BLACK, COLOR_QUARTER_SPANISH_WHITE } from 'utils/colors'
import { mapEach } from 'utils/dom'

export default class Navigation extends Component {
  constructor ({ template }) {
    /**
   * super() is basically a Function that calls the parent constructor.
   */
    super({
      classes: {
        linksActive: 'navigation__link--active'
      },
      element: '.navigation',
      elements: {
        items: '.navigation__list__item',
        links: '.navigation__list__link'
      }
    })

    this.links = mapEach(this.element.links, element => {
      return new Link({
        element
      })
    })

    this.onChange(template)
  }

  /**
   * Functions.
   */
  onChange (template) {
    // each(this.elements.items, link => {
    //   const value = link

    //   if (template === value) {
    //     link.classList.add(this.classes.linksActive)
    //   } else {
    //     link.classList.remove(this.classes.linksActive)
    //   }
    // })
  }

  // Better One
  onChange (template) {
    each(this.elements, link => {
      const value = link

      if (template === value) {
        GSAP.to(this.element, {
          color: COLOR_BLACK
        })
        GSAP.set(this.elements, { autoAlpha: 1 })
        GSAP.set(this.elements, { autoAlpha: 0 })
      } else {
        GSAP.to(this.element, {
          color: COLOR_QUARTER_SPANISH_WHITE
        })
        GSAP.set(this.elements, { autoAlpha: 0 })
        GSAP.set(this.elements, { autoAlpha: 1 })
      }
    })
  }
}
