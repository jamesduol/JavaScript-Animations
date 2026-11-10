import Prefix from 'prefix'

import each from 'lodash/each'

import Component from 'classes/Component'

import { getOffset } from 'utils/dom'
import { lerp } from 'utils/math'

export default class extends Component {
  constructor ({ element, elements }) {
    super({
      element,
      elements
    })

    this.transformPrefix = Prefix('transform')

    this.speed = 2
    this.scroll = {
      ease: 0.1,
      position: 0,
      current: 0,
      target: 0,
      last: 0,
      clamp: 0
    }

    each(this.elements.items, element => {
      const offset = getOffset(element)

      element.extra = 0
      element.width = offset.width
      element.offset = offset.top
      element.position = 0
    })

    this.length = this.elements.items.length

    this.width = this.elements.items[0].width
    this.widthTotal = this.elements.list.getBoundingClientRect().width
  }

  enable () {
    this.isEnabled = true

    this.update()
  }

  disable () {
    this.isEnabled = false
  }

  // onTouchDown (event) {
  //   if (!this.isEnabled) return

  //   this.isRight = true

  //   this.scroll.position = this.scroll.current
  //   this.start = event.touches ? event.touches[0].clientX : event.clientX
  // }

  onTouchMove (event) {
    if (!this.isRight || !this.isEnabled) return

    const x = event.touches ? event.touches[0].clientX : event.clientX
    const distance = (this.start - x) * 2

    this.scroll.target = this.scroll.position + distance
  }

  // onTouchUp (event) {
  //   if (!this.isEnabled) return

  //   this.isRight = false
  // }

  onWheel (normalized) {
    if (!this.isEnabled) return

    const speed = normalized.pixelX * 0.5

    this.scroll.target += speed

    this.speed = speed > 0 ? 2 : -2
  }

  transform (element, x) {
    element.style[this.transformPrefix] = `translate3d(0, ${Math.floor(x)}px, 0)`
  }

  update () {
    if (!this.isEnabled) return

    this.scroll.target += this.speed
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease)

    const scrollClamp = Math.round(this.scroll.current % this.widthTotal)

    if (this.scroll.current < this.scroll.last) {
      this.direction = 'right'
    } else {
      this.direction = 'left'
    }

    each(this.elements.items, (element, index) => {
      element.position = -this.scroll.current - element.extra

      const offset = element.position + element.offset + element.width

      element.isBefore = offset < 0
      element.isAfter = offset > this.widthTotal

      if (this.direction === 'left' && element.isBefore) {
        element.extra = element.extra - this.widthTotal

        element.isBefore = false
        element.isAfter = false
      }

      if (this.direction === 'right' && element.isAfter) {
        element.extra = element.extra + this.widthTotal

        element.isBefore = false
        element.isAfter = false
      }

      element.clamp = element.extra % scrollClamp

      this.transform(element, element.position)
    })

    this.scroll.last = this.scroll.current
    this.scroll.clamp = scrollClamp
  }

  onResize () {
    each(this.elements.items, element => {
      this.transform(element, 0)

      const offset = getOffset(element)

      element.extra = 0
      element.width = offset.width
      element.offset = offset.top
      element.position = 0
    })

    this.width = this.elements.items[0].getBoundingClientRect().width
    this.widthTotal = this.elements.list.getBoundingClientRect().width

    this.scroll = {
      ease: 0.1,
      position: 0,
      current: 0,
      target: 0,
      last: 0
    }
  }
}
