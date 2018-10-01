import React, { Component } from 'react';
import * as api from '../../util/api'
import './thumbnail.css'

// const IMAGE_SIZES = {
//   th: {
//     width: 160,
//     height: 90,
//   },
//   square: {
//     width: 100,
//     height: 100,
//   },
//   sm: {
//     width: 320,
//     height: 180,
//   },
//   md: {
//     width: 640,
//     height: 360,
//   },
//   lg: {
//     width: 1280,
//     height: 720,
//   }
// }

class Thumbnail extends Component {
  constructor(props) {
    super()
    this.state = {}
  }
  render(){
    const props = this.props
    if (props.noplaceholder && (!props.node || !props.src)) return null
    let size = props.size || 'th'
    let img_size = size === 'square' ? 'th' : size
    let thumb_url;
    let classes = '';
    if (props.src) {
      thumb_url = props.src
    }
    else if (props.node) {
      thumb_url = api.image_url(props.node, props.type, img_size)
    }
    else {
      thumb_url = "/static/vframe-logo-blue.png"
      classes = 'grayscale lighten25'
    }
    if (props.node && props.node.graphic) {
      classes += 'graphic'
    }
    // const dims = IMAGE_SIZES[img_size]
    let regions;
    if (props.showAnnotations && props.node && props.node.regions.length) {
      regions = (
        <canvas ref="canvas" />
      )
    }
    // if (node && node.height && node.width && node.regions && node.regions.length) {
    //   const scale = Math.min(dims.width / node.width, dims.height / node.height)
    //   regions = props.node.regions.map((region, i) => {
    //     console.log(region.x - 0.5)
    //     const position = {
    //       transform: "translate3D(" + [
    //           ((region.x - 0.5) * node.width) + "%",
    //           ((region.y - 0.5) * node.height) + "%",
    //           0
    //         ] + ")",
    //       width: scale * node.width * region.width,
    //       height: scale * node.height * region.height,
    //     }
    //     return (
    //       <div style={position} key={i} />
    //     )
    //   })
    // }
    return (
      <div
        className={'thumbnail rounded ' + size + ' ' + classes}
      >
        <img src={  thumb_url} ref="img" alt="thumbnail" />
        {regions}
      </div>
    )
  }
  componentDidMount(){
    this.redraw()
  }
  componentDidUpdate(){
    this.redraw()
  }
  redraw(){
    const props = this.props
    if (!(props.showAnnotations && props.node && props.node.regions.length)) return
    const canvas = this.refs.canvas
    const ctx = canvas.getContext("2d")
    const img = this.refs.img
    let loaded = false
    img.onload = () => {
      if (loaded) return
      loaded = true
      const width = img.offsetWidth * devicePixelRatio
      const height = img.offsetHeight * devicePixelRatio
      canvas.width = width
      canvas.height = height
      ctx.clearRect(0, 0, width, height)
      props.node.regions.forEach(region => {
        const x = region.x * width
        const y = region.y * height
        const w = region.width * width
        const h = region.height * height
        ctx.fillStyle = "rgba(0,0,255,0.3)"
        ctx.strokeStyle = "rgba(0,0,255,1.0)"
        ctx.strokeWidth = "1px"
        ctx.fillRect(x, y, w, h)
        ctx.strokeRect(x, y, w, h)
      })
    }
    if (img.complete) img.onload()
  }
}

export default Thumbnail

