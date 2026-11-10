import { Plane, Transform } from 'ogl'
import GSAP from 'gsap'

import map from 'lodash/map'

import Media from './Media'

export default class {
  constructor ({ gl, scene, sizes }) {
    this.gl = gl
    this.scene = scene
    this.sizes = sizes

    this.group = new Transform()

    this.galleryElement = document.querySelector('.home__gallery')
    this.mediasElements = document.querySelectorAll('.home__gallery__media__image')
    // this.mediasLinks = document.querySelectorAll('.home__gallery__link')
    // this.mediasTexts = document.querySelectorAll('.home__gallery__text')

    this.y = {
      current: 0,
      target: 0,
      lerp: 0.1
    }

    this.scrollCurrent = {
      x: 0,
      y: 0
    }

    this.scroll = {
      x: 0,
      y: 0
    }

    this.speed = {
      current: 0,
      target: 0,
      lerp: 0.1
    }

    this.velocity = 2

    this.createGeometry()
    this.createGallery()

    this.onResize({
      sizes: this.sizes
    })
  }

  createGeometry () {
    this.geometry = new Plane(this.gl, {
      heightSegments: 20,
      widthSegments: 20
    })
  }

  createGallery () {
    this.medias = map(this.mediasElements, (element, index) => {
      return new Media({
        element,
        geometry: this.geometry,
        index,
        gl: this.gl,
        scene: this.group,
        sizes: this.sizes
      })
    })
  }

  /**
   * Animations.
   */
  show (isPreloaded) {
    this.group.setParent(this.scene)

    map(this.medias, media => media.show(isPreloaded))
  }

  hide () {
    this.group.setParent(null)

    map(this.medias, media => media.hide())
  }

  /**
   * Events.
   */
  onResize (event) {
    // Uncomment these one
    this.galleryBounds = this.galleryElement.getBoundingClientRect()

    this.sizes = event.sizes

    this.gallerySizes = {
      // Uncomment these ones
      height: this.galleryBounds.height / window.innerHeight * this.sizes.height,
      width: this.galleryBounds.width / window.innerWidth * this.sizes.width
    }

    this.scroll.y = this.y.target = 0

    map(this.medias, media => media.onResize(event, this.scroll))
  }

  onTouchDown ({ x, y }) {
    this.scrollCurrent.x = this.scroll.x
    this.scrollCurrent.y = this.scroll.y
  }

  onTouchMove ({ x, y }) {
    const yDistance = y.start - y.end

    this.y.target = this.scrollCurrent.y - yDistance
  }

  onTouchUp ({ x, y }) {

  }

  onWheel ({ pixelX, pixelY }) {
    this.y.target += pixelY

    this.velocity = pixelY > 0 ? 2 : -2
  }

  /**
   * Update.
   */
  update () {
    this.y.target += this.velocity

    this.speed.target = (this.y.target - this.y.current) * 0.001
    this.speed.current = GSAP.utils.interpolate(this.speed.current, this.speed.target, this.speed.lerp)

    this.y.current = GSAP.utils.interpolate(this.y.current, this.y.target, this.y.lerp)

    if (this.scroll.y < this.y.current) {
      this.y.direction = 'top'
    } else if (this.scroll.y > this.y.current) {
      this.y.direction = 'bottom'
    }

    this.scroll.y = this.y.current

    map(this.medias, (media, index) => {
      const offsetY = this.sizes.height * 0.5
      const scaleY = media.mesh.scale.y / 2

      if (this.y.direction === 'top') {
        const y = media.mesh.position.y + scaleY

        if (y < -offsetY) {
          media.extra.y += this.gallerySizes.height
        }
      } else if (this.y.direction === 'bottom') {
        const y = media.mesh.position.y - scaleY

        if (y > offsetY) {
          media.extra.y -= this.gallerySizes.height
        }
      }

      media.update(this.scroll, this.speed.current)
    })
  }

  /**
   * Destroy.
   */
  destroy () {
    this.scene.removeChild(this.group)
  }
}

// From Collections
// import { Renderer, Camera, Transform, Plane, Post, Vec2 } from 'ogl'
// import each from 'lodash/each'

// import fragment from 'shaders/post.glsl'

// import { mapEach } from 'utils/dom'

// import Media from './Media'

// export default class {
//   constructor ({ url }) {
//     this.background = {
//       r: 21,
//       g: 28,
//       b: 19
//     }

//     this.url = url

//     this.renderer = new Renderer()
//     this.gl = this.renderer.gl

//     this.resolution = {
//       value: new Vec2()
//     }

//     this.planeGeometry = new Plane(this.gl, {
//       widthSegments: 20
//     })

//     document.body.appendChild(this.gl.canvas)

//     this.createCamera()
//     this.createScene()
//     this.createPost()

//     this.onResize()

//     this.createList()

//     // const font = new FontFaceObserver('Ampersand', 10000)

//     // font.load().then(_ => {
//     //   this.onResize()
//     // }).catch(_ => {
//     //   this.onResize()
//     // })

//     this.update()
//   }

//   createCamera () {
//     this.camera = new Camera(this.gl)
//     this.camera.fov = 45
//     this.camera.position.z = 5
//   }

//   createScene () {
//     this.scene = new Transform()
//   }

//   createPost () {
//     this.post = new Post(this.gl)

//     this.pass = this.post.addPass({
//       fragment,
//       uniforms: {
//         uResolution: this.resolution
//       }
//     })
//   }

//   createList (url) {
//     this.mediasList = document.querySelector('.home__gallery')
//     this.mediasElements = document.querySelectorAll('.home__gallery__text')
//     this.medias = mapEach(this.mediasElements, (homeItem, index) => {
//       // const homeLink = homeItem.querySelector('.home__gallery__link')
//       // const homeLinkMedia = homeItem.querySelector('.home__gallery__media')

//       // const id = homeLink.href.replace(`${window.location.origin}/case/:uid`, '')

//       const id = document.querySelector('.home__gallery__link')
//       const caseMedia = document.querySelector('.home__gallery__media')

//       const media = new Media({
//         caseMedia,
//         geometry: this.planeGeometry,
//         gl: this.gl,
//         // homeItem,
//         // homeLink,
//         // homeLinkMedia,
//         id,
//         homeList: this.mediasList,
//         scene: this.scene,
//         screen: this.screen,
//         viewport: this.viewport
//       })

//       return media
//     })

//     if (this.url.indexOf('/case/:uid') > -1) {
//       const id = this.url.replace('/case/:uid', '').replace('/', '')
//       const media = this.medias.find(media => media.id === id)

//       media.onOpen()
//     }
//   }

//   /**
//    * Change.
//    */
//   onChange (url) {
//     if (url.indexOf('/work') > -1) {
//       each(this.medias, media => media.onAboutOpen())
//     } else {
//       each(this.medias, media => media.onAboutClose())
//     }

//     if (url.indexOf('/case/:uid') > -1) {
//       const id = url.replace('/case/:uid', '')
//       const media = this.medias.find(media => media.id === id)

//       media.onOpen()
//     } else {
//       each(this.medias, media => media.onClose())
//     }
//   }

//   /**
//    * Touch.
//    */
//   onTouchDown (event) {

//   }

//   onTouchMove (event) {

//   }

//   onTouchUp (event) {

//   }

//   /**
//    * Wheel.
//    */
//   onWheel (event) {

//   }

//   /**
//    * Resize.
//    */
//   onResize () {
//     this.screen = {
//       height: window.innerHeight,
//       width: window.innerWidth
//     }

//     this.renderer.setSize(this.screen.width, this.screen.height)

//     this.camera.perspective({
//       aspect: this.gl.canvas.width / this.gl.canvas.height
//     })

//     const fov = this.camera.fov * (Math.PI / 180)
//     const height = 2 * Math.tan(fov / 2) * this.camera.position.z
//     const width = height * this.camera.aspect

//     this.viewport = {
//       height,
//       width
//     }

//     this.post.resize()

//     this.resolution.value.set(this.gl.canvas.width, this.gl.canvas.height)

//     if (this.medias) {
//       each(this.medias, media => media.onResize({
//         screen: this.screen,
//         viewport: this.viewport
//       }))
//     }
//   }

//   /**
//    * Update.
//    */
//   update (scroll) {
//     this.gl.clearColor(this.background.r / 255, this.background.g / 255, this.background.b / 255, 1)

//     if (this.medias) {
//       each(this.medias, media => {
//         media.update(scroll)
//       })
//     }

//     this.post.render({
//       scene: this.scene,
//       camera: this.camera
//     })
//   }
// }
