import { Plane, Transform } from 'ogl'
// import GSAP from 'gsap'

import map from 'lodash/map'

import Media from './Media'

export default class {
  constructor ({ gl, scene, sizes }) {
    this.gl = gl
    this.scene = scene
    this.sizes = sizes

    this.group = new Transform()

    this.createGeometry()
    this.createGalleries()

    this.onResize({
      sizes: this.sizes
    })
  }

  createGeometry () {
    this.geometry = new Plane(this.gl)
  }

  createGalleries () {
    this.galleriesElements = document.querySelectorAll('.contact__leadership__gallery__media')

    this.galleries = map(this.galleriesElements, (element, index) => {
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
  show () {
    // this.group.setParent(this.scene)

    // map(this.galleries, Media => Media.show())
  }

  hide () {
    // this.group.setParent(null)

    // map(this.galleries, Media => Media.hide())
  }

  /**
   * Events.
   */
  onResize (event) {
    // map(this.galleries, Media => Media.onResize(event))
  }

  onTouchDown (event) {
    // map(this.galleries, Media => Media.onTouchDown(event))
  }

  onTouchMove (event) {
    // map(this.galleries, Media => Media.onTouchMove(event))
  }

  onTouchUp (event) {
    // map(this.galleries, Media => Media.onTouchUp(event))
  }

  onWheel ({ pixelX, pixelY }) {

  }

  /**
   * Update.
   */
  update (scroll) {
    // map(this.galleries, Media => Media.update(scroll))
  }

  /**
   * Destroy.
   */
  destroy () {
    // map(this.galleries, Media => Media.destroy())
  }
}
