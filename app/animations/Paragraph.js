/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable constructor-super */
/* eslint-disable no-this-before-super */
// My Crazy Animations

// // Bizarro
import each from 'lodash/each'

import Animation from 'classes/Animation'

import { easing } from 'utils/dom'
import { calculate, split } from 'utils/text'
export default class Paragraph extends Animation {
  constructor ({ element }) {
    const lines = []
    const paragraphs = element.querySelectorAll('h1, h2, h3, p')

    if (paragraphs.length !== 0) {
      each(paragraphs, element => {
        split({ element })
        split({ element })

        lines.push(...element.querySelectorAll('span span'))
      })
    } else {
      split({ element })
      split({ element })

      lines.push(...element.querySelectorAll('span span'))
    }

    super({
      element,
      elements: {
        lines
      }
    })

    this.onResize()

    if ('IntersectionObserver' in window) {
      this.animateOut()
    }
  }

  animateIn () {
    super.animateIn()

    each(this.lines, (line, lineIndex) => {
      each(line, word => {
        word.style.transition = `transform 1.5s ${lineIndex * 0.1}s ${easing}`
        word.style[this.transformPrefix] = 'translateY(0)'
      })
    })
  }

  animateOut () {
    super.animateOut()

    each(this.lines, line => {
      each(line, word => {
        word.style[this.transformPrefix] = 'translateY(100%)'
      })
    })
  }

  onResize () {
    this.lines = calculate(this.elements.lines)
  }
}

// Performance improvement
// import GSAP from 'gsap'

// import Animation from 'classes/Animation'

// export default class Paragraph extends Animation {
//   constructor ({ element, elements }) {
//     super({ element, elements })
//   }

//   animateIn () {
//     this.timelineIn = GSAP.timeline({
//       // autoAlpha: 0
//       delay: 0.5
//     })

//     this.timelineIn.to(this.element, {
//       autoAlpha: 1,
//       duration: 1
//     })
//   }

//   animateOut () {
//     GSAP.set(this.element, {
//       autoAlpha: 0
//     })
//   }
// }

// import GSAP from 'gsap'

// import Animation from 'classes/Animation'
// import { calculate, split } from 'utils/text'
// import each from 'lodash/each'

// export default class Paragraph extends Animation {
//   constructor ({ element, elements }) {
//     super({
//       element,
//       elements
//     })

//     this.elementLinesSpans = split({
//       append: true,
//       element: this.element
//     })
//   }

//   animateIn () {
//     this.timelineIn = GSAP.timeline({
//       delay: 0.5
//     })

//     this.timelineIn.set(this.element, {
//       autoAlpha: 1
//     })

//     each(this.elementsLines, (line, index) => {
//       this.timelineIn.fromTo(line, {
//         // Here we will play with autoAlpha
//         autoAlpha: 0,
//         y: '100%'
//       }, {
//         autoAlpha: 1,
//         delay: index * 0.2,
//         duration: 1.5,
//         ease: 'expo.out',
//         y: '0%'
//       }, 0)
//     })
//   }

//   animateOut () {
//     GSAP.set(this.element, {
//       autoAlpha: 0
//     })
//   }

//   onResize () {
//     this.elementsLines = calculate(this.elementLinesSpans)
//   }
// }
