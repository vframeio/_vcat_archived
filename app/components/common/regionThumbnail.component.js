import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

export default class RegionThumbnail extends Component {
  render() {
    const img = this.props.img
    if (!img || img.loading) {
      return <div className='spinner' />
    }
    return (
      <canvas ref='canvas' onClick={this.props.onClick} />
    )
  }
  componentDidMount(){
    this.repaint()
  }
  shouldComponentUpdate(nextProps){
    const r0 = this.props.rect
    const r1 = nextProps.rect
    return (
      this.props.img !== nextProps.img ||
      r0.x !== r1.x ||
      r0.y !== r1.y ||
      r0.width !== r1.width ||
      r0.height !== r1.height
    )
  }
  componentDidUpdate(){
    this.repaint()
  }
  repaint(){
    const img = this.props.img
    if (!img || img.loading) return
    const rect = this.props.rect
    const canvas = this.refs.canvas
    const ctx = canvas.getContext('2d')
    canvas.width = img.naturalWidth / img.naturalHeight * rect.width / rect.height * 64
    canvas.height = 64
    const x = rect.x * img.naturalWidth
    const y = rect.y * img.naturalHeight
    const w = rect.width * img.naturalWidth
    const h = rect.height * img.naturalHeight
    ctx.drawImage(
      img,
      x, y, w, h,
      0, 0, canvas.width, canvas.height
    )
  }
}
