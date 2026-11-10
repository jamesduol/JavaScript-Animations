/* eslint-disable no-unused-vars */
import GSAP from 'gsap'
import Animation from 'classes/Animation'

import { split } from 'utils/text'

export default class extends Animation {
  constructor ({ element, elements }) {
    super({
      element,
      elements: {
        text: element.querySelector('span, img') || element
      }
    })

    this.x = {
      current: 0,
      target: 0
    }

    this.y = {
      current: 0,
      target: 0
    }

    this.addEventListener()
  }

  animateIn () {

  }

  animateOut () {

  }

  onResize () {
    this.height = this.element.clientHeight
  }

  onMouseEnter () {
    this.updatePosition()
  }

  onMouseMove ({ clientX, clientY, target }) {
    const { height, width, left, top } = this.elements.text.getBoundingClientRect()

    if (!width || !height) return

    const dx = (clientX - left) / width - 0.5
    const dy = (clientY - top) / height - 0.5

    this.x.target = dx * width * 0.2
    this.y.target = dy * height * 0.2
  }

  onMouseLeave () {
    GSAP.to([this.x, this.y], {
      current: 0,
      duration: 0.2,
      onComplete: _ => window.cancelAnimationFrame(this.frame),
      target: 0
    })
  }

  updatePosition () {
    this.x.current = GSAP.utils.interpolate(this.x.current, this.x.target, 0.1)
    this.y.current = GSAP.utils.interpolate(this.y.current, this.y.target, 0.1)

    GSAP.set(this.elements.text, {
      x: this.x.current,
      y: this.y.current
    })

    this.frame = window.requestAnimationFrame(this.updatePosition.bind(this))
  }

  addEventListener () {
    this.element.addEventListener('mouseenter', this.onMouseEnter)
    this.element.addEventListener('mousemove', this.onMouseMove)
    this.element.addEventListener('mouseleave', this.onMouseLeave)
  }

  removeEventListener () {
    this.element.removeEventListener('mouseenter', this.onMouseEnter)
    this.element.removeEventListener('mousemove', this.onMouseMove)
    this.element.removeEventListener('mouseleave', this.onMouseLeave)
  }
}
