import GSAP from 'gsap'
import { Mesh, Plane, Program } from 'ogl'

import fragment from 'shaders/transition-fragment.glsl'
import vertex from 'shaders/transition-vertex.glsl'

export default class {
  constructor ({ home, gl, scene, sizes, url }) {
    this.home = home
    this.gl = gl
    this.scene = scene
    this.sizes = sizes
    this.url = url

    this.geometry = new Plane(this.gl)
  }

  createProgram (texture) {
    this.program = new Program(this.gl, {
      fragment,
      vertex,
      uniforms: {
        uAlpha: { value: 1 },
        tMap: { value: texture }
      }
    })
  }

  createMesh (mesh) {
    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    })

    this.mesh.scale.x = mesh.scale.x
    this.mesh.scale.y = mesh.scale.y
    this.mesh.scale.z = mesh.scale.z

    this.mesh.position.x = mesh.position.x
    this.mesh.position.y = mesh.position.y
    this.mesh.position.z = mesh.position.z + 0.01

    this.mesh.rotation.x = mesh.rotation.x
    this.mesh.rotation.y = mesh.rotation.y
    this.mesh.rotation.z = mesh.rotation.z

    this.mesh.setParent(this.scene)
  }

  /**
   * Element.
   */
  setElement (element) {
    if (element.id === 'home') {
      const { index, medias } = element
      const media = medias[index]

      this.createProgram(media.texture)
      this.createMesh(media.mesh)

      this.transition = 'case'
    } else {
      this.createProgram(element.texture)
      this.createMesh(element.mesh)

      this.transition = 'home'
    }
  }

  /**
   * Animations.
   */
  animate (element, onComplete) {
    const timeline = GSAP.timeline()

    timeline.to(this.mesh.scale, {
      duration: 1.5,
      ease: 'expo.inOut',
      x: element.scale.x,
      y: element.scale.y,
      z: element.scale.z
    }, 0)

    timeline.to(this.mesh.position, {
      duration: 1.5,
      ease: 'expo.inOut',
      x: element.position.x,
      y: element.position.y,
      z: element.position.z
    }, 0)

    timeline.to(this.mesh.rotation, {
      duration: 1.5,
      ease: 'expo.inOut',
      x: element.rotation.x,
      y: element.rotation.y,
      z: element.rotation.z
    }, 0)

    timeline.call(_ => {
      onComplete()
    })

    timeline.call(_ => {
      this.scene.removeChild(this.mesh)
    }, null, '+=0.2')
  }
}
