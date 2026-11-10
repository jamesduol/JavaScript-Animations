// /* eslint-disable no-unused-vars */
// // /* eslint-disable no-unused-vars */
// // /* eslint-disable no-this-before-super */
// // /* eslint-disable constructor-super */
// // import Component from 'classes/Component'

// // /**
// //    * export default class extends is a Subclass.
// //    */
// // export default class Animation extends Component {
// //   /**
// //    * A Constructor () {) is basically a function.
// //    */
// //   constructor ({ element, elements }) {
// //     /**
// //    * super() is basically a Function that calls the parent constructor.
// //    */
// //     super({ element, elements })

// //     /**
// //    * Properties.
// //    */
// //     const { animationDelay, animationTarget } = element.dataset

// //     this.delay = animationDelay

// //     this.createObserver()

// //     this.animateOut()
// //   }

// //   /**
// //    * Functions.
// //    */
// //   createObserver () {
// //     this.observer = new window.IntersectionObserver(entries => {
// //       entries.forEach(entry => {
// //         if (entry.isIntersecting) {
// //           this.animateIn()
// //         } else {
// //           this.animateOut()
// //         }
// //       })
// //     })

// //     this.observer.observe(this.element)
// //   }

// //   /**
// //    * Animations.
// //    */
// //   animateIn () {}

// //   animateOut () {}

// //   /**
// //    * Events.
// //    */
// //   onResize () {}
// // }

// // From Bizarro
// import Prefix from 'prefix'
// import each from 'lodash/each'

// export default class {
//   constructor ({ element, elements }) {
//     const { animationDelay, animationTarget } = element.dataset

//     this.delay = animationDelay

//     this.element = element
//     this.elements = elements

//     this.target = animationTarget ? element.closest(animationTarget) : element
//     this.transformPrefix = Prefix('transform')

//     this.isVisible = false

//     if ('IntersectionObserver' in window) {
//       this.createObserver()

//       this.animateOut()
//     } else {
//       this.animateIn()
//     }
//   }

//   createObserver () {
//     this.observer = new window.IntersectionObserver(entries => {
//       each(entries, entry => {
//         if (!this.isVisible && entry.isIntersecting) {
//           this.animateIn()
//         }
//       })
//     }).observe(this.target)
//   }

//   animateIn () {
//     this.isVisible = true
//   }

//   animateOut () {
//     this.isVisible = false
//   }

//   /**
//    * Events.
//    */
//   // onResize () {}
// }

// From Floema
import AutoBind from 'auto-bind'
import Prefix from 'prefix'

export default class {
  constructor ({ element, elements }) {
    AutoBind(this)

    const { animationDelay, animationTarget } = element.dataset

    this.delay = animationDelay

    this.element = element
    this.elements = elements

    this.target = animationTarget ? element.closest(animationTarget) : element
    this.transformPrefix = Prefix('transform')

    this.isVisible = false

    if ('IntersectionObserver' in window) {
      this.createObserver()

      this.animateOut()
    } else {
      this.animateIn()
    }
  }

  createObserver () {
    this.observer = new window.IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!this.isVisible && entry.isIntersecting) {
          this.animateIn()
        } else {
          this.animateOut()
        }
      })
    }).observe(this.target)
  }

  animateIn () {
    this.isVisible = true
  }

  animateOut () {
    this.isVisible = false
  }
}
